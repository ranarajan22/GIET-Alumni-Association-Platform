const User = require('../Models/users'); // Ensure you are importing User correctly
const Alumni = require('../Models/alumni'); // Import Alumni model

const NETWORK_STUDENT_FIELDS = [
    '_id',
    'fullName',
    'graduationYear',
    'collegeEmail',
    'course',
    'usn',
    'branch',
    'fieldOfStudy',
    'profilePhoto',
    'linkedin',
    'github',
    'role',
    'createdAt'
].join(' ');

function attachStudentIdentityFields(record) {
    const registrationNumber = record?.usn || '';
    return {
        ...record,
        registrationNumber,
        rollNumber: registrationNumber
    };
}

const getAllStudents = async (req, res) => {
  try {
                const filter = { role: 'student' };
                if (req.query.batch) filter.graduationYear = Number(req.query.batch);
                if (req.query.course) filter.course = req.query.course;
                if (req.query.branch) {
                    filter.$or = [{ branch: req.query.branch }, { fieldOfStudy: req.query.branch }];
                }
                if (req.query.search) {
                    const regex = new RegExp(req.query.search, 'i');
                    filter.$or = [
                        ...(filter.$or || []),
                        { fullName: regex },
                        { collegeEmail: regex },
                        { usn: regex }
                    ];
                }

                // Student network list should expose only required profile fields + social links.
                const students = await User.find(filter).select(NETWORK_STUDENT_FIELDS).lean();
    res.status(200).json({ students: students.map(attachStudentIdentityFields) });
  } catch (error) {
    console.error('Error fetching students:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to retrieve students' });
    }
  }
};

const getStudentFacets = async (req, res) => {
    try {
        const [batchValues, courseValues, branchValues, fieldValues] = await Promise.all([
            User.distinct('graduationYear', { role: 'student' }),
            User.distinct('course', { role: 'student' }),
            User.distinct('branch', { role: 'student' }),
            User.distinct('fieldOfStudy', { role: 'student' })
        ]);

        const mergedBranches = Array.from(new Set([...(branchValues || []), ...(fieldValues || [])]));

        res.status(200).json({
            batches: batchValues.filter(Boolean).sort((a, b) => a - b),
            courses: courseValues.filter(Boolean).sort(),
            branches: mergedBranches.filter(Boolean).sort()
        });
    } catch (error) {
        console.error('Error fetching student facets:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to retrieve student facets' });
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


module.exports = { getUsersForSidebar, getAllStudents, getStudentFacets };
