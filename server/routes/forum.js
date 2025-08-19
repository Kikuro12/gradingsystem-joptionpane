const express = require('express');
const { body, validationResult } = require('express-validator');
const ForumPost = require('../models/ForumPost');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all forum posts with filtering
router.get('/posts', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      search,
      tags,
      author,
      page = 1,
      limit = 20,
      sort = 'lastActivity'
    } = req.query;

    // Build query
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    if (author) {
      query.author = author;
    }

    // Sort options
    let sortOptions = {};
    switch (sort) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'popular':
        sortOptions = { 'likes.length': -1, views: -1 };
        break;
      case 'replies':
        sortOptions = { 'replies.length': -1 };
        break;
      case 'lastActivity':
      default:
        sortOptions = { isPinned: -1, lastActivity: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await ForumPost.find(query)
      .populate('author', 'username firstName lastName avatar')
      .populate('replies.author', 'username firstName lastName avatar')
      .sort(sortOptions)
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

// Get forum categories and counts
router.get('/categories', async (req, res) => {
  try {
    const categories = await ForumPost.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          latestPost: { $max: '$lastActivity' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(categories);
  } catch (error) {
    console.error('Error fetching forum categories:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});

// Get single forum post
router.get('/posts/:id', optionalAuth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'username firstName lastName avatar')
      .populate('replies.author', 'username firstName lastName avatar');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Error fetching forum post:', error);
    res.status(500).json({ message: 'Server error while fetching post' });
  }
});

// Create new forum post
router.post('/posts', authenticateToken, [
  body('title')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('content')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Content must be between 10 and 5000 characters'),
  body('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category, tags } = req.body;

    // Process tags
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    const post = new ForumPost({
      title,
      content,
      category,
      tags: tagArray,
      author: req.user._id
    });

    await post.save();

    const populatedPost = await ForumPost.findById(post._id)
      .populate('author', 'username firstName lastName avatar');

    res.status(201).json({
      message: 'Post created successfully',
      post: populatedPost
    });
  } catch (error) {
    console.error('Error creating forum post:', error);
    res.status(500).json({ message: 'Server error while creating post' });
  }
});

// Update forum post
router.put('/posts/:id', authenticateToken, [
  body('title').optional()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('content').optional()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Content must be between 10 and 5000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    const { title, content, category, tags } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (tags) {
      post.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    post.isEdited = true;
    post.editedAt = new Date();

    await post.save();

    const updatedPost = await ForumPost.findById(post._id)
      .populate('author', 'username firstName lastName avatar')
      .populate('replies.author', 'username firstName lastName avatar');

    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Error updating forum post:', error);
    res.status(500).json({ message: 'Server error while updating post' });
  }
});

// Add reply to forum post
router.post('/posts/:id/replies', authenticateToken, [
  body('content')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Reply content must be between 1 and 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.isLocked) {
      return res.status(403).json({ message: 'This post is locked' });
    }

    const { content } = req.body;

    const reply = {
      author: req.user._id,
      content
    };

    post.replies.push(reply);
    post.lastActivity = new Date();
    await post.save();

    const updatedPost = await ForumPost.findById(post._id)
      .populate('author', 'username firstName lastName avatar')
      .populate('replies.author', 'username firstName lastName avatar');

    res.status(201).json({
      message: 'Reply added successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Server error while adding reply' });
  }
});

// Like/Unlike post
router.post('/posts/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id;
    const likeIndex = post.likes.findIndex(like => like.user.toString() === userId.toString());

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push({ user: userId });
    }

    await post.save();

    res.json({
      message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
      likes: post.likes.length,
      isLiked: likeIndex === -1
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Server error while toggling like' });
  }
});

// Like/Unlike reply
router.post('/posts/:postId/replies/:replyId/like', authenticateToken, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const reply = post.replies.id(req.params.replyId);

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    const userId = req.user._id;
    const likeIndex = reply.likes.findIndex(like => like.user.toString() === userId.toString());

    if (likeIndex > -1) {
      // Unlike
      reply.likes.splice(likeIndex, 1);
    } else {
      // Like
      reply.likes.push({ user: userId });
    }

    await post.save();

    res.json({
      message: likeIndex > -1 ? 'Reply unliked' : 'Reply liked',
      likes: reply.likes.length,
      isLiked: likeIndex === -1
    });
  } catch (error) {
    console.error('Error toggling reply like:', error);
    res.status(500).json({ message: 'Server error while toggling reply like' });
  }
});

// Delete forum post
router.delete('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await ForumPost.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting forum post:', error);
    res.status(500).json({ message: 'Server error while deleting post' });
  }
});

module.exports = router;