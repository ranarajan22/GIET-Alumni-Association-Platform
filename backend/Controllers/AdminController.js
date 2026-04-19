const Alumni = require('../Models/alumni');
const User = require('../Models/users');
const Event = require('../Models/event');
const JobOpening = require('../Models/JobOpening');
const Mentorship = require('../Models/Mentorship');
const bcrypt = require('bcrypt');

function normalizeIdentityFields(record) {
  const rollNumber = record?.registrationNumber || '';
  const registrationNumber = record?.usn || record?.registrationNumber || '';
  return {
    ...record,
    rollNumber,
    registrationNumber,
    usn: record?.usn || registrationNumber
  };
}

function tempPasswordFromDob(dob) {
  const date = new Date(dob);
  if (Number.isNaN(date.getTime())) return '';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = String(date.getFullYear());
  return `${dd}${mm}${yyyy}`;
}

// Controller to get all alumni (for admin)
const getAllAlumni = async (req, res) => {
  try {
    // Include certificate for admin review but exclude sensitive password hash
    const alumni = await Alumni.find().select('-password').lean();
    res.status(200).json({ alumni: alumni.map(normalizeIdentityFields) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch alumni list' });
  }
};

// Real-time-ish metrics: counts
const getMetrics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAlumni = await Alumni.countDocuments({});
    const verifiedAlumni = totalAlumni;
    const eventsCount = await Event.countDocuments({});
    const jobsCount = await JobOpening.countDocuments({});
    const mentorshipsCount = await Mentorship.countDocuments({});

    console.log('Metrics:', { totalStudents, totalAlumni, verifiedAlumni, eventsCount, jobsCount, mentorshipsCount });

    res.status(200).json({
      totalStudents,
      totalAlumni,
      verifiedAlumni,
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
    const students = await User.find({ role: 'student' }).select('-password').lean();
    const normalizedStudents = students.map((student) => ({
      ...student,
      registrationNumber: student.usn || '',
      rollNumber: student.usn || ''
    }));
    res.status(200).json({ students: normalizedStudents });
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

// Change admin password
const changePassword = async (req, res) => {
  try {
    const { adminId, currentPassword, newPassword } = req.body;

    // Validation
    if (!adminId || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Find admin user
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found'
      });
    }

    if (admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. User is not an admin'
      });
    }

    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, admin.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, admin.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

const resetAlumniPasswordToDob = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) {
      return res.status(404).json({ success: false, message: 'Alumni not found' });
    }

    const tempPassword = tempPasswordFromDob(alumni.dob);
    if (!tempPassword) {
      return res.status(400).json({
        success: false,
        message: 'DOB missing or invalid for this alumni. Cannot reset to DOB pattern.'
      });
    }

    alumni.password = await bcrypt.hash(tempPassword, 10);
    alumni.passwordResetRequired = true;
    await alumni.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset to DOB pattern successfully',
      temporaryPassword: tempPassword,
      registrationNumber: alumni.registrationNumber,
      fullName: alumni.fullName
    });
  } catch (error) {
    console.error('Error resetting alumni password:', error);
    return res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
};

const addAlumniVisitDate = async (req, res) => {
  try {
    const { visitDate } = req.body;
    const parsedDate = visitDate ? new Date(visitDate) : new Date();

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid visit date format' });
    }

    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { dateOfVisit: parsedDate } },
      { new: true }
    );

    if (!alumni) {
      return res.status(404).json({ success: false, message: 'Alumni not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Visit date added successfully',
      dateOfVisit: alumni.dateOfVisit || []
    });
  } catch (error) {
    console.error('Error adding alumni visit date:', error);
    return res.status(500).json({ success: false, message: 'Failed to add visit date' });
  }
};

const deleteAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    
    if (!alumni) {
      return res.status(404).json({ success: false, message: 'Alumni not found' });
    }

    const alumniName = alumni.fullName || alumni.registrationNumber || 'Unknown';
    const alumniId = alumni._id;

    await Alumni.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: `Alumni profile for ${alumniName} deleted successfully`,
      deletedAlumniId: alumniId,
      deletedAlumniName: alumniName
    });
  } catch (error) {
    console.error('Error deleting alumni profile:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete alumni profile' });
  }
};

module.exports = { getAllAlumni, getMetrics, getStudents, getActivity, changePassword, resetAlumniPasswordToDob, addAlumniVisitDate, deleteAlumni };
