import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { Mail, Download } from 'lucide-react';

function SubscribersList({ theme = 'dark' }) {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const base = API_BASE_URL;
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`${base}/subscribers/list`, { headers });
      setSubscribers(response.data.subscribers);
      setError('');
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      setError('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (subscribers.length === 0) return;

    // Create CSV content
    const headers = ['Email', 'Subscribed Date'];
    const rows = subscribers.map(sub => [
      sub.email,
      new Date(sub.subscribedAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download file
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Mail className={isDark ? 'w-8 h-8 text-cyan-400' : 'w-8 h-8 text-cyan-600'} />
          <h1 className={isDark ? 'text-3xl font-bold text-white' : 'text-3xl font-bold text-slate-900'}>Newsletter Subscribers</h1>
        </div>
        {subscribers.length > 0 && (
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Download size={18} />
            Export CSV
          </button>
        )}
      </div>

      {/* Stats */}
      <div className={isDark ? 'bg-slate-800/40 border border-slate-700 rounded-xl p-4' : 'bg-white border border-slate-200 rounded-xl p-4'}>
        <p className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-600'}>Total Subscribers</p>
        <p className={isDark ? 'text-3xl font-bold text-white' : 'text-3xl font-bold text-slate-900'}>{subscribers.length}</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Subscribers Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={isDark ? 'border-b border-slate-700' : 'border-b border-slate-200'}>
              <th className={isDark ? 'text-left px-4 py-3 text-slate-300 font-semibold' : 'text-left px-4 py-3 text-slate-700 font-semibold'}>#</th>
              <th className={isDark ? 'text-left px-4 py-3 text-slate-300 font-semibold' : 'text-left px-4 py-3 text-slate-700 font-semibold'}>Email Address</th>
              <th className={isDark ? 'text-left px-4 py-3 text-slate-300 font-semibold' : 'text-left px-4 py-3 text-slate-700 font-semibold'}>Subscribed On</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan="3" className={isDark ? 'text-center py-8 text-slate-400' : 'text-center py-8 text-slate-600'}>
                  No subscribers yet
                </td>
              </tr>
            ) : (
              subscribers.map((subscriber, index) => (
                <tr
                  key={subscriber._id}
                  className={isDark ? 'border-b border-slate-700 hover:bg-slate-800/20 transition' : 'border-b border-slate-200 hover:bg-slate-50 transition'}
                >
                  <td className={isDark ? 'px-4 py-3 text-slate-300' : 'px-4 py-3 text-slate-700'}>{index + 1}</td>
                  <td className={isDark ? 'px-4 py-3 text-white font-medium' : 'px-4 py-3 text-slate-900 font-medium'}>{subscriber.email}</td>
                  <td className={isDark ? 'px-4 py-3 text-slate-400' : 'px-4 py-3 text-slate-600'}>
                    {new Date(subscriber.subscribedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SubscribersList;
