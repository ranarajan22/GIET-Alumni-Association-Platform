const express = require("express");
const router = express.Router();
const protectRoute = require('../Middlewares/ProtectRoute');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleInterested,
} = require("../Controllers/eventController");

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", protectRoute, createEvent);
router.put("/:id", protectRoute, updateEvent);
router.delete("/:id", protectRoute, deleteEvent);
router.post("/:id/interested", protectRoute, toggleInterested);

module.exports = router;
