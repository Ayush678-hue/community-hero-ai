const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  issueType: {
    type: String,
    required: true,
    enum: [
      'Pothole',
      'Garbage Overflow',
      'Water Leakage',
      'Broken Road',
      'Streetlight Damage',
      'Sewage Issues',
      'Road Damage',
      'Public Cleanliness',
      'Infrastructure Damage'
    ]
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], 
      required: true
    }
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Reported', 'Verified', 'In Progress', 'Resolved'],
    default: 'Reported'
  },
  verificationCount: {
    type: Number,
    default: 0
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  verifiedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedDepartment: {
    type: String,
    default: 'Unassigned'
  },
  resolvedImageUrl: {
    type: String
  },
  aiAnalysis: {
    confidence: Number,
    summary: String,
    detectedObjects: [String],
    beforeAfterScore: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


ComplaintSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Complaint', ComplaintSchema);
