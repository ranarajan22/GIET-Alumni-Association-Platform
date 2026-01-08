const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const openSourceSchema = new Schema({
  alumniId: {
    type: Schema.Types.ObjectId,
    ref: 'Alumni',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  languages: [{
    type: String,
    trim: true
  }],
  repoLink: {
    type: String,
    required: true,
    match: [
      /^https?:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/,
      'Please provide a valid GitHub repository URL'
    ]
  },
  stars: {
    type: Number,
    default: 0
  },
  contributors: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const OpenSource = mongoose.model('OpenSource', openSourceSchema);

module.exports = OpenSource;
