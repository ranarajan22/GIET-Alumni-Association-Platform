import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useNotificationStore } from "../context/NotificationContext";

const useListenMessages = ({ onMessageReceived } = {}) => {
  const { socket } = useSocketContext();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!socket) return;
  
    const handleMessage = (message) => {
      if (onMessageReceived) {
        onMessageReceived(message);
      }
      addNotification({
        title: message?.senderName || 'New message',
        message: message?.message || 'You received a message',
        type: 'message',
        meta: { senderId: message?.senderId },
      });
    };
  
    socket.on("message", handleMessage);
  
    // Cleanup the event listener on unmount
    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket, onMessageReceived, addNotification]);
  
};

export default useListenMessages;
