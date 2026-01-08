// Quick script to disable maintenance mode
require('dotenv').config();
const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  isActive: { type: Boolean, default: false },
  message: { type: String, default: 'We are currently performing maintenance. Please check back soon!' },
  estimatedTime: { type: String, default: '30 minutes' },
  lastUpdatedBy: { type: String },
  updatedAt: { type: Date, default: Date.now }
});

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

async function disableMaintenance() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const result = await Maintenance.updateMany(
      {},
      { 
        $set: { 
          isActive: false,
          updatedAt: new Date()
        } 
      }
    );
    
    console.log(`✅ Maintenance mode DISABLED`);
    console.log(`   Updated ${result.modifiedCount} record(s)`);
    
    // Show current status
    const current = await Maintenance.findOne();
    if (current) {
      console.log(`\n📊 Current Status:`);
      console.log(`   isActive: ${current.isActive}`);
      console.log(`   message: ${current.message}`);
    } else {
      console.log(`\n📊 No maintenance record found in database`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

disableMaintenance();
