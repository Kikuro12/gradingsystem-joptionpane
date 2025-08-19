const mongoose = require('mongoose');
const User = require('./server/models/User');
const Document = require('./server/models/Document');
require('dotenv').config();

// Test data setup script
async function setupTestData() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kiur-hub');
    console.log('✅ Connected to MongoDB');

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = new User({
      username: 'admin',
      email: 'admin@kiurhub.ph',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });

    try {
      await adminUser.save();
      console.log('✅ Admin user created (admin@kiurhub.ph / admin123)');
    } catch (error) {
      if (error.code === 11000) {
        console.log('ℹ️  Admin user already exists');
      } else {
        console.error('❌ Error creating admin user:', error.message);
      }
    }

    // Create sample regular user
    console.log('👤 Creating sample user...');
    const sampleUser = new User({
      username: 'juan_cruz',
      email: 'juan@example.com',
      password: 'password123',
      firstName: 'Juan',
      lastName: 'Cruz',
      role: 'user',
      location: {
        city: 'Manila',
        province: 'Metro Manila'
      }
    });

    try {
      await sampleUser.save();
      console.log('✅ Sample user created (juan@example.com / password123)');
    } catch (error) {
      if (error.code === 11000) {
        console.log('ℹ️  Sample user already exists');
      } else {
        console.error('❌ Error creating sample user:', error.message);
      }
    }

    // Create sample documents
    console.log('📄 Creating sample documents...');
    const sampleDocuments = [
      {
        title: 'Birth Certificate Application Form',
        description: 'Official form for applying for a birth certificate from the Philippine Statistics Authority (PSA). Required for passport applications, school enrollment, and other official transactions.',
        category: 'Government Forms',
        subcategory: 'Civil Registry',
        tags: ['birth certificate', 'PSA', 'civil registry', 'government form'],
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
        description: 'Complete application form for obtaining a business permit from local government units. Includes requirements checklist and step-by-step instructions.',
        category: 'Business Forms',
        subcategory: 'Permits',
        tags: ['business permit', 'LGU', 'entrepreneur', 'small business'],
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
        description: 'Official DFA passport application form for new passport applications and renewals. Includes guidelines for proper completion and required documents.',
        category: 'Government Forms',
        subcategory: 'Immigration',
        tags: ['passport', 'DFA', 'travel document', 'immigration'],
        filePath: '/sample/passport-form.pdf',
        fileName: 'passport-form.pdf',
        fileSize: 334560,
        fileType: 'pdf',
        uploadedBy: adminUser._id,
        approvalStatus: 'approved',
        isFeatured: true,
        downloadCount: 2100
      },
      {
        title: 'Tax Declaration Form (BIR 1701)',
        description: 'Bureau of Internal Revenue form for annual income tax declaration. Includes instructions and computation worksheets for individual taxpayers.',
        category: 'Tax Documents',
        subcategory: 'Income Tax',
        tags: ['BIR', 'income tax', 'tax declaration', '1701'],
        filePath: '/sample/bir-1701.pdf',
        fileName: 'bir-1701.pdf',
        fileSize: 412800,
        fileType: 'pdf',
        uploadedBy: sampleUser._id,
        approvalStatus: 'approved',
        downloadCount: 756
      },
      {
        title: 'Barangay Clearance Application',
        description: 'Standard application form for barangay clearance. Required for various transactions including job applications, business permits, and residency verification.',
        category: 'Government Forms',
        subcategory: 'Local Government',
        tags: ['barangay clearance', 'local government', 'residency', 'clearance'],
        filePath: '/sample/barangay-clearance.pdf',
        fileName: 'barangay-clearance.pdf',
        fileSize: 156720,
        fileType: 'pdf',
        uploadedBy: sampleUser._id,
        approvalStatus: 'approved',
        downloadCount: 445
      }
    ];

    for (const docData of sampleDocuments) {
      try {
        const existingDoc = await Document.findOne({ title: docData.title });
        if (!existingDoc) {
          const document = new Document(docData);
          await document.save();
          console.log(`✅ Created document: ${docData.title}`);
        } else {
          console.log(`ℹ️  Document already exists: ${docData.title}`);
        }
      } catch (error) {
        console.error(`❌ Error creating document ${docData.title}:`, error.message);
      }
    }

    console.log('\n🎉 Test data setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   • Admin user: admin@kiurhub.ph / admin123');
    console.log('   • Sample user: juan@example.com / password123');
    console.log('   • Sample documents: 5 documents created');
    console.log('\n🚀 You can now start the application with: npm run dev');

  } catch (error) {
    console.error('❌ Error setting up test data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  setupTestData();
}

module.exports = setupTestData;