import { useState } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import { useNotificationStore } from "../context/NotificationContext";

const NotificationBell = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    clearNotification,
    markAllAsRead,
  } = useNotificationStore();

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-700 hover:text-primary transition-colors"
        aria-label="Notifications"
      >
        <FaBell className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-800">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{unreadCount} new</span>
              )}
            </div>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-2 flex justify-between items-center border-b text-xs text-gray-600">
              <button
                onClick={() => markAllAsRead()}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Mark all read
              </button>
              <span className="text-gray-500">{notifications.length} total</span>
            </div>
          )}

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 transition cursor-pointer ${
                    notification.unread ? "bg-blue-50" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{notification.title}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotification(notification.id);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="text-sm" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  <p className="text-xs text-gray-400">
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : "Just now"}
                  </p>
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-gray-500">No notifications</p>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t text-center text-xs text-gray-500">
              You are up to date
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
