import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { MessageCircle, Trash2, Check } from 'lucide-react';

function ContactMessages({ theme = 'dark' }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ new: 0, read: 0, responded: 0, total: 0 });
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const base = API_BASE_URL;
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`${base}/contact/all`, { headers });
      setContacts(response.data.contacts);
      setStats(response.data.stats);
      setError('');
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsResponded = async (id) => {
    try {
      const base = API_BASE_URL;
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.put(`${base}/contact/${id}`, { status: 'responded' }, { headers });
      fetchContacts();
    } catch (err) {
      console.error('Error updating contact:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const base = API_BASE_URL;
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        await axios.delete(`${base}/contact/${id}`, { headers });
        fetchContacts();
      } catch (err) {
        console.error('Error deleting contact:', err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return isDark ? 'bg-blue-500/20 text-blue-300 border-blue-500/50' : 'bg-blue-100 text-blue-700 border-blue-300';
      case 'read':
        return isDark ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' : 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'responded':
        return isDark ? 'bg-green-500/20 text-green-300 border-green-500/50' : 'bg-green-100 text-green-700 border-green-300';
      default:
        return isDark ? 'bg-slate-500/20 text-slate-300' : 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-cyan-400 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={isDark ? 'space-y-6' : 'space-y-6 text-slate-900'}>
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className={isDark ? 'w-8 h-8 text-cyan-400' : 'w-8 h-8 text-cyan-600'} />
        <h1 className={isDark ? 'text-3xl font-bold text-white' : 'text-3xl font-bold text-slate-900'}>Contact Messages</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className={isDark ? 'bg-slate-800/40 border border-slate-700 rounded-xl p-4' : 'bg-white border border-slate-200 rounded-xl p-4'}>
          <p className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-600'}>Total Messages</p>
          <p className={isDark ? 'text-3xl font-bold text-white' : 'text-3xl font-bold text-slate-900'}>{stats.total}</p>
        </div>
        <div className="bg-blue-800/40 border border-blue-700/50 rounded-xl p-4">
          <p className="text-sm text-blue-300">New</p>
          <p className="text-3xl font-bold text-blue-300">{stats.new}</p>
        </div>
        <div className="bg-yellow-800/40 border border-yellow-700/50 rounded-xl p-4">
          <p className="text-sm text-yellow-300">Read</p>
          <p className="text-3xl font-bold text-yellow-300">{stats.read}</p>
        </div>
        <div className="bg-green-800/40 border border-green-700/50 rounded-xl p-4">
          <p className="text-sm text-green-300">Responded</p>
          <p className="text-3xl font-bold text-green-300">{stats.responded}</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Messages List */}
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className={isDark ? 'bg-slate-800/40 border border-slate-700 rounded-xl p-8 text-center' : 'bg-white border border-slate-200 rounded-xl p-8 text-center'}>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>No contact messages yet</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact._id}
              className={isDark ? 'bg-slate-800/40 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition' : 'bg-white border border-slate-200 rounded-xl p-6 hover:border-cyan-500/50 transition'}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={isDark ? 'text-xl font-bold text-white' : 'text-xl font-bold text-slate-900'}>{contact.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(contact.status)}`}>
                      {contact.status.toUpperCase()}
                    </span>
                  </div>
                  <p className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-600'}>
                    {contact.email} | {contact.phone}
                  </p>
                </div>
                <div className="flex gap-2">
                  {contact.status !== 'responded' && (
                    <button
                      onClick={() => handleMarkAsResponded(contact._id)}
                      className={isDark ? 'p-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition' : 'p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition'}
                      title="Mark as Responded"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(contact._id)}
                    className={isDark ? 'p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition' : 'p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition'}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-cyan-300 mb-1">Subject:</p>
                <p className={isDark ? 'text-slate-200' : 'text-slate-800'}>{contact.subject}</p>
              </div>

              <div className="mb-3">
                <p className="text-sm font-semibold text-cyan-300 mb-1">Message:</p>
                <p className={isDark ? 'text-slate-300 whitespace-pre-wrap' : 'text-slate-700 whitespace-pre-wrap'}>{contact.message}</p>
              </div>

              <p className={isDark ? 'text-xs text-slate-500' : 'text-xs text-slate-600'}>
                Submitted: {new Date(contact.submittedAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ContactMessages;
