const express = require('express');
const User = require('../models/User');
const Document = require('../models/Document');

const router = express.Router();

// Production setup endpoint (one-time use)
router.post('/initialize', async (req, res) => {
  try {
    // Check if already initialized
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.json({ 
        message: 'Database already initialized',
        admin: existingAdmin.email 
      });
    }

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@kiurhub.ph',
      password: 'admin123', // Change this in production!
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });

    await adminUser.save();

    // Create sample documents
    const sampleDocuments = [
      {
        title: 'Birth Certificate Application Form',
        description: 'Official form for applying for a birth certificate from the Philippine Statistics Authority (PSA).',
        category: 'Government Forms',
        subcategory: 'Civil Registry',
        tags: ['birth certificate', 'PSA', 'civil registry'],
        filePath: '/sample/birth-cert-form.pdf',
        fileName: 'birth-cert-form.pdf',
        fileSize: 245760,
        fileType: 'pdf',
        uploadedBy: adminUser._id,
        approvalStatus: 'approved',
        isFeatured: true,
        downloadCount: 1250
      },
      {
        title: 'Business Permit Application Form',
        description: 'Complete application form for obtaining a business permit from local government units.',
        category: 'Business Forms',
        subcategory: 'Permits',
        tags: ['business permit', 'LGU', 'entrepreneur'],
        filePath: '/sample/business-permit-form.pdf',
        fileName: 'business-permit-form.pdf',
        fileSize: 189440,
        fileType: 'pdf',
        uploadedBy: adminUser._id,
        approvalStatus: 'approved',
        isFeatured: true,
        downloadCount: 890
      },
      {
        title: 'Passport Application Form',
        description: 'Official DFA passport application form for new passport applications and renewals.',
        category: 'Government Forms',
        subcategory: 'Immigration',
        tags: ['passport', 'DFA', 'travel document'],
        filePath: '/sample/passport-form.pdf',
        fileName: 'passport-form.pdf',
        fileSize: 334560,
        fileType: 'pdf',
        uploadedBy: adminUser._id,
        approvalStatus: 'approved',
        isFeatured: true,
        downloadCount: 2100
      }
    ];

    const createdDocs = await Document.insertMany(sampleDocuments);

    res.json({
      message: 'Kiur Hub database initialized successfully!',
      admin: {
        email: adminUser.email,
        username: adminUser.username,
        note: 'Please change the default password immediately'
      },
      documents: createdDocs.length,
      status: 'success'
    });

  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ 
      message: 'Error initializing database',
      error: error.message 
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Kiur Hub API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;