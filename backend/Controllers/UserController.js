const User = require('../Models/users'); // Ensure you are importing User correctly
const Alumni = require('../Models/alumni'); // Import Alumni model

const getAllStudents = async (req, res) => {
  try {
        // Return only student roles and omit sensitive data like password
        const students = await User.find({ role: 'student' }).select('-password');
    res.status(200).json({ students });
  } catch (error) {
    console.error('Error fetching students:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to retrieve students' });
    }
  }
};

const getUsersForSidebar = async (req, res) => {
    try {
        const currentUserId = req.user?._id; // Current user ID from authenticated request

        // Check if the current user is an alumni or a student
        // If req.user has a 'role' field and it's 'alumni', they're an alumni user
        const isAlumni = req.user?.role === 'alumni';

        let users = [];

        if (isAlumni) {
            // If current user is alumni, fetch all students and other alumni
            const students = await User.find(
                { _id: { $ne: currentUserId } },
                '_id fullName profilePhoto email'
            );

            const otherAlumni = await Alumni.find(
                { _id: { $ne: currentUserId } },
                '_id fullName profilePhoto email role'
            );

            // Add role information to students
            const studentsWithRole = students.map(student => ({
                _id: student._id,
                fullName: student.fullName,
                profilePhoto: student.profilePhoto,
                email: student.email,
                role: 'student'
            }));

            // Alumni already have role field, just ensure it's included
            const alumniWithRole = otherAlumni.map(alumni => ({
                _id: alumni._id,
                fullName: alumni.fullName,
                profilePhoto: alumni.profilePhoto,
                email: alumni.email,
                role: 'alumni'
            }));

            users = [...studentsWithRole, ...alumniWithRole];
        } else {
            // If current user is a student, fetch only alumni users
            const otherAlumni = await Alumni.find(
                { _id: { $ne: currentUserId } },
                '_id fullName profilePhoto email role'
            );

            users = otherAlumni.map(alumni => ({
                _id: alumni._id,
                fullName: alumni.fullName,
                profilePhoto: alumni.profilePhoto,
                email: alumni.email,
                role: 'alumni'
            }));
        }

        res.status(200).json({ users });
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to retrieve users' });
        }
    }
};


module.exports = { getUsersForSidebar, getAllStudents };
