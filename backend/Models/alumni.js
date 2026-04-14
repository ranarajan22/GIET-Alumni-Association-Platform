const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const alumniSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    graduationYear: {
        type: Number,
        required: true,
    },
    dob: {
        type: Date,
    },
    collegeEmail: {
        type: String,
        required: false,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    course: {
        type: String,
        trim: true,
    },
    usn: {
        type: String,
        trim: true,
    },
    fieldOfStudy: {
        type: String,
        trim: true,
    },
    branch: {
        type: String,
        trim: true,
    },
    mobile: {
        type: String,
        trim: true,
    },
    gender: {
        type: String,
        trim: true,
    },
    linkedin: {
        type: String,
        match: [/^https?:\/\/(www\.)?linkedin\.com\/.*$/, 'Please provide a valid LinkedIn profile URL'],
        trim: true,
    },
    github: {
        type: String,
        match: [/^https?:\/\/(www\.)?github\.com\/.*$/, 'Please provide a valid GitHub profile URL'],
        trim: true,
    },
    degreeCertificate: {
        type: String,
         // Stores the file path or URL of the uploaded certificate link
    },
    degreeCertificateImage: {
        type: String,
         // Stores the file path or URL of the uploaded certificate image
    },
    profilePhoto: {
        type: String, // Stores the file path or URL of the uploaded profile photo
        default: '',
    },
    verified: {
        type: Boolean,
        default: false, // Initially set to false when an alumni registers
    },
    passwordResetRequired: {
        type: Boolean,
        default: false,
    },
    importSource: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        enum: ['alumni'], // Define roles specifically for alumni
        required: true,
    },

    // Array to track followers (only students can follow alumni)
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields
});

// Change the model name to reflect that it represents alumni
const Alumni = mongoose.model('Alumni', alumniSchema);

module.exports = Alumni;
