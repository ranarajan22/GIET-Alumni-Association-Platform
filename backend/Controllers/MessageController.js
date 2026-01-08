const Conversation = require("../Models/conversation");
const Message = require("../Models/message");
const User = require("../Models/users");
const Alumni = require("../Models/alumni");
const { getReceiverSocketId, getIo } = require("../socket/socket");

const sendMessage = async (req, res) => {
    try {
      const { message } = req.body;
      const { id: receiverId } = req.params;
  
      // Get senderId from middleware's attached user object
      const senderId = req.user._id;
  
      if (!senderId) {
        return res.status(401).json({ error: "Unauthorized access. SenderId missing." });
      }
  
      // Find or create conversation
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      });
  
      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId],
        });
      }
  
      // Create a new message
      const newMessage = new Message({
        senderId,
        receiverId,
        message,
      });
  
      // Push message into conversation
      conversation.messages.push(newMessage._id);
  
      // Save both message and conversation
      const [savedConversation, savedMessage] = await Promise.all([conversation.save(), newMessage.save()]);
  
      if (!savedConversation || !savedMessage) {
        throw new Error("Error saving conversation or message.");
      }
  
      // Emit the message to the receiver via WebSocket
      const receiverSocketId = getReceiverSocketId(receiverId);
      const io = getIo();
      if (receiverSocketId && io) {
        io.to(receiverSocketId).emit("message", savedMessage);
        console.log(`Message sent to receiver ${receiverId} via socket`);
      } else {
        console.log(`Receiver ${receiverId} not connected or socket not found`);
      }
  
      res.status(201).json(savedMessage);
    } catch (error) {
      console.error("Error in sendMessage controller:", error.message);
      res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
  };
  

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;  // receiverId from params
    const senderId = req.user._id;  // senderId from authenticated user (set in middleware)

    // Find the conversation between sender and receiver
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");  // Populate messages in conversation

    if (!conversation) {
      return res.status(200).json([]);  // No messages if conversation not found
    }

    // Filter out messages deleted for current user
    const messages = conversation.messages.filter(
      (msg) => !msg.deletedFor || !msg.deletedFor.includes(senderId)
    );

    // Mark all unread messages as read by the current user
    const unreadMessages = messages.filter(
      (msg) => msg.receiverId.toString() === senderId.toString() && 
      (!msg.readBy || !msg.readBy.includes(senderId))
    );
    
    if (unreadMessages.length > 0) {
      await Promise.all(
        unreadMessages.map(async (msg) => {
          if (!msg.readBy) msg.readBy = [];
          if (!msg.readBy.includes(senderId)) {
            msg.readBy.push(senderId);
            await msg.save();
          }
        })
      );
    }
    
    res.status(200).json(messages);  // Return the messages
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { sendMessage, getMessages };

// New: get chat contacts for authenticated user with unread message count
const getChatContacts = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Find all conversations involving the user
    const conversations = await Conversation.find({ participants: userId }).populate("messages");

    if (!conversations || conversations.length === 0) {
      return res.status(200).json([]);
    }

    // Collect other participant IDs and calculate unread counts
    const contactMap = new Map();
    
    conversations.forEach((conv) => {
      const otherParticipant = conv.participants.find(p => p.toString() !== userId.toString());
      if (otherParticipant) {
        const otherParticipantId = otherParticipant.toString();
        
        // Count unread messages (messages sent by other participant that user hasn't read)
        const unreadCount = conv.messages.filter(msg => 
          msg.receiverId.toString() === userId.toString() && 
          msg.senderId.toString() === otherParticipantId &&
          !msg.deletedFor?.includes(userId) &&
          (!msg.readBy || !msg.readBy.includes(userId))
        ).length;
        
        contactMap.set(otherParticipantId, { unreadCount });
      }
    });

    const contactIds = Array.from(contactMap.keys());

    // Fetch contacts from both User and Alumni collections
    const [users, alumni] = await Promise.all([
      User.find({ _id: { $in: contactIds } }).select("fullName email collegeEmail profilePhoto role"),
      Alumni.find({ _id: { $in: contactIds } }).select("fullName collegeEmail profilePhoto role"),
    ]);

    // Normalize shape and add unread count
    const normalize = (doc) => ({
      _id: doc._id,
      fullName: doc.fullName || doc.name || "",
      email: doc.email || doc.collegeEmail || "",
      profilePhoto: doc.profilePhoto || "",
      role: doc.role || "user",
      unreadCount: contactMap.get(doc._id.toString())?.unreadCount || 0
    });

    const contacts = [
      ...users.map(normalize),
      ...alumni.map((a) => ({ ...normalize(a), role: "alumni" })),
    ];

    return res.status(200).json(contacts);
  } catch (error) {
    console.error("Error in getChatContacts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getChatContacts = getChatContacts;

// Delete conversation and all its messages
const deleteConversation = async (req, res) => {
  try {
    const { id: otherUserId } = req.params;
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Find the conversation between the two users
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Delete all messages in the conversation
    await Message.deleteMany({ _id: { $in: conversation.messages } });

    // Delete the conversation itself
    await Conversation.deleteOne({ _id: conversation._id });

    return res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error in deleteConversation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.deleteConversation = deleteConversation;

// Delete message for current user only
const deleteMessageForMe = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Add user to deletedFor array if not already present
    if (!message.deletedFor.includes(userId)) {
      message.deletedFor.push(userId);
      await message.save();
    }

    return res.status(200).json({ message: "Message deleted for you" });
  } catch (error) {
    console.error("Error in deleteMessageForMe:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete message for everyone
const deleteMessageForEveryone = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Only sender can delete for everyone
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You can only delete your own messages for everyone" });
    }

    // Delete the message completely
    await Message.deleteOne({ _id: messageId });

    // Remove from conversation's messages array
    await Conversation.updateMany(
      { messages: messageId },
      { $pull: { messages: messageId } }
    );

    // Emit socket event to notify receiver
    const io = getIo();
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId && io) {
      io.to(receiverSocketId).emit('messageDeleted', { messageId });
    }

    return res.status(200).json({ message: "Message deleted for everyone" });
  } catch (error) {
    console.error("Error in deleteMessageForEveryone:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.deleteMessageForMe = deleteMessageForMe;
module.exports.deleteMessageForEveryone = deleteMessageForEveryone;
