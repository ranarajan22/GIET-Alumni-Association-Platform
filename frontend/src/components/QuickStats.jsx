import PropTypes from 'prop-types';
import { Calendar, MessageSquare, Briefcase, Users } from 'lucide-react';

const QuickStats = ({ role, stats, onStatClick }) => {
  if (!stats) return null;

  const { totalEvents = 0, totalMentorships = 0, totalJobOpenings = 0, unreadMessages = 0 } = stats;

  const statCards = [
    {
      label: 'Upcoming Events',
      value: totalEvents,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      action: 'events',
    },
    {
      label: 'Unread Messages',
      value: unreadMessages,
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600',
      action: 'messages',
      badge: unreadMessages > 0,
    },
    {
      label: role === 'alumni' ? 'My Mentorships' : 'Available Mentors',
      value: totalMentorships,
      icon: Users,
      color: 'from-green-500 to-green-600',
      action: role === 'alumni' ? 'my-mentorships' : 'mentorships',
    },
    {
      label: role === 'alumni' ? 'My Jobs' : 'Job Openings',
      value: totalJobOpenings,
      icon: Briefcase,
      color: 'from-orange-500 to-orange-600',
      action: role === 'alumni' ? 'my-jobs' : 'job-openings',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 px-2 sm:px-4">
      {statCards.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <button
            key={idx}
            onClick={() => onStatClick(stat.action)}
            className={`bg-gradient-to-br ${stat.color} rounded-lg shadow-md p-4 sm:p-5 text-white hover:shadow-lg hover:scale-105 transition-all cursor-pointer relative overflow-hidden group`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs sm:text-sm font-semibold opacity-90">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{stat.value}</p>
              </div>
              <Icon className="w-6 h-6 sm:w-8 sm:h-8 opacity-70 group-hover:opacity-100 transition" />
            </div>
            {stat.badge && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-red-400 rounded-full animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
};

QuickStats.propTypes = {
  role: PropTypes.string,
  stats: PropTypes.shape({
    totalEvents: PropTypes.number,
    totalMentorships: PropTypes.number,
    totalJobOpenings: PropTypes.number,
    unreadMessages: PropTypes.number,
  }),
  onStatClick: PropTypes.func,
};

export default QuickStats;
