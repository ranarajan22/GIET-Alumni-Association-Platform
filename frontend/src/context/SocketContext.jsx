import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { io } from 'socket.io-client';
import { SOCKET_BASE_URL } from '../config';

// Create a context for the socket
export const SocketContext = createContext();

// SocketProvider component to wrap the app and provide the socket connection
export const SocketProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Warn if no userId is provided
    if (!userId) {
      console.warn('UserId is not available! Socket connection will not be established.');
      return;
    }

    // Initialize the socket connection
    const newSocket = io(SOCKET_BASE_URL, {
      withCredentials: true,
    });

    // Handle socket connection
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      newSocket.emit('registerUser', userId); // Send userId to the server
    });

    // Handle socket connection errors
    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    // Handle socket disconnections
    newSocket.on('disconnect', () => {
      console.warn('Socket disconnected');
    });

    // Set socket to state
    setSocket(newSocket);

    // Cleanup the socket connection when component is unmounted or userId changes
    return () => {
      if (newSocket) {
        newSocket.disconnect();
        console.log('Socket disconnected and cleaned up.');
      }
      setSocket(null);
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ userId, socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// PropTypes validation for SocketProvider
SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
  userId: PropTypes.string, // userId is optional now
};

// Custom hook to access the socket context
// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = () => {
  const context = useContext(SocketContext);

  // Ensure the hook is being used within a SocketProvider
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }

  return context;
};
