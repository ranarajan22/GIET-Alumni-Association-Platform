const express = require('express');
const {
  submitContactForm,
  getAllContacts,
  getUnreadContacts,
  updateContactStatus,
  deleteContact
} = require('../Controllers/ContactController');
const protectRoute = require('../Middlewares/ProtectRoute');
const requireAdmin = require('../Middlewares/RequireAdmin');

const router = express.Router();

// Public route - submit contact form
router.post('/submit', submitContactForm);

// Admin only routes - view and manage contacts
router.get('/all', protectRoute, requireAdmin, getAllContacts);
router.get('/unread', protectRoute, requireAdmin, getUnreadContacts);
router.put('/:id', protectRoute, requireAdmin, updateContactStatus);
router.delete('/:id', protectRoute, requireAdmin, deleteContact);

module.exports = router;
