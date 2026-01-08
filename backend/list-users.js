require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./Models/users');

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const users = await User.find({}, 'fullName collegeEmail role').limit(20);
    
    console.log('📋 All Users in Database:\n');
    users.forEach((u, i) => {
      console.log(`${i + 1}. ${u.fullName}`);
      console.log(`   Email: ${u.collegeEmail}`);
      console.log(`   Role: ${u.role}\n`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listUsers();
