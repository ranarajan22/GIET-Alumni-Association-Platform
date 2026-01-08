require('dotenv').config();
const mongoose = require('mongoose');
const Mentorship = require('../Models/Mentorship');

async function run() {
  const title = process.argv.slice(2).join(' ');
  if (!title) {
    console.error('Usage: node scripts/purge-mentorships.js "<title substring>"');
    process.exit(1);
  }
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGO_URI (or MONGODB_URI) not set in environment');
    }
    await mongoose.connect(uri);
    const regex = new RegExp(title.trim(), 'i');
    const result = await Mentorship.deleteMany({ title: regex });
    console.log(`Deleted ${result.deletedCount} mentorship(s) matching title: ${title}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error purging mentorships:', err.message);
    process.exit(2);
  }
}

run();
