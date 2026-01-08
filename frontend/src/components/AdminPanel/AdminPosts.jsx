import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Trash2, Loader, ExternalLink, Calendar, Briefcase, Users } from 'lucide-react';
import api from '../../utils/api';

const sections = {
  events: {
    title: 'Events',
    icon: Calendar,
    fetch: () => api.get('/events'),
    remove: (id) => api.delete(`/events/${id}`, { data: { userRole: 'admin' } })
  },
  jobs: {
    title: 'Job Openings',
    icon: Briefcase,
    fetch: () => api.get('/job-openings'),
    remove: (id) => api.delete(`/job-openings/${id}`, { data: { userRole: 'admin' } })
  },
  mentorships: {
    title: 'Mentorships',
    icon: Users,
    fetch: () => api.get('/mentorships'),
    remove: (id) => api.delete(`/mentorships/${id}`, { data: { userRole: 'admin' } })
  }
};

const AdminPosts = ({ view }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const config = sections[view];

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError('');
        const res = await config.fetch();
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.events
          ?? res.data?.projects
          ?? res.data?.mentorships
          ?? res.data?.jobs
          ?? [];
        setItems(data || []);
      } catch (err) {
        setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load');
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (config) load();
    return () => { mounted = false; };
  }, [view, config]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await config.remove(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Delete failed');
    }
  };

  if (!config) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        {React.createElement(config.icon, { className: 'w-6 h-6 text-cyan-400' })}
        <h2 className="text-2xl font-bold text-white">{config.title}</h2>
        <span className="ml-auto text-sm text-slate-400">{items.length} items</span>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/30 text-red-200 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-slate-300"><Loader className="w-4 h-4 animate-spin" /> Loading...</div>
      ) : items.length === 0 ? (
        <p className="text-slate-400">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item._id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white break-words">{item.title || item.name}</h3>
                  {item.company && <p className="text-sm text-slate-400">{item.company}</p>}
                  {item.description && <p className="text-sm text-slate-400 line-clamp-3">{item.description}</p>}
                  {item.date && <p className="text-xs text-slate-500">Date: {new Date(item.date).toLocaleDateString()}</p>}
                  {item.postedAt && <p className="text-xs text-slate-500">Posted: {new Date(item.postedAt).toLocaleDateString()}</p>}
                  {item.isClosed && <span className="inline-block mt-2 px-2 py-1 text-xs rounded bg-red-500/20 text-red-300">Closed</span>}
                </div>
              </div>

              <div className="flex gap-2">
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 hover:bg-cyan-500/30"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Link
                  </a>
                )}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-3 py-2 rounded-lg bg-red-500/20 text-red-200 border border-red-500/40 hover:bg-red-500/30 inline-flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPosts;

AdminPosts.propTypes = {
  view: PropTypes.string.isRequired,
};
