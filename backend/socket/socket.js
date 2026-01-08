const socketIo = require('socket.io');

let io;
const userSocketMap = new Map();

/**
 * Initializes the Socket.IO server.
 * @param {Object} server - The HTTP server instance.
 */
const initSocket = (server, allowedOrigins = [], allowAllOrigins = false) => {
  // Use true to mirror the request origin when allowAllOrigins is enabled
  const socketOrigins = allowAllOrigins || allowedOrigins.length === 0 ? true : allowedOrigins;

  io = socketIo(server, {
    cors: {
      origin: socketOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Register user and map userId to socketId
    socket.on('registerUser', (userId) => {
      if (userId) {
        userSocketMap.set(userId, socket.id);
        console.log(`User ${userId} associated with socket ${socket.id}`);
      } else {
        console.error('UserId is not available! Socket connection will not be established.');
      }
    });

    // Handle message sending
    socket.on('sendMessage', (messageData) => {
      try {
        const { receiverId, senderId, message } = messageData;
        if (!receiverId || !senderId || !message) {
          throw new Error('Incomplete message data');
        }

        // Ensure receiverId exists in the map
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receiveMessage', { senderId, message });
          console.log(`Message sent to ${receiverId} via socket ${receiverSocketId}`);
        } else {
          console.log(`Receiver ${receiverId} is not connected.`);
        }
      } catch (error) {
        console.error('Error handling sendMessage event:', error.message);
      }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          console.log(`User ${userId} disconnected.`);
          break;
        }
      }
    });
  });
};

/**
 * Helper function to get the socket ID of a user by their userId.
 * @param {string} receiverId - The userId of the receiver.
 * @returns {string|null} - The socket ID if found, otherwise null.
 */
const getReceiverSocketId = (receiverId) => {
  return userSocketMap.get(receiverId) || null;
};

module.exports = { initSocket, getReceiverSocketId, getIo: () => io };
