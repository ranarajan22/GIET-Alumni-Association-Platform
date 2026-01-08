// backend/routes/messageRoutes.js
const express = require("express");
const { sendMessage, getMessages, getChatContacts, deleteConversation, deleteMessageForMe, deleteMessageForEveryone } = require("../Controllers/MessageController");
const protectRoute = require("../Middlewares/ProtectRoute");

const router = express.Router();

// Route for sending a message to a user
router.post("/send/:id", protectRoute, sendMessage);

// Route to get chat contacts for authenticated user
router.get("/contacts", protectRoute, getChatContacts);

// Route to delete conversation with a user
router.delete("/conversation/:id", protectRoute, deleteConversation);

// Route to delete message for current user
router.delete("/:messageId/delete-for-me", protectRoute, deleteMessageForMe);

// Route to delete message for everyone
router.delete("/:messageId/delete-for-everyone", protectRoute, deleteMessageForEveryone);

// Route for getting messages between two users
router.get("/:id", protectRoute, getMessages);

module.exports = router;
