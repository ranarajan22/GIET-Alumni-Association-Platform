import PropTypes from 'prop-types';
import { Trophy, Users, Calendar, Briefcase, Heart, Star } from 'lucide-react';

const Achievements = ({ stats }) => {
  if (!stats) return null;

  const achievements = [
    {
      id: 1,
      icon: Calendar,
      title: 'Event Creator',
      description: `${stats.totalEvents || 0} events hosted`,
      color: 'from-blue-400 to-blue-600',
      unlocked: (stats.totalEvents || 0) > 0,
    },
    {
      id: 2,
      icon: Users,
      title: 'Mentor',
      description: `${stats.totalMentorships || 0} mentorships`,
      color: 'from-purple-400 to-purple-600',
      unlocked: (stats.totalMentorships || 0) > 0,
    },
    {
      id: 3,
      icon: Briefcase,
      title: 'Recruiter',
      description: `${stats.totalJobOpenings || 0} jobs posted`,
      color: 'from-orange-400 to-orange-600',
      unlocked: (stats.totalJobOpenings || 0) > 0,
    },
    {
      id: 4,
      icon: Heart,
      title: 'Networker',
      description: 'Connected with students',
      color: 'from-pink-400 to-pink-600',
      unlocked: true,
    },
    {
      id: 5,
      icon: Star,
      title: 'Community Leader',
      description: 'Active contributor',
      color: 'from-yellow-400 to-yellow-600',
      unlocked: (stats.totalEvents || 0) > 2 && (stats.totalMentorships || 0) > 2,
    },
    {
      id: 6,
      icon: Trophy,
      title: 'Elite Member',
      description: 'Top contributor',
      color: 'from-green-400 to-green-600',
      unlocked: (stats.totalEvents || 0) > 5 && (stats.totalMentorships || 0) > 5,
    },
  ];

  return (
    <div className="mx-4 mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-500">
        🏆 Achievements & Badges
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg shadow-md transition-all ${
                achievement.unlocked
                  ? `bg-gradient-to-br ${achievement.color} text-white`
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{achievement.title}</h4>
                  <p className="text-xs opacity-90 mt-1">{achievement.description}</p>
                </div>
                <Icon className={`w-6 h-6 ${achievement.unlocked ? '' : 'opacity-50'}`} />
              </div>
              <div className="text-xs font-semibold mt-3">
                {achievement.unlocked ? '✓ Unlocked' : '🔒 Locked'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

Achievements.propTypes = {
  stats: PropTypes.shape({
    totalEvents: PropTypes.number,
    totalMentorships: PropTypes.number,
    totalJobOpenings: PropTypes.number,
  }),
};

export default Achievements;
