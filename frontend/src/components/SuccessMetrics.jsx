import PropTypes from 'prop-types';
import { TrendingUp } from 'lucide-react';

const SuccessMetrics = ({ stats }) => {
  if (!stats) return null;

  const metrics = [
    {
      label: 'Followers',
      value: stats.followers || 0,
      icon: '👥',
      color: 'from-blue-400 to-blue-600',
    },
    {
      label: 'Students Connected',
      value: stats.studentsConnected || 0,
      icon: '🤝',
      color: 'from-indigo-400 to-indigo-600',
    },
    {
      label: 'Mentorships Completed',
      value: stats.mentorshipsCompleted || 0,
      icon: '✓',
      color: 'from-green-400 to-green-600',
    },
    {
      label: 'Jobs Filled',
      value: stats.jobsFilled || 0,
      icon: '💼',
      color: 'from-cyan-400 to-cyan-600',
    },
    {
      label: 'Avg Rating',
      value: (stats.averageRating || 4.5).toFixed(1),
      icon: '⭐',
      color: 'from-yellow-400 to-yellow-600',
    },
  ];

  return (
    <div className="mx-4 mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
        📊 Success Metrics
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${metric.color} rounded-lg shadow-md p-5 text-white`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm opacity-90">{metric.label}</p>
                <p className="text-3xl font-bold mt-1">{metric.value}</p>
              </div>
              <span className="text-3xl">{metric.icon}</span>
            </div>
            <div className="flex items-center gap-1 text-xs opacity-90">
              <TrendingUp className="w-3 h-3" />
              <span>Trending up</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

SuccessMetrics.propTypes = {
  stats: PropTypes.shape({
    followers: PropTypes.number,
    studentsConnected: PropTypes.number,
    mentorshipsCompleted: PropTypes.number,
    jobsFilled: PropTypes.number,
    averageRating: PropTypes.number,
  }),
};

export default SuccessMetrics;
