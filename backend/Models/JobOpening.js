const mongoose = require('mongoose');

const jobOpeningSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alumni',
  },
  posterName: {
    type: String,
  },
  posterEmail: {
    type: String,
  },
  posterPhoto: {
    type: String,
  },
  posterGraduationYear: {
    type: Number,
  },
  posterCourse: {
    type: String,
  },
  posterFieldOfStudy: {
    type: String,
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
  closedAt: {
    type: Date,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('JobOpening', jobOpeningSchema);
