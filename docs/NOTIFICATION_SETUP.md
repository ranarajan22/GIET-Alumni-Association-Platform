/**
 * NOTIFICATION SYSTEM SETUP GUIDE
 * 
 * To enable the notification system for all new posts (events, mentorships, jobs),
 * you need to add the following endpoints and logic to your backend:
 */

// ============================================
// 1. ADD NOTIFICATION MODEL (Models/notification.js)
// ============================================

/*
const notificationSchema = new Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['event', 'mentorship', 'job', 'message', 'system'],
    required: true
  },
  title: String,
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
*/

// ============================================
// 2. ADD NOTIFICATION ROUTES (Routes/notificationRoutes.js)
// ============================================

/*
const express = require('express');
const router = express.Router();
const Notification = require('../Models/notification');
const { ProtectRoute } = require('../Middlewares/ProtectRoute');

// Get all notifications for logged-in user
router.get('/notifications', ProtectRoute, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'fullName profilePhoto');
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', ProtectRoute, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete notification
router.delete('/notifications/:id', ProtectRoute, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
*/

// ============================================
// 3. ADD HELPER FUNCTION (utils/notificationHelper.js or similar)
// ============================================

/*
const Notification = require('../Models/notification');
const User = require('../Models/users');

exports.notifyAllUsers = async (type, title, message, sender) => {
  try {
    // Get all users (or filter by role if needed)
    const users = await User.find({});
    
    // Create notification for each user
    const notifications = users
      .filter(user => user._id.toString() !== sender._id.toString()) // Don't notify sender
      .map(user => ({
        recipient: user._id,
        sender: sender._id,
        type,
        title,
        message
      }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (error) {
    console.error('Error creating notifications:', error);
  }
};
*/

// ============================================
// 4. INTEGRATE WITH EVENT CREATION (Controllers/eventController.js)
// ============================================

/*
const { notifyAllUsers } = require('../utils/notificationHelper');

exports.createEvent = async (req, res) => {
  try {
    // ... existing event creation logic ...
    
    const event = new Event({
      // ... event data ...
    });
    await event.save();

    // Create notifications for all users
    await notifyAllUsers(
      'event',
      'New Event: ' + event.description,
      `${req.user.fullName} scheduled a new event: "${event.description}"`,
      req.user
    );

    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
*/

// ============================================
// 5. INTEGRATE WITH MENTORSHIP CREATION (Controllers/MentorshipController.js)
// ============================================

/*
exports.createMentorship = async (req, res) => {
  try {
    // ... existing mentorship creation logic ...
    
    const mentorship = new Mentorship({
      // ... mentorship data ...
    });
    await mentorship.save();

    // Create notifications for all users
    await notifyAllUsers(
      'mentorship',
      'New Mentorship: ' + mentorship.topic,
      `${req.user.fullName} is offering mentorship on "${mentorship.topic}"`,
      req.user
    );

    res.json({ success: true, mentorship });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
*/

// ============================================
// 6. INTEGRATE WITH JOB OPENING CREATION (Controllers/jobController.js)
// ============================================

/*
exports.createJobOpening = async (req, res) => {
  try {
    // ... existing job creation logic ...
    
    const job = new JobOpening({
      // ... job data ...
    });
    await job.save();

    // Create notifications for all users
    await notifyAllUsers(
      'job',
      'New Job: ' + job.title,
      `${req.user.fullName} posted a new job opening: "${job.title}"`,
      req.user
    );

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
*/

// ============================================
// 7. REGISTER NOTIFICATION ROUTES IN server.js
// ============================================

/*
const notificationRoutes = require('./Routes/notificationRoutes');
app.use('/api', notificationRoutes);
*/

// ============================================
// SUMMARY
// ============================================

/*
After implementing the above:

1. Every time a user creates an event, mentorship, or job opening,
   notifications will be sent to ALL other users

2. Users can see notifications in the bell icon on the dashboard

3. Notifications show:
   - Title and message
   - Type (event, mentorship, job)
   - Timestamp
   - Read/unread status

4. Users can:
   - Mark notifications as read
   - Delete notifications
   - See unread count in the bell badge

5. The notification panel refreshes every 10 seconds for real-time updates
*/

export default {};
