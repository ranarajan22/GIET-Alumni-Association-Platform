const express = require('express');
const Mentorship = require('../Models/Mentorship');
const protectRoute = require('../Middlewares/ProtectRoute');
const requireAdmin = require('../Middlewares/RequireAdmin');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const mentorships = await Mentorship.find()
      .populate('mentorId', 'fullName graduationYear course fieldOfStudy linkedin github profilePhoto collegeEmail');
    res.json(mentorships);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching mentorships' });
  }
});

// POST a new mentorship
router.post('/', protectRoute, async (req, res) => {
  try {
    const { title, description, mentorName, mentorId, mentorEmail, mentorPhoto, mentorGraduationYear, mentorCourse, mentorFieldOfStudy } = req.body;
    const newMentorship = new Mentorship({ 
      title, 
      description, 
      mentorName, 
      mentorId, 
      mentorEmail, 
      mentorPhoto,
      mentorGraduationYear,
      mentorCourse,
      mentorFieldOfStudy
    });
    const savedMentorship = await newMentorship.save();
    res.status(201).json(savedMentorship);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a mentorship (only by mentor or admin)
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.body?.userId || req.user?._id;
    const userRole = req.body?.userRole || req.user?.role;
    const mentorship = await Mentorship.findById(req.params.id);
    
    if (!mentorship) {
      return res.status(404).json({ error: 'Mentorship not found' });
    }

    // Check if user is admin or the mentor
    if (userRole !== 'admin' && String(mentorship.mentorId) !== String(userId)) {
      return res.status(403).json({ error: 'Not authorized to delete this mentorship' });
    }

    await Mentorship.deleteOne({ _id: req.params.id });
    res.json({ message: 'Mentorship deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Hard delete mentorships by title match (case-insensitive)
router.delete('/admin/purge-by-title', protectRoute, requireAdmin, async (req, res) => {
  try {
    const { title } = req.query;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Query parameter "title" is required' });
    }
    const regex = new RegExp(title.trim(), 'i');
    const result = await Mentorship.deleteMany({ title: regex });
    return res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
