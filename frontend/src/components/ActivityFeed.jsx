import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Clock, Users, Briefcase } from 'lucide-react';

// eslint-disable-next-line no-unused-vars
const ActivityFeed = ({ role, onItemClick }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        // Fetch user token for authentication
        localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Fetch recent events, mentorships, and jobs
        const [eventsRes, mentorshipRes, jobsRes] = await Promise.all([
          axios.get('http://localhost:8083/api/events?limit=3', { headers }).catch(() => ({ data: [] })),
          axios.get('http://localhost:8083/api/mentorships?limit=3', { headers }).catch(() => ({ data: [] })),
          axios.get('http://localhost:8083/api/job-openings?limit=3', { headers }).catch(() => ({ data: [] })),
        ]);

        const eventsList = Array.isArray(eventsRes.data) ? eventsRes.data : eventsRes.data?.events || [];
        const mentorshipList = Array.isArray(mentorshipRes.data) ? mentorshipRes.data : mentorshipRes.data?.mentorships || [];
        const jobsList = Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data?.jobs || [];

        const combined = [
          ...eventsList.slice(0, 2).map((e) => ({ type: 'event', data: e, icon: Clock, label: 'Event' })),
          ...mentorshipList.slice(0, 2).map((m) => ({ type: 'mentorship', data: m, icon: Users, label: 'Mentorship' })),
          ...jobsList.slice(0, 2).map((j) => ({ type: 'job', data: j, icon: Briefcase, label: 'Job Opening' })),
        ].sort((a, b) => new Date(b.data.createdAt || 0) - new Date(a.data.createdAt || 0)).slice(0, 5);

        setActivities(combined);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 mb-6 mx-2 sm:mx-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">What&apos;s New</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 mb-6 mx-2 sm:mx-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">What&apos;s New</h3>
        <p className="text-gray-500 text-sm">No recent activities. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 mb-6 mx-2 sm:mx-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">What&apos;s New</h3>
      <div className="space-y-3">
        {activities.map((activity, idx) => {
          const Icon = activity.icon;
          const title =
            activity.type === 'event'
              ? activity.data.description || activity.data.title
              : activity.type === 'mentorship'
                ? activity.data.topic
                : activity.data.title;
          const creator =
            activity.data.createdBy?.fullName || activity.data.mentorName || activity.data.posterName || 'Unknown';

          return (
            <button
              key={idx}
              onClick={() => onItemClick(activity.type)}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition text-left w-full"
            >
              <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                <Icon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate text-sm">{title}</p>
                <p className="text-xs text-gray-600">by {creator}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                  {activity.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

ActivityFeed.propTypes = {
  role: PropTypes.string,
  onItemClick: PropTypes.func,
};

export default ActivityFeed;
