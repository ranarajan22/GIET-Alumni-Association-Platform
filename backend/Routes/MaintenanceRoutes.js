const express = require('express');
const { getMaintenanceStatus, updateMaintenanceStatus, checkMaintenanceStatus } = require('../Controllers/MaintenanceController');
const protectRoute = require('../Middlewares/ProtectRoute');
const requireAdmin = require('../Middlewares/RequireAdmin');

const router = express.Router();

// Public route - anyone can check maintenance status
router.get('/check', checkMaintenanceStatus);

// Admin routes - require authentication and admin role
router.get('/status', protectRoute, requireAdmin, getMaintenanceStatus);
router.put('/update', protectRoute, requireAdmin, updateMaintenanceStatus);

module.exports = router;
