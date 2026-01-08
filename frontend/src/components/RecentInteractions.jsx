import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Calendar, Users, Briefcase, MessageCircle } from 'lucide-react';

const RecentInteractions = () => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Fetch recent events, mentorships, and jobs
        const [eventsRes, mentorshipRes, jobsRes] = await Promise.all([
          axios.get('http://localhost:8083/api/events?limit=2', { headers }).catch(() => ({ data: [] })),
          axios.get('http://localhost:8083/api/mentorships?limit=2', { headers }).catch(() => ({ data: [] })),
          axios.get('http://localhost:8083/api/job-openings?limit=2', { headers }).catch(() => ({ data: [] })),
        ]);

        const eventsList = Array.isArray(eventsRes.data) ? eventsRes.data : eventsRes.data?.events || [];
        const mentorshipList = Array.isArray(mentorshipRes.data) ? mentorshipRes.data : mentorshipRes.data?.mentorships || [];
        const jobsList = Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data?.jobs || [];

        const combined = [
          ...eventsList.slice(0, 2).map((e) => ({
            type: 'event',
            title: e.title || e.eventName,
            icon: Calendar,
            date: e.createdAt,
          })),
          ...mentorshipList.slice(0, 2).map((m) => ({
            type: 'mentorship',
            title: m.topic || m.title,
            icon: Users,
            date: m.createdAt,
          })),
          ...jobsList.slice(0, 2).map((j) => ({
            type: 'job',
            title: j.jobTitle || j.title,
            icon: Briefcase,
            date: j.createdAt,
          })),
        ]
          .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
          .slice(0, 5);

        setInteractions(combined);
      } catch (error) {
        console.error('Error fetching interactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInteractions();
  }, []);

  const formatDate = (date) => {
    if (!date) return 'Recently';
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="mx-4 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-orange-500">
          🕐 Recent Interactions
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-12 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-orange-500">
        🕐 Recent Interactions
      </h3>
      {interactions.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent interactions. Start by creating an event or mentorship!</p>
      ) : (
        <div className="space-y-3">
          {interactions.map((interaction, idx) => {
            const Icon = interaction.icon;
            const typeColors = {
              event: 'bg-blue-50 border-blue-200',
              mentorship: 'bg-purple-50 border-purple-200',
              job: 'bg-orange-50 border-orange-200',
            };

            return (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${typeColors[interaction.type]} hover:shadow-md transition-all`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{interaction.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)} • {formatDate(interaction.date)}
                    </p>
                  </div>
                  <MessageCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

RecentInteractions.propTypes = {};

export default RecentInteractions;
