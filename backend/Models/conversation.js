// backend/models/conversation.js

const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    // Allow mixed participants (students or alumni) by not constraining ref
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
    },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
