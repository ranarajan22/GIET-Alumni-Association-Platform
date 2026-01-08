const express = require('express');
const { getAllAlumni, verifyAlumni, getMetrics, getStudents, getActivity } = require('../Controllers/AdminController');
const protectRoute = require('../Middlewares/ProtectRoute');
const requireAdmin = require('../Middlewares/RequireAdmin');
const router = express.Router();

// Metrics
router.get('/metrics', protectRoute, requireAdmin, getMetrics);

// Students list
router.get('/students', protectRoute, requireAdmin, getStudents);

// Alumni list
router.get('/alumni', protectRoute, requireAdmin, getAllAlumni);

// Verify alumni
router.put('/alumni/:id/verify', protectRoute, requireAdmin, verifyAlumni);

// Combined activity feed
router.get('/activity', protectRoute, requireAdmin, getActivity);

module.exports = router;
