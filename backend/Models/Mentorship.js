const mongoose = require('mongoose');

const mentorshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  mentorName: { type: String },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumni' },
  mentorEmail: { type: String },
  mentorPhoto: { type: String },
  mentorGraduationYear: { type: Number },
  mentorCourse: { type: String },
  mentorFieldOfStudy: { type: String },
  isClosed: { type: Boolean, default: false },
  closedAt: { type: Date },
  postedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mentorship', mentorshipSchema);
