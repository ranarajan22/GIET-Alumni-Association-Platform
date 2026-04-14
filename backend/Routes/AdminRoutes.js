const express = require('express');
const { getAllAlumni, verifyAlumni, getMetrics, getStudents, getActivity, changePassword, resetAlumniPasswordToDob } = require('../Controllers/AdminController');
const { importAlumniFromExcel, getImportHistory, getImportHistoryById } = require('../Controllers/AdminImportController');
const protectRoute = require('../Middlewares/ProtectRoute');
const requireAdmin = require('../Middlewares/RequireAdmin');
const upload = require('../Middlewares/multer');
const router = express.Router();

// Metrics
router.get('/metrics', protectRoute, requireAdmin, getMetrics);

// Students list
router.get('/students', protectRoute, requireAdmin, getStudents);

// Alumni list
router.get('/alumni', protectRoute, requireAdmin, getAllAlumni);

// Verify alumni
router.put('/alumni/:id/verify', protectRoute, requireAdmin, verifyAlumni);
router.put('/alumni/:id/reset-password-dob', protectRoute, requireAdmin, resetAlumniPasswordToDob);

// Combined activity feed
router.get('/activity', protectRoute, requireAdmin, getActivity);

// Change password
router.put('/change-password', protectRoute, requireAdmin, changePassword);

// Bulk import alumni from Excel (mode=preview or mode=commit)
router.post('/alumni-import', protectRoute, requireAdmin, upload.single('file'), importAlumniFromExcel);
router.get('/import-history', protectRoute, requireAdmin, getImportHistory);
router.get('/import-history/:id', protectRoute, requireAdmin, getImportHistoryById);

module.exports = router;
