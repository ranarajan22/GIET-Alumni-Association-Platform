const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    isActive: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'System is under maintenance. Please try again later.'
    },
    estimatedTime: {
      type: String,
      default: 'Unknown'
    },
    lastUpdatedBy: {
      type: String,
      default: 'System'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);
