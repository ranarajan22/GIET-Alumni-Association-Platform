// Script to verify maintenance is off and show status
require('dotenv').config();
const mongoose = require('mongoose');
const Maintenance = require('./Models/maintenance');

async function checkStatus() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const maintenance = await Maintenance.findOne();
    
    if (!maintenance) {
      console.log('📊 No maintenance record found');
      console.log('Creating new maintenance record with isActive=false...\n');
      const newMaint = new Maintenance({
        isActive: false,
        message: 'System is operational',
        estimatedTime: 'N/A'
      });
      await newMaint.save();
      console.log('✅ Maintenance record created\n');
    }
    
    const current = await Maintenance.findOne();
    console.log('📊 Current Maintenance Status:');
    console.log(`   isActive: ${current.isActive}`);
    console.log(`   message: ${current.message}`);
    console.log(`   estimatedTime: ${current.estimatedTime}`);
    console.log(`   lastUpdatedBy: ${current.lastUpdatedBy || 'System'}`);
    console.log(`   updatedAt: ${current.updatedAt}\n`);
    
    if (!current.isActive) {
      console.log('✅ System is OPERATIONAL - App should load normally');
    } else {
      console.log('⚠️  System is UNDER MAINTENANCE - Run disable-maintenance.js');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkStatus();
