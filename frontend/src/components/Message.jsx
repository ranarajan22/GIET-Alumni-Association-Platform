import React, { useState, useEffect, useContext, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import { SendHorizontal, Search, X, MoreVertical, Trash2, UserX, Trash, Menu } from 'lucide-react';
import moment from 'moment';
import { assets } from '../assets/assets';
import { API_BASE_URL } from '../config';

const Messages = ({ preSelectedUser }) => {
  const { socket, userId } = useContext(SocketContext);
  const [selectedUser, setSelectedUser] = useState(preSelectedUser || null);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteMenuPosition, setDeleteMenuPosition] = useState({ x: 0, y: 0 });
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);

  const getAuthToken = () => localStorage.getItem('token');

  // Update selectedUser when preSelectedUser changes
  useEffect(() => {
    if (preSelectedUser) {
      console.log('Pre-selected user updated:', preSelectedUser);
      setSelectedUser(preSelectedUser);
    }
  }, [preSelectedUser]);

  // Fetch chat contacts
  const handleAuthFailure = (status, message) => {
    const m = message || '';
    if (status === 400 || status === 401 || status === 403 || m.includes('Invalid token') || m.includes('Access denied')) {
      setSendError('Your session expired. Please log in again.');
      try { localStorage.removeItem('token'); } catch (_) {}
      setTimeout(() => { window.location.href = '/login'; }, 800);
    }
  };

  const fetchContacts = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.warn('No auth token available');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/messages/contacts`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorText = '';
        try { errorText = await response.text(); } catch (_) {}
        console.error('Failed to fetch contacts:', response.status, errorText);
        handleAuthFailure(response.status, errorText);
        return;
      }

      const data = await response.json();
      const contactsList = Array.isArray(data) ? data : [];
      setUsers(contactsList);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  // Register user with socket when socket and userId are ready
  useEffect(() => {
    if (socket && userId) {
      console.log('Registering user with socket:', userId);
      socket.emit('registerUser', userId);
    }
  }, [socket, userId]);

  // Fetch contacts on mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Periodic refresh of contacts to keep unread counts updated
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchContacts();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (!selectedUser) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/messages/${selectedUser._id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        );

        if (!response.ok) {
          console.error('Failed to fetch messages:', response.status);
          handleAuthFailure(response.status, 'messages');
          return;
        }
        const data = await response.json();
        // Sort messages by createdAt descending (newest first)
        const sortedMessages = Array.isArray(data) 
          ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [];
        setMessages(sortedMessages);
        
        // Refresh contacts list to update unread counts after viewing messages
        setTimeout(() => {
          fetchContacts();
        }, 500); // Small delay to ensure backend has updated readBy status
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  // Listen for incoming messages via Socket.IO
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      console.log('Received message via socket:', message);
      // Add new message at the beginning (newest first)
      setMessages((prev) => [message, ...prev]);
      // Refresh contacts when any message arrives, so new chats appear
      fetchContacts();
    };

    const handleMessageDeleted = ({ messageId }) => {
      console.log('Message deleted via socket:', messageId);
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };

    socket.on('message', handleReceiveMessage);
    socket.on('messageDeleted', handleMessageDeleted);

    return () => {
      socket.off('message', handleReceiveMessage);
      socket.off('messageDeleted', handleMessageDeleted);
    };
  }, [socket]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) {
      console.warn('Cannot send message: missing content or user selection');
      return;
    }

    const messageData = {
      message: newMessage,
    };

    try {
      setIsSending(true);
      setSendError('');
      console.log('Sending message to:', selectedUser._id);
      const response = await fetch(
        `${API_BASE_URL}/messages/send/${selectedUser._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify(messageData),
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        let errorText = '';
        try {
          if (contentType.includes('application/json')) {
            const j = await response.json();
            errorText = JSON.stringify(j);
          } else {
            errorText = await response.text();
          }
        } catch (_) {
          errorText = '[no body]';
        }
        console.error('Failed to send message:', response.status, errorText);
        setSendError(`Send failed (status ${response.status}). ${errorText}`);
        handleAuthFailure(response.status, errorText);
        return;
      }

      const data = await response.json();
      console.log('Message sent successfully:', data);
      // Add new message at the beginning (newest first)
      setMessages((prev) => [data, ...prev]);
      setNewMessage('');

      // Ensure the selected user appears in contacts after first message
      setUsers((prev) => {
        const exists = prev.some((u) => u._id === selectedUser._id);
        if (!exists) {
          const newContact = {
            _id: selectedUser._id,
            fullName: selectedUser.fullName || selectedUser.name || '',
            email: selectedUser.email || selectedUser.collegeEmail || '',
            profilePhoto: selectedUser.profilePhoto || '',
            role: selectedUser.role || 'user',
            unreadCount: 0
          };
          return [newContact, ...prev];
        }
        return prev;
      });
      
      // Refresh contacts to update any counts
      fetchContacts();
    } catch (error) {
      console.error('Error sending message:', error);
      setSendError('Network error while sending message. Is backend running?');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = async () => {
    if (!selectedUser) return;
    
    const confirmed = window.confirm('Delete entire conversation? This cannot be undone.');
    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/messages/conversation/${selectedUser._id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        console.error('Failed to clear chat:', response.status);
        return;
      }

      setMessages([]);
      setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));
      setSelectedUser(null);
      setShowMenu(false);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const handleRemoveFromChat = () => {
    if (!selectedUser) return;
    
    setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));
    setSelectedUser(null);
    setShowMenu(false);
  };

  const handleMessageClick = (e, message) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isSender = message.senderId === userId;
    const menuWidth = 200;
    const menuHeight = message.senderId === userId ? 100 : 60;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let x = e.clientX;
    let y = e.clientY;
    
    // For sent messages (right side), show menu on the left
    if (isSender) {
      x = Math.max(10, e.clientX - menuWidth - 10);
    } else {
      // For received messages (left side), show menu on the right
      x = Math.min(viewportWidth - menuWidth - 10, e.clientX + 10);
    }
    
    // Adjust vertical position to stay in viewport
    if (y + menuHeight > viewportHeight) {
      y = viewportHeight - menuHeight - 10;
    }
    
    setSelectedMessage(message);
    setDeleteMenuPosition({ x, y });
  };

  const handleDeleteForMe = async () => {
    if (!selectedMessage) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/messages/${selectedMessage._id}/delete-for-me`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (response.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== selectedMessage._id));
      }
    } catch (error) {
      console.error('Error deleting message for me:', error);
    } finally {
      setSelectedMessage(null);
    }
  };

  const handleDeleteForEveryone = async () => {
    if (!selectedMessage) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/messages/${selectedMessage._id}/delete-for-everyone`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (response.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== selectedMessage._id));
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message for everyone:', error);
    } finally {
      setSelectedMessage(null);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-show sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close header menu on outside click or Escape
  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setShowMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [showMenu]);

  return (
    <div className="flex h-full bg-gray-100 dark:bg-slate-950 relative rounded-lg overflow-hidden shadow-lg">
      {/* Sidebar */}
      <div className={`${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      } w-full md:w-1/3 lg:w-[30%] border-r border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden flex flex-col fixed md:relative h-full z-30 transition-transform duration-300 md:translate-x-0`}>
        <div className="p-3 sm:p-4 border-b bg-gradient-to-r from-cyan-600 to-blue-600 flex-shrink-0">
          <h2 className="text-lg font-semibold mb-3 text-white">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-6 py-2 border-0 rounded-full bg-white dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-slate-600 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className="px-4 py-2 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
          <p className="text-xs text-gray-600 dark:text-slate-400">
            {users.filter(u => {
              const fullName = (u.fullName || '').toLowerCase();
              const email = (u.email || '').toLowerCase();
              const query = (searchQuery || '').toLowerCase();
              return fullName.includes(query) || email.includes(query);
            }).length} Chats
          </p>
        </div>
        
        <ul className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
          {users.filter(u => {
            const fullName = (u.fullName || '').toLowerCase();
            const email = (u.email || u.collegeEmail || '').toLowerCase();
            const query = (searchQuery || '').toLowerCase();
            return fullName.includes(query) || email.includes(query);
          }).length > 0 ? (
            users
              .filter(u => {
                const fullName = (u.fullName || '').toLowerCase();
                const email = (u.email || u.collegeEmail || '').toLowerCase();
                const query = (searchQuery || '').toLowerCase();
                return fullName.includes(query) || email.includes(query);
              })
              .map((user) => (
                <li
                  key={user._id}
                  onClick={() => {
                    setSelectedUser(user);
                    // Auto-close sidebar on mobile after selection
                    if (window.innerWidth < 768) {
                      setShowSidebar(false);
                    }
                  }}
                  className={`p-3 cursor-pointer border-b border-gray-200 dark:border-slate-700 transition-all duration-200 ${
                    selectedUser?._id === user._id
                      ? 'bg-blue-50 dark:bg-slate-800'
                      : 'hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="relative">
                        <img
                          src={user.profilePhoto || assets.Profile}
                          alt={user.fullName}
                          className="w-10 h-10 rounded-full mr-3 object-cover flex-shrink-0"
                        />
                        {user.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white animate-pulse">
                            {user.unreadCount > 9 ? '9+' : user.unreadCount}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-gray-900 dark:text-white">{user.fullName || user.name || 'User'}</p>
                        {user.email && <p className="text-xs opacity-75 truncate text-gray-600 dark:text-slate-400">{user.email}</p>}
                      </div>
                    </div>
                    <span
                      className={`ml-2 px-2 py-1 text-xs font-semibold rounded whitespace-nowrap flex-shrink-0 ${
                        user.role === 'alumni'
                          ? 'bg-purple-200 text-purple-800'
                          : 'bg-blue-200 text-blue-800'
                      } ${selectedUser?._id === user._id ? 'bg-opacity-30' : ''}`}
                    >
                      {user.role === 'alumni' ? '🎓 Alumni' : '👨‍🎓 Student'}
                    </span>
                  </div>
                </li>
              ))
          ) : (
            <li className="p-4 text-center text-gray-500 dark:text-slate-400">
              {searchQuery ? 'No users found' : 'No users available for messaging'}
            </li>
          )}
        </ul>
      </div>

      {/* Overlay for mobile */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Chat Section */}
      <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col relative">
        {/* Header */}
        <div className="p-2.5 sm:p-3 md:p-4 bg-gradient-to-r from-cyan-600 to-blue-600 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10 flex items-center justify-between shadow-md group">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="md:hidden p-2 hover:bg-blue-700 rounded-lg mr-2 text-white flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
          {selectedUser ? (
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <img
                src={selectedUser.profilePhoto || assets.Profile}
                alt={selectedUser.fullName || selectedUser.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-blue-300 shadow-md"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-semibold truncate text-white">
                  {selectedUser.fullName || selectedUser.name || selectedUser.email || selectedUser.collegeEmail}
                </h2>
                <p className="text-[10px] sm:text-xs text-blue-100 truncate">
                  {selectedUser.role === 'alumni' ? '🎓 Alumni' : '👨‍🎓 Student'}
                </p>
              </div>
            </div>
          ) : (
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white flex-1">
              Select a user to chat
            </h2>
          )}
          {selectedUser && (
            <div 
              className="relative"
              ref={menuRef}
            >
              <button
                onClick={() => setShowMenu((v) => !v)}
                className="p-2 hover:bg-blue-700 rounded-full transition cursor-pointer"
                title="Options"
                aria-haspopup="menu"
                aria-expanded={showMenu}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden animate-slideIn">
                  <button
                    onClick={handleClearChat}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-red-500/20 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Chat
                  </button>
                  <button
                    onClick={handleRemoveFromChat}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3 text-gray-800 dark:text-slate-200 transition-colors text-sm font-medium border-t border-gray-200 dark:border-slate-700"
                  >
                    <UserX className="w-4 h-4" />
                    Remove from Chat
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Message List */}
        <div 
          className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 pb-3 sm:pb-4 md:pb-6 space-y-2 flex flex-col-reverse scroll-smooth bg-gray-50 dark:bg-slate-950" 
        >
          {messages.length === 0 && selectedUser && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-slate-400 text-center">No messages yet<br/><span className="text-sm">Start the conversation!</span></p>
            </div>
          )}
          {messages.map((msg, index) => {
            const isSender = msg.senderId === userId;
            return (
              <div
                key={msg._id || index}
                className={`flex ${isSender ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div className="max-w-[90%] sm:max-w-[85%] md:max-w-md relative group">
                  <div
                    onClick={(e) => handleMessageClick(e, msg)}
                    className={`p-2.5 sm:p-3 rounded-lg shadow cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                      isSender 
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-200 dark:bg-slate-800 text-gray-900 dark:text-white rounded-bl-none'
                    }`}
                  >
                    <p className="break-words whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  <div
                    className={`text-[10px] mt-1 px-1 ${
                      isSender ? 'text-right' : 'text-left'
                    } text-gray-600 dark:text-slate-500`}
                  >
                    {moment(msg.createdAt).format('h:mm A')}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Delete Menu */}
        {selectedMessage && (
          <>
            <div
              className="fixed inset-0 z-30 bg-black bg-opacity-5 backdrop-blur-[1px]"
              onClick={() => setSelectedMessage(null)}
            />
            <div
              className="fixed bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl z-40 min-w-[200px] animate-slideIn overflow-hidden"
              style={{
                left: `${deleteMenuPosition.x}px`,
                top: `${deleteMenuPosition.y}px`,
              }}
            >
              <button
                onClick={handleDeleteForMe}
                className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200"
              >
                <Trash className="w-4 h-4" />
                Delete for me
              </button>
              {selectedMessage.senderId === userId && (
                <button
                  onClick={handleDeleteForEveryone}
                  className="w-full px-4 py-3 text-left hover:bg-red-500/20 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-600 dark:text-red-400 border-t border-gray-200 dark:border-slate-700 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete for everyone
                </button>
              )}
            </div>
          </>
        )}

        {/* Input */}
        {selectedUser && (
          <div className="px-3 sm:px-4 md:px-6 py-3 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 sticky bottom-0">
            {sendError && (
              <div className="mb-2 text-sm text-red-400">{sendError}</div>
            )}
            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 dark:border-slate-700 rounded-full px-4 sm:px-5 md:px-6 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent transition-all bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 shadow-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={isSending || !newMessage.trim()}
                className={`p-2.5 sm:p-3 text-white rounded-full transition-all transform hover:scale-105 shadow-md ${
                  isSending || !newMessage.trim()
                    ? 'bg-gray-400 dark:bg-slate-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500'
                }`}
              >
                <SendHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
