import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Download } from 'lucide-react';

function SubscribersList() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8083';
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`${base}/api/subscribers/list`, { headers });
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
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Mail className="w-8 h-8 text-cyan-400" />
          <h1 className="text-3xl font-bold text-white">Newsletter Subscribers</h1>
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
      <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
        <p className="text-sm text-slate-400">Total Subscribers</p>
        <p className="text-3xl font-bold text-white">{subscribers.length}</p>
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
            <tr className="border-b border-slate-700">
              <th className="text-left px-4 py-3 text-slate-300 font-semibold">#</th>
              <th className="text-left px-4 py-3 text-slate-300 font-semibold">Email Address</th>
              <th className="text-left px-4 py-3 text-slate-300 font-semibold">Subscribed On</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-8 text-slate-400">
                  No subscribers yet
                </td>
              </tr>
            ) : (
              subscribers.map((subscriber, index) => (
                <tr
                  key={subscriber._id}
                  className="border-b border-slate-700 hover:bg-slate-800/20 transition"
                >
                  <td className="px-4 py-3 text-slate-300">{index + 1}</td>
                  <td className="px-4 py-3 text-white font-medium">{subscriber.email}</td>
                  <td className="px-4 py-3 text-slate-400">
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
