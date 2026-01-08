const Alumni = require('../Models/alumni'); // Alumni model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const { validationResult } = require("express-validator");

// Signup Function
const signupAlumni = async (req, res) => {
    try {
        // Destructure the required fields from the request body
        const { fullName, collegeEmail, registrationNumber, password, confirmPassword, graduationYear, linkedin, degreeCertificate } = req.body;
        const profilePhoto = req.files?.image?.[0]; // Expecting `req.files` for multiple uploads
        const degreeCertificateImage = req.files?.degreeCertificateImage?.[0];

        console.log({ fullName, collegeEmail, registrationNumber, password, confirmPassword, graduationYear, linkedin, degreeCertificate }, profilePhoto, degreeCertificateImage);

        // Check if an alumni with the given college email already exists
        const existingAlumni = await Alumni.findOne({ collegeEmail });
        if (existingAlumni) {
            return res.status(409).json({
                message: 'Alumni already exists, you can log in',
                success: false
            });
        }

        // Ensure passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
                success: false
            });
        }

        // Upload profile photo to Cloudinary
        const photoUpload = await cloudinary.uploader.upload(profilePhoto.path, { resource_type: 'image' });
        const profilePhotoURL = photoUpload.secure_url;

        // Upload degree certificate image to Cloudinary if provided
        let degreeCertificateImageURL = null;
        if (degreeCertificateImage) {
            const certUpload = await cloudinary.uploader.upload(degreeCertificateImage.path, { resource_type: 'image' });
            degreeCertificateImageURL = certUpload.secure_url;
        }

        // Create a new alumni instance
        const alumni = new Alumni({
            fullName,
            collegeEmail,
            registrationNumber,
            password: await bcrypt.hash(password, 10), // Hash the password
            graduationYear,
            linkedin,
            profilePhoto: profilePhotoURL,
            degreeCertificate,
            degreeCertificateImage: degreeCertificateImageURL,
            verified: false, // Mark as unverified initially
            role: 'alumni'
        });

        // Save the alumni to the database
        await alumni.save();

        // Respond with success message
        res.status(201).json({
            message: "Signup successful, awaiting verification",
            _id: alumni._id,
            success: true
        });
    } catch (err) {
        console.error(err); // Log errors for debugging
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Login Function
const loginAlumni = async (req, res) => {
    try {
        const { collegeEmail, password } = req.body;

        // Check if the alumni exists
        const alumni = await Alumni.findOne({ collegeEmail });
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

        // Check verification status
        if (!alumni.verified) {
            return res.status(403).json({
                message: 'Account not verified. Please ask Admin to verify your account.',
                success: false
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: alumni._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with token and alumni details
        res.status(200).json({
            message: 'Login successful',
            success: true,
            fullname: alumni.fullName,
            token,
            profilePhoto: alumni.profilePhoto,
            _id: alumni._id,
            role: 'alumni'
        });
    } catch (err) {
        console.error(err); // Log errors for debugging
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

module.exports = { signupAlumni, loginAlumni };
