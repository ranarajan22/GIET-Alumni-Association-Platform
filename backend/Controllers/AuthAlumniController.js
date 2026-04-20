const Alumni = require('../Models/alumni'); // Alumni model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Signup Function
const signupAlumni = async (req, res) => {
    return res.status(403).json({
        message: 'Public alumni registration is disabled. Please contact admin.',
        success: false
    });
};

// Login Function
const loginAlumni = async (req, res) => {
    try {
        const { collegeEmail, identifier, password } = req.body;
        const loginIdentifier = (identifier || collegeEmail || '').trim();

        if (!loginIdentifier) {
            return res.status(400).json({
                message: 'Roll number or email is required',
                success: false
            });
        }

        // Support login with either roll number or email
        const alumni = await Alumni.findOne({
            $or: [
                { rollNumber: loginIdentifier },
                { registrationNumber: loginIdentifier },
                { usn: loginIdentifier },
                { collegeEmail: loginIdentifier.toLowerCase() }
            ]
        });
        if (!alumni) {
            return res.status(400).json({
                message: 'Invalid email or password',
                success: false
            });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, alumni.password);
        if (!validPassword) {
            return res.status(400).json({
                message: 'Invalid email or password',
                success: false
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: alumni._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Respond with token and alumni details
        res.status(200).json({
            message: 'Login successful',
            success: true,
            fullname: alumni.fullName,
            token,
            profilePhoto: alumni.profilePhoto,
            _id: alumni._id,
            role: 'alumni',
            passwordResetRequired: !!alumni.passwordResetRequired
        });
    } catch (err) {
        console.error(err); // Log errors for debugging
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const changePasswordFirstLogin = async (req, res) => {
    try {
        const alumniId = req.user?._id;
        const { newPassword, confirmPassword } = req.body;

        if (!alumniId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: 'Both password fields are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        const alumni = await Alumni.findById(alumniId);
        if (!alumni) {
            return res.status(404).json({ success: false, message: 'Alumni not found' });
        }

        const isSameAsOld = await bcrypt.compare(newPassword, alumni.password);
        if (isSameAsOld) {
            return res.status(400).json({ success: false, message: 'New password must be different from old password' });
        }

        alumni.password = await bcrypt.hash(newPassword, 10);
        alumni.passwordResetRequired = false;
        await alumni.save();

        return res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error in changePasswordFirstLogin:', err.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = { signupAlumni, loginAlumni, changePasswordFirstLogin };
