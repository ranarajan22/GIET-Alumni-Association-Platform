const express = require('express');
const {
  addOpenSourceProject,
  getAllOpenSourceProjects,
  getAlumniOpenSourceProjects,
  getMyOpenSourceProjects,
  updateOpenSourceProject,
  deleteOpenSourceProject
} = require('../Controllers/OpenSourceController');
const protectRoute = require('../Middlewares/ProtectRoute');

const router = express.Router();

// Public routes
router.get('/all', getAllOpenSourceProjects);
router.get('/alumni/:alumniId', getAlumniOpenSourceProjects);

// Protected routes (require authentication)
router.post('/add', protectRoute, addOpenSourceProject);
router.get('/my-projects', protectRoute, getMyOpenSourceProjects);
router.put('/update/:id', protectRoute, updateOpenSourceProject);
router.delete('/delete/:id', protectRoute, deleteOpenSourceProject);

module.exports = router;
