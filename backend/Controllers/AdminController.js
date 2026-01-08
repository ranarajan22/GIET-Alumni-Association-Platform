const Alumni = require('../Models/alumni');
const User = require('../Models/users');
const Event = require('../Models/event');
const JobOpening = require('../Models/JobOpening');
const Mentorship = require('../Models/Mentorship');

// Controller to get all alumni (for admin)
const getAllAlumni = async (req, res) => {
  try {
    // Include certificate for admin review but exclude sensitive password hash
    const alumni = await Alumni.find().select('-password');
    res.status(200).json({ alumni });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch alumni list' });
  }
};

// Controller to verify alumni (by admin)
const verifyAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { verified: true }, // Update the 'verified' field
      { new: true }
    );
    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    res.json({ message: 'Alumni verified successfully', alumni });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying alumni' });
  }
};

// Real-time-ish metrics: counts
const getMetrics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAlumni = await Alumni.countDocuments({});
    const verifiedAlumni = await Alumni.countDocuments({ verified: true });
    const pendingVerifications = await Alumni.countDocuments({ verified: false });
    const eventsCount = await Event.countDocuments({});
    const jobsCount = await JobOpening.countDocuments({});
    const mentorshipsCount = await Mentorship.countDocuments({});

    console.log('Metrics:', { totalStudents, totalAlumni, verifiedAlumni, pendingVerifications, eventsCount, jobsCount, mentorshipsCount });

    res.status(200).json({
      totalStudents,
      totalAlumni,
      verifiedAlumni,
      pendingVerifications,
      eventsCount,
      jobsCount,
      mentorshipsCount
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
};

// Students list (filter only role student)
const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.status(200).json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// Activity feed: recent items by alumni
const getActivity = async (req, res) => {
  try {
    const [events, jobs, mentorships] = await Promise.all([
      Event.find({}).populate('createdBy', 'fullName profilePhoto').sort({ createdAt: -1 }).limit(10),
      JobOpening.find({}).populate('postedBy', 'fullName profilePhoto').sort({ postedAt: -1 }).limit(10),
      Mentorship.find({}).populate('mentorId', 'fullName profilePhoto').sort({ postedAt: -1 }).limit(10)
    ]);

    const feed = [];

    events.forEach(e => feed.push({
      type: 'event',
      id: e._id,
      title: e.title,
      by: e.createdBy?.fullName,
      photo: e.createdBy?.profilePhoto,
      createdAt: e.createdAt
    }));

    jobs.forEach(j => feed.push({
      type: 'job',
      id: j._id,
      title: j.title,
      by: j.posterName || (j.postedBy && j.postedBy.fullName),
      photo: j.posterPhoto || (j.postedBy && j.postedBy.profilePhoto),
      createdAt: j.postedAt
    }));

    mentorships.forEach(m => feed.push({
      type: 'mentorship',
      id: m._id,
      title: m.title,
      by: m.mentorName || (m.mentorId && m.mentorId.fullName),
      photo: m.mentorPhoto || (m.mentorId && m.mentorId.profilePhoto),
      createdAt: m.postedAt
    }));

    // Sort combined feed by time desc
    feed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ feed });
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
};

module.exports = { getAllAlumni, verifyAlumni, getMetrics, getStudents, getActivity };
