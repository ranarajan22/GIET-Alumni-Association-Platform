const express = require('express');
const JobOpening = require('../Models/JobOpening');
const protectRoute = require('../Middlewares/ProtectRoute');

const router = express.Router();

// GET all job openings
router.get("/", async (req, res) => {
  try {
    const jobs = await JobOpening.find()
      .populate('postedBy', 'fullName graduationYear course fieldOfStudy linkedin github profilePhoto collegeEmail');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new job opening
router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, description, company, link, postedBy, posterName, posterEmail, posterPhoto, posterGraduationYear, posterCourse, posterFieldOfStudy } = req.body;
    const newJob = new JobOpening({ 
      title, 
      description, 
      company, 
      link,
      postedBy,
      posterName,
      posterEmail,
      posterPhoto,
      posterGraduationYear,
      posterCourse,
      posterFieldOfStudy
    });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a job opening (only by poster or admin)
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.body?.userId || req.user?._id;
    const userRole = req.body?.userRole || req.user?.role;
    const job = await JobOpening.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job opening not found' });
    }

    // Check if user is admin or the poster
    if (userRole !== 'admin' && String(job.postedBy) !== String(userId)) {
      return res.status(403).json({ error: 'Not authorized to delete this job opening' });
    }

    await JobOpening.deleteOne({ _id: req.params.id });
    res.json({ message: 'Job opening deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
