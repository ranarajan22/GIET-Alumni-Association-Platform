const express = require('express');
const router = express.Router();
// Use the configured Cloudinary SDK instance
const cloudinary = require('cloudinary').v2;
const upload = require("../Middlewares/multer");

const handleUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file provided",
            });
        }

        console.log('[Upload] Received file:', {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
        });

        const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });
        return res.status(200).json({
            success: true,
            message: "Uploaded!",
            data: result,
        });
    } catch (err) {
        console.error('[Upload Error]', err?.message || err);
        return res.status(500).json({
            success: false,
            message: err?.message || "Error uploading image",
        });
    }
};

router.post('/student', upload.single('profilePhoto'), handleUpload);  
router.post('/alumni', upload.single('profilePhoto'), handleUpload);   

module.exports = router;
