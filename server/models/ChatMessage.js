const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['user', 'admin', 'system'],
    default: 'user'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    fileName: String,
    filePath: String,
    fileType: String
  }]
}, {
  timestamps: true
});

// Index for better query performance
chatMessageSchema.index({ createdAt: -1 });
chatMessageSchema.index({ sender: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);