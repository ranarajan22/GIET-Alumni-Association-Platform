const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    // Allow either Student(User) or Alumni IDs by not constraining ref
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    deletedFor: [{ type: mongoose.Schema.Types.ObjectId }], // Array of user IDs who deleted this message
    readBy: [{ type: mongoose.Schema.Types.ObjectId }], // Array of user IDs who have read this message
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
