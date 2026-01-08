import { useEffect, useMemo, useState } from 'react';
import { X, Clock, Users, Briefcase, Bell, RefreshCw, CheckSquare, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { useNotificationStore } from '../context/NotificationContext';

const NotificationsPanel = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAllAsRead, clearAll, markAsRead, clearNotification, lastUpdated } = useNotificationStore();
  const [localUpdated, setLocalUpdated] = useState(lastUpdated || null);

  useEffect(() => {
    if (notifications && notifications.length >= 0) {
      setLocalUpdated(new Date());
    }
  }, [notifications]);

  const mapped = useMemo(() => notifications.map((notif) => {
    let Icon = Bell;
    if (notif.type === 'event') Icon = Clock;
    if (notif.type === 'mentorship') Icon = Users;
    if (notif.type === 'job') Icon = Briefcase;
    if (notif.type === 'message') Icon = Bell;
    return { ...notif, Icon };
  }), [notifications]);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={onClose} />}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                {unreadCount > 0 ? <span>{unreadCount} unread</span> : <span>All caught up</span>}
                {(localUpdated || lastUpdated) && (
                  <span className="text-gray-400">• Updated {(localUpdated || lastUpdated).toLocaleTimeString()}</span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded transition" aria-label="Close notifications">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocalUpdated(new Date())}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded transition"
            >
              <CheckSquare className="w-4 h-4" /> Mark all read
            </button>
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded transition"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          </div>
        </div>

        {mapped.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <p className="text-sm">No notifications yet</p>
            <p className="text-xs text-gray-400 mt-1">You&apos;ll be notified when new posts are shared</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {mapped.map((notif) => {
              const Icon = notif.Icon;
              return (
                <div
                  key={notif.id}
                  className={`p-4 hover:bg-gray-50 transition cursor-pointer border-l-4 ${
                    notif.unread ? 'border-l-blue-600 bg-blue-50' : 'border-l-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg mt-0.5">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-sm ${notif.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notif.title || notif.label}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => clearNotification(notif.id)}
                      className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  {notif.unread && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="mt-2 text-xs text-blue-600 font-semibold hover:text-blue-700"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

NotificationsPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NotificationsPanel;
