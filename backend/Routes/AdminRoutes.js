const express = require('express');
const { getAllAlumni, getAlumniFacets, getMetrics, getStudents, getActivity, changePassword, resetAlumniPasswordToDob, addAlumniVisitDate, deleteAlumni } = require('../Controllers/AdminController');
const { importAlumniFromExcel, getImportHistory, getImportHistoryById } = require('../Controllers/AdminImportController');
const protectRoute = require('../Middlewares/ProtectRoute');
const requireAdmin = require('../Middlewares/RequireAdmin');
const multer = require('multer');
const router = express.Router();

const importUpload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		const lower = (file.originalname || '').toLowerCase();
		if (lower.endsWith('.xlsx')) {
			return cb(null, true);
		}
		return cb(new Error('Only .xlsx files are supported. Please re-save old .xls files as .xlsx and upload again.'));
	}
});

const handleImportUpload = (req, res, next) => {
	importUpload.single('file')(req, res, (err) => {
		if (!err) return next();

		if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
			return res.status(400).json({ success: false, message: 'File too large. Maximum allowed size is 10MB.' });
		}

		return res.status(400).json({ success: false, message: err.message || 'Failed to upload import file' });
	});
};

// Metrics
router.get('/metrics', protectRoute, requireAdmin, getMetrics);

// Students list
router.get('/students', protectRoute, requireAdmin, getStudents);

// Alumni list
router.get('/alumni', protectRoute, requireAdmin, getAllAlumni);
router.get('/alumni/facets', protectRoute, requireAdmin, getAlumniFacets);

router.put('/alumni/:id/reset-password-dob', protectRoute, requireAdmin, resetAlumniPasswordToDob);
router.put('/alumni/:id/visit-date', protectRoute, requireAdmin, addAlumniVisitDate);
router.delete('/alumni/:id', protectRoute, requireAdmin, deleteAlumni);

// Combined activity feed
router.get('/activity', protectRoute, requireAdmin, getActivity);

// Change password
router.put('/change-password', protectRoute, requireAdmin, changePassword);

// Bulk import alumni from Excel (mode=preview or mode=commit)
router.post('/alumni-import', protectRoute, requireAdmin, handleImportUpload, importAlumniFromExcel);
router.get('/import-history', protectRoute, requireAdmin, getImportHistory);
router.get('/import-history/:id', protectRoute, requireAdmin, getImportHistoryById);

module.exports = router;
