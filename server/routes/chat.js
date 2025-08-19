const express = require('express');
const { body, validationResult } = require('express-validator');
const ChatMessage = require('../models/ChatMessage');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get chat messages with pagination
router.get('/messages', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await ChatMessage.find()
      .populate('sender', 'username firstName lastName avatar role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Reverse to show oldest first
    messages.reverse();

    const total = await ChatMessage.countDocuments();

    res.json({
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ message: 'Server error while fetching messages' });
  }
});

// Send a new chat message
router.post('/messages', authenticateToken, [
  body('message')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message } = req.body;

    const chatMessage = new ChatMessage({
      sender: req.user._id,
      message,
      type: req.user.role === 'admin' ? 'admin' : 'user'
    });

    await chatMessage.save();

    const populatedMessage = await ChatMessage.findById(chatMessage._id)
      .populate('sender', 'username firstName lastName avatar role');

    // Emit the message via Socket.IO (handled in server/index.js)
    const { io } = require('../index');
    if (io) {
      io.emit('new-message', {
        ...populatedMessage.toObject(),
        senderName: `${populatedMessage.sender.firstName} ${populatedMessage.sender.lastName}`
      });
    }

    res.status(201).json({
      message: 'Message sent successfully',
      chatMessage: populatedMessage
    });
  } catch (error) {
    console.error('Error sending chat message:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
});

// Mark messages as read
router.put('/messages/read', authenticateToken, async (req, res) => {
  try {
    const { messageIds } = req.body;

    if (!Array.isArray(messageIds)) {
      return res.status(400).json({ message: 'messageIds must be an array' });
    }

    await ChatMessage.updateMany(
      { 
        _id: { $in: messageIds },
        'readBy.user': { $ne: req.user._id }
      },
      {
        $push: {
          readBy: {
            user: req.user._id,
            readAt: new Date()
          }
        }
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Server error while marking messages as read' });
  }
});

// Get unread message count for user
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const count = await ChatMessage.countDocuments({
      sender: { $ne: req.user._id },
      'readBy.user': { $ne: req.user._id }
    });

    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Server error while getting unread count' });
  }
});

// Delete a chat message (admin or sender only)
router.delete('/messages/:id', authenticateToken, async (req, res) => {
  try {
    const message = await ChatMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is sender or admin
    if (message.sender.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await ChatMessage.findByIdAndDelete(req.params.id);

    // Emit message deletion via Socket.IO
    const { io } = require('../index');
    if (io) {
      io.emit('message-deleted', { messageId: req.params.id });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat message:', error);
    res.status(500).json({ message: 'Server error while deleting message' });
  }
});

// Get chat statistics (admin only)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const totalMessages = await ChatMessage.countDocuments();
    const todayMessages = await ChatMessage.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    const messagesByType = await ChatMessage.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const activeUsers = await ChatMessage.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      },
      {
        $group: {
          _id: '$sender',
          messageCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
          messageCount: 1,
          username: { $arrayElemAt: ['$user.username', 0] },
          firstName: { $arrayElemAt: ['$user.firstName', 0] },
          lastName: { $arrayElemAt: ['$user.lastName', 0] }
        }
      },
      {
        $sort: { messageCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      totalMessages,
      todayMessages,
      messagesByType,
      activeUsers
    });
  } catch (error) {
    console.error('Error fetching chat stats:', error);
    res.status(500).json({ message: 'Server error while fetching chat statistics' });
  }
});

module.exports = router;