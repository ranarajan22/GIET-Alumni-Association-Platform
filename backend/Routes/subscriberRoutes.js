const express = require('express');
const { subscribe, unsubscribe, getSubscribers } = require('../Controllers/SubscriberController');
const protectRoute = require('../Middlewares/ProtectRoute');
const requireAdmin = require('../Middlewares/RequireAdmin');

const router = express.Router();

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Admin only routes
router.get('/list', protectRoute, requireAdmin, getSubscribers);

module.exports = router;
