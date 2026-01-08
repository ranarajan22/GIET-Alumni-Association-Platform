// Seed script to add test students to database
// Run this with: node seedStudents.js

const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./Models/users');
const bcrypt = require('bcrypt');

async function seedStudents() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb+srv://ranar:ranar%40123@cluster0.9d3zn.mongodb.net/alumni-db?retryWrites=true&w=majority');
    console.log('Connected to MongoDB');

    // Check existing students
    const existingCount = await User.countDocuments({ role: 'student' });
    console.log(`Existing students: ${existingCount}`);

    // Sample students to add
    const testStudents = [
      {
        fullName: 'John Doe',
        collegeEmail: '20cse001.john@giet.edu',
        password: await bcrypt.hash('password123', 10),
        graduationYear: 2025,
        course: 'CSE',
        fieldOfStudy: 'Computer Science',
        usn: '20CSE001',
        role: 'student'
      },
      {
        fullName: 'Jane Smith',
        collegeEmail: '20cse002.jane@giet.edu',
        password: await bcrypt.hash('password123', 10),
        graduationYear: 2025,
        course: 'CSE',
        fieldOfStudy: 'Computer Science',
        usn: '20CSE002',
        role: 'student'
      },
      {
        fullName: 'Mike Johnson',
        collegeEmail: '20it001.mike@giet.edu',
        password: await bcrypt.hash('password123', 10),
        graduationYear: 2024,
        course: 'IT',
        fieldOfStudy: 'Information Technology',
        usn: '20IT001',
        role: 'student'
      },
      {
        fullName: 'Sarah Williams',
        collegeEmail: '20ec001.sarah@giet.edu',
        password: await bcrypt.hash('password123', 10),
        graduationYear: 2025,
        course: 'ECE',
        fieldOfStudy: 'Electronics',
        usn: '20EC001',
        role: 'student'
      },
      {
        fullName: 'Alex Brown',
        collegeEmail: '20me001.alex@giet.edu',
        password: await bcrypt.hash('password123', 10),
        graduationYear: 2024,
        course: 'ME',
        fieldOfStudy: 'Mechanical Engineering',
        usn: '20ME001',
        role: 'student'
      }
    ];

    // Check which students don't exist and add them
    let addedCount = 0;
    for (const student of testStudents) {
      const exists = await User.findOne({ collegeEmail: student.collegeEmail });
      if (!exists) {
        await User.create(student);
        console.log(`✓ Added: ${student.fullName}`);
        addedCount++;
      } else {
        console.log(`✓ Already exists: ${student.fullName}`);
      }
    }

    // Check final count
    const finalCount = await User.countDocuments({ role: 'student' });
    console.log(`\nAdded: ${addedCount} new students`);
    console.log(`Total students now: ${finalCount}`);

    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding students:', error);
    process.exit(1);
  }
}

seedStudents();
