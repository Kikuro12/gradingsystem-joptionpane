const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const Document = require('../models/Document');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/documents');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Get all documents with filtering and search
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      subcategory,
      search,
      tags,
      featured,
      page = 1,
      limit = 20,
      sort = 'createdAt'
    } = req.query;

    // Build query
    let query = { approvalStatus: 'approved', isActive: true };

    if (category) {
      query.category = category;
    }

    if (subcategory) {
      query.subcategory = subcategory;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Sort options
    let sortOptions = {};
    switch (sort) {
      case 'downloads':
        sortOptions = { downloadCount: -1 };
        break;
      case 'title':
        sortOptions = { title: 1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const documents = await Document.find(query)
      .populate('uploadedBy', 'username firstName lastName')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Document.countDocuments(query);

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
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Server error while fetching documents' });
  }
});

// Get document categories and counts
router.get('/categories', async (req, res) => {
  try {
    const categories = await Document.aggregate([
      { $match: { approvalStatus: 'approved', isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          subcategories: { $addToSet: '$subcategory' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});

// Get popular/featured documents
router.get('/featured', async (req, res) => {
  try {
    const featured = await Document.find({
      isFeatured: true,
      approvalStatus: 'approved',
      isActive: true
    })
      .populate('uploadedBy', 'username firstName lastName')
      .sort({ downloadCount: -1 })
      .limit(10);

    const popular = await Document.find({
      approvalStatus: 'approved',
      isActive: true
    })
      .populate('uploadedBy', 'username firstName lastName')
      .sort({ downloadCount: -1 })
      .limit(10);

    res.json({ featured, popular });
  } catch (error) {
    console.error('Error fetching featured documents:', error);
    res.status(500).json({ message: 'Server error while fetching featured documents' });
  }
});

// Get single document
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('uploadedBy', 'username firstName lastName');

    if (!document || document.approvalStatus !== 'approved' || !document.isActive) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ message: 'Server error while fetching document' });
  }
});

// Download document
router.get('/:id/download', optionalAuth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document || document.approvalStatus !== 'approved' || !document.isActive) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const filePath = path.join(__dirname, '../uploads/documents', document.fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Increment download count
    document.downloadCount += 1;
    await document.save();

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${document.title}.${document.fileType}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Send file
    res.download(filePath, `${document.title}.${document.fileType}`);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({ message: 'Server error while downloading document' });
  }
});

// Upload document (authenticated users)
router.post('/upload', authenticateToken, upload.single('document'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Document file is required' });
    }

    const { title, description, category, subcategory, tags } = req.body;

    // Process tags
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    // Get file extension to determine type
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let fileType;
    switch (fileExtension) {
      case '.pdf':
        fileType = 'pdf';
        break;
      case '.doc':
        fileType = 'doc';
        break;
      case '.docx':
        fileType = 'docx';
        break;
      default:
        fileType = 'pdf';
    }

    const document = new Document({
      title,
      description,
      category,
      subcategory: subcategory || '',
      tags: tagArray,
      filePath: req.file.path,
      fileName: req.file.filename,
      fileSize: req.file.size,
      fileType,
      uploadedBy: req.user._id,
      approvalStatus: req.user.role === 'admin' ? 'approved' : 'pending'
    });

    await document.save();

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: await document.populate('uploadedBy', 'username firstName lastName')
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    // Clean up uploaded file if document creation fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error while uploading document' });
  }
});

// Update document (admin only)
router.put('/:id', authenticateToken, requireAdmin, [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, subcategory, tags, isFeatured, isActive } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Update fields if provided
    if (title) document.title = title;
    if (description) document.description = description;
    if (category) document.category = category;
    if (subcategory !== undefined) document.subcategory = subcategory;
    if (tags) {
      document.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    if (isFeatured !== undefined) document.isFeatured = isFeatured;
    if (isActive !== undefined) document.isActive = isActive;

    await document.save();

    res.json({
      message: 'Document updated successfully',
      document: await document.populate('uploadedBy', 'username firstName lastName')
    });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ message: 'Server error while updating document' });
  }
});

// Delete document (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Server error while deleting document' });
  }
});

module.exports = router;