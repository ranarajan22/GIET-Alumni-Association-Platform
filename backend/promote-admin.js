// Quick script to promote a user to admin
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./Models/users');

async function promoteToAdmin(collegeEmail) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const user = await User.findOne({ collegeEmail });
    
    if (!user) {
      console.log(`❌ User not found with email: ${collegeEmail}`);
      process.exit(1);
    }
    
    console.log(`\n📋 Current User Info:`);
    console.log(`   Name: ${user.fullName}`);
    console.log(`   Email: ${user.collegeEmail}`);
    console.log(`   Current Role: ${user.role}`);
    
    // Update role to admin
    user.role = 'admin';
    await user.save();
    
    console.log(`\n✅ User promoted to ADMIN successfully!`);
    console.log(`   New Role: ${user.role}`);
    console.log(`\nYou can now access the Admin Panel.`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('❌ Please provide email as argument');
  console.log('Usage: node promote-admin.js <email>');
  process.exit(1);
}

promoteToAdmin(email);
