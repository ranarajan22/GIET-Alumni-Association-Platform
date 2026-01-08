import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSocketContext } from './SocketContext';
import notificationSound from '../assets/sounds/notification.mp3';

const NotificationContext = createContext();

const persistKey = 'notifications:store';

export function NotificationProvider({ children }) {
  const { socket } = useSocketContext();
  const [notifications, setNotifications] = useState(() => {
    try {
      const raw = localStorage.getItem(persistKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const audioRef = useRef(null);
  const lastUpdatedRef = useRef(new Date());

  useEffect(() => {
    audioRef.current = new Audio(notificationSound);
    audioRef.current.volume = 0.45;
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(persistKey, JSON.stringify(notifications));
      lastUpdatedRef.current = new Date();
    } catch {
      // ignore
    }
  }, [notifications]);

  const playSound = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.currentTime = 0;
      audio.play();
    } catch {
      // ignore autoplay rejection
    }
  }, []);

  const addNotification = useCallback((notif) => {
    const id = notif.id || notif._id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const newNotification = {
      id,
      title: notif.title || notif.label || 'Notification',
      message: notif.message || '',
      type: notif.type || 'general',
      createdAt: notif.createdAt || new Date().toISOString(),
      unread: notif.unread !== false,
      meta: notif.meta,
    };
    setNotifications((prev) => [newNotification, ...prev].slice(0, 100));
    playSound();
  }, [playSound]);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const clearNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  // Hook into socket events for live notifications
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (payload) => {
      addNotification({
        title: payload?.senderName || 'New message',
        message: payload?.message || 'You have a new message',
        type: 'message',
        meta: { senderId: payload?.senderId },
      });
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [socket, addNotification]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((n) => n.unread).length,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotification,
      clearAll,
      lastUpdated: lastUpdatedRef.current,
    }),
    [notifications, addNotification, markAsRead, markAllAsRead, clearNotification, clearAll]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotificationStore = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotificationStore must be used within NotificationProvider');
  return ctx;
};

export default NotificationContext;
