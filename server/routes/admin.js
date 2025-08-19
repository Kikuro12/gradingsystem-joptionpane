const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Document = require('../models/Document');
const ForumPost = require('../models/ForumPost');
const ChatMessage = require('../models/ChatMessage');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalDocuments = await Document.countDocuments({ isActive: true });
    const pendingDocuments = await Document.countDocuments({ approvalStatus: 'pending' });
    const totalPosts = await ForumPost.countDocuments();
    const totalMessages = await ChatMessage.countDocuments();

    // Recent registrations (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: weekAgo },
      isActive: true 
    });

    // Document downloads this month
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const monthlyDownloads = await Document.aggregate([
      {
        $match: {
          updatedAt: { $gte: monthAgo },
          approvalStatus: 'approved'
        }
      },
      {
        $group: {
          _id: null,
          totalDownloads: { $sum: '$downloadCount' }
        }
      }
    ]);

    // Top categories
    const topCategories = await Document.aggregate([
      {
        $match: { approvalStatus: 'approved', isActive: true }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          downloads: { $sum: '$downloadCount' }
        }
      },
      {
        $sort: { downloads: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Recent activity
    const recentDocuments = await Document.find({ approvalStatus: 'pending' })
      .populate('uploadedBy', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentPosts = await ForumPost.find()
      .populate('author', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalDocuments,
        pendingDocuments,
        totalPosts,
        totalMessages,
        recentUsers,
        monthlyDownloads: monthlyDownloads[0]?.totalDownloads || 0
      },
      topCategories,
      recentActivity: {
        documents: recentDocuments,
        posts: recentPosts
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard data' });
  }
});

// User management
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, status } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// Update user status
router.put('/users/:id/status', [
  body('isActive').isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error while updating user status' });
  }
});

// Update user role
router.put('/users/:id/role', [
  body('role').isIn(['user', 'admin']).withMessage('Role must be either user or admin')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from demoting themselves
    if (user._id.toString() === req.user._id.toString() && role === 'user') {
      return res.status(400).json({ message: 'Cannot demote yourself' });
    }

    user.role = role;
    await user.save();

    res.json({
      message: `User role updated to ${role} successfully`,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error while updating user role' });
  }
});

// Document management - pending approvals
router.get('/documents/pending', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const documents = await Document.find({ approvalStatus: 'pending' })
      .populate('uploadedBy', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Document.countDocuments({ approvalStatus: 'pending' });

    res.json({
      documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching pending documents:', error);
    res.status(500).json({ message: 'Server error while fetching pending documents' });
  }
});

// Approve/reject document
router.put('/documents/:id/approval', [
  body('approvalStatus').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('rejectionReason').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { approvalStatus, rejectionReason } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    document.approvalStatus = approvalStatus;
    document.approvedBy = req.user._id;

    if (approvalStatus === 'rejected' && rejectionReason) {
      document.rejectionReason = rejectionReason;
    }

    await document.save();

    const populatedDocument = await Document.findById(document._id)
      .populate('uploadedBy', 'username firstName lastName')
      .populate('approvedBy', 'username firstName lastName');

    res.json({
      message: `Document ${approvalStatus} successfully`,
      document: populatedDocument
    });
  } catch (error) {
    console.error('Error updating document approval:', error);
    res.status(500).json({ message: 'Server error while updating document approval' });
  }
});

// Forum management - get all posts
router.get('/forum/posts', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await ForumPost.find(query)
      .populate('author', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ForumPost.countDocuments(query);

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    res.status(500).json({ message: 'Server error while fetching forum posts' });
  }
});

// Pin/unpin forum post
router.put('/forum/posts/:id/pin', async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.isPinned = !post.isPinned;
    await post.save();

    res.json({
      message: `Post ${post.isPinned ? 'pinned' : 'unpinned'} successfully`,
      post
    });
  } catch (error) {
    console.error('Error toggling post pin:', error);
    res.status(500).json({ message: 'Server error while toggling post pin' });
  }
});

// Lock/unlock forum post
router.put('/forum/posts/:id/lock', async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.isLocked = !post.isLocked;
    await post.save();

    res.json({
      message: `Post ${post.isLocked ? 'locked' : 'unlocked'} successfully`,
      post
    });
  } catch (error) {
    console.error('Error toggling post lock:', error);
    res.status(500).json({ message: 'Server error while toggling post lock' });
  }
});

// Delete forum post
router.delete('/forum/posts/:id', async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await ForumPost.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting forum post:', error);
    res.status(500).json({ message: 'Server error while deleting forum post' });
  }
});

// System settings (announcements, notifications, etc.)
router.get('/settings', async (req, res) => {
  try {
    // This would typically come from a settings collection
    // For now, return default settings
    const settings = {
      siteName: 'Kiur Hub',
      siteDescription: 'Free access to downloadable and printable government and personal documents',
      maintenanceMode: false,
      registrationEnabled: true,
      announcementText: '',
      announcementActive: false,
      maxFileSize: 10, // MB
      allowedFileTypes: ['pdf', 'doc', 'docx'],
      weatherApiEnabled: true,
      chatEnabled: true,
      forumEnabled: true
    };

    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error while fetching settings' });
  }
});

// Update system settings
router.put('/settings', [
  body('siteName').optional().isString().withMessage('Site name must be a string'),
  body('siteDescription').optional().isString().withMessage('Site description must be a string'),
  body('maintenanceMode').optional().isBoolean().withMessage('Maintenance mode must be boolean'),
  body('registrationEnabled').optional().isBoolean().withMessage('Registration enabled must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // In a real app, you would save these to a settings collection
    const updatedSettings = req.body;

    res.json({
      message: 'Settings updated successfully',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error while updating settings' });
  }
});

module.exports = router;