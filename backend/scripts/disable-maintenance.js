const mongoose = require('mongoose');
require('dotenv').config();

const Maintenance = require('../Models/maintenance');

async function disableMaintenance() {
  try {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not found in .env file');
    }
    console.log('Using MongoDB URI:', mongoUri.substring(0, 50) + '...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find and update maintenance record
    const maintenance = await Maintenance.findOne();

    if (!maintenance) {
      console.log('No maintenance record found. Creating new one with isActive: false');
      const newMaint = new Maintenance({
        isActive: false,
        message: 'System is operational',
        estimatedTime: 'N/A',
        lastUpdatedBy: 'System Script'
      });
      await newMaint.save();
      console.log('✅ Maintenance mode DISABLED successfully');
    } else {
      console.log('Found existing maintenance record. Updating...');
      maintenance.isActive = false;
      maintenance.message = 'System is operational';
      maintenance.estimatedTime = 'N/A';
      maintenance.lastUpdatedBy = 'System Script';
      maintenance.updatedAt = new Date();
      await maintenance.save();
      console.log('✅ Maintenance mode DISABLED successfully');
    }

    console.log('\nCurrent maintenance status:');
    const updated = await Maintenance.findOne();
    console.log(JSON.stringify(updated, null, 2));

    await mongoose.disconnect();
    console.log('\n✅ Done! Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error disabling maintenance:', error.message);
    process.exit(1);
  }
}

disableMaintenance();
