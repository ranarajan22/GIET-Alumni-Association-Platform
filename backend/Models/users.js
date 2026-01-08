const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
      },
      graduationYear: {
        type: Number,
        required: true
      },
      collegeEmail: {
        type: String,
        required: true,
        unique: true,
        match: [/^[0-9]{2}[a-z]{3}[0-9]{3}\.[a-z0-9]+@giet\.edu$/i, 'Please provide a valid college email address'],
        trim: true
      },
      
      course: {
        type: String,
        required: true
      },
      usn: {
        type: String,
        required: true,
        unique: true,
        trim: true
      },
      fieldOfStudy: {
        type: String,
        required: true
      },
      linkedin: {
        type: String,
        match: [/^https?:\/\/(www\.)?linkedin\.com\/.*$/, 'Please provide a valid LinkedIn profile URL'],
        trim: true
      },
      github: {
        type: String,
        match: [/^https?:\/\/(www\.)?github\.com\/.*$/, 'Please provide a valid GitHub profile URL'],
        trim: true
      },
      password: {
        type: String,
        required: true,
        minlength: 6
      },
      role: {
        type: String,
        enum: ['student', 'alumni', 'admin'],
        default: 'student'
      },
      profilePhoto: {
        type: String // This will store the file path or URL of the uploaded photo
      },

      // Arrays for following students and alumni
  followingStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  followingAlumni: [{ type: Schema.Types.ObjectId, ref: 'Alumni' }],

  // Array to track followers (only students can follow students)
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }]

    }, {
      timestamps: true // Automatically creates `createdAt` and `updatedAt` fields
    });

const User = mongoose.model('users', userSchema);

module.exports = User;