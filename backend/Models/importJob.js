const mongoose = require('mongoose');

const importJobSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true, trim: true },
    mode: { type: String, enum: ['preview', 'commit'], required: true },
    status: { type: String, enum: ['success', 'failed'], required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    uploadedByName: { type: String, trim: true },
    summary: { type: mongoose.Schema.Types.Mixed, default: {} },
    errorCount: { type: Number, default: 0 },
    rowErrors: { type: [mongoose.Schema.Types.Mixed], default: [] },
    imported: { type: mongoose.Schema.Types.Mixed, default: {} },
    errorMessage: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ImportJob', importJobSchema);
