const express = require('express');
const router = express.Router();
const { getAllAlumni, getAlumniProfile, getAlumniStats, updateAlumniProfile } = require('../Controllers/AlumniController');
const protectRoute = require('../Middlewares/ProtectRoute');

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`[AlumniRoutes] ${req.method} ${req.url}`);
  next();
});

// Handle both `/api/alumni-list` and `/api/alumni-profile` mounting
// When mounted at `/api/alumni-list`, these become:
// GET /api/alumni-list -> getAllAlumni
// GET /api/alumni-list/profile/:id -> getAlumniProfile
// When mounted at `/api/alumni-profile`, these become:
// GET /api/alumni-profile/:id -> getAlumniProfile (for profile fetch)
// PUT /api/alumni-profile/:id -> updateAlumniProfile (for profile update)

// For listing all alumni
router.get('/', getAllAlumni);

// For getting alumni stats (MUST come before /:id to avoid conflict)
router.get('/stats/:id', getAlumniStats);

// Protected routes for authenticated requests
router.get('/profile-protected', protectRoute, getAlumniProfile);
router.get('/stats-protected', protectRoute, getAlumniStats);

// For getting individual alumni profile by ID (MUST come after more specific routes)
router.get('/profile/:id', getAlumniProfile);
router.get('/:id', getAlumniProfile);

// Update alumni profile (protected)
router.put('/:id', protectRoute, updateAlumniProfile);

module.exports = router;
