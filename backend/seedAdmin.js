const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./Models/users');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ collegeEmail: '00adm001.admin@giet.edu' });
        
        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log('Email: 00adm001.admin@giet.edu');
            process.exit(0);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        // Create admin user
        const adminUser = new User({
            fullName: 'Admin User',
            collegeEmail: '00adm001.admin@giet.edu',
            password: hashedPassword,
            graduationYear: 2024,
            course: 'Administration',
            usn: 'ADMIN001',
            fieldOfStudy: 'System Administration',
            role: 'admin',
            profilePhoto: 'https://res.cloudinary.com/demo/image/upload/avatar-placeholder.jpg'
        });

        await adminUser.save();
        
        console.log('✅ Admin user created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email: 00adm001.admin@giet.edu');
        console.log('🔑 Password: Admin@123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  Please change this password after first login!');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        process.exit(1);
    }
};

seedAdmin();
