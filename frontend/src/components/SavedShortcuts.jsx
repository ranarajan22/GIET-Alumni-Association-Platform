import PropTypes from 'prop-types';
import { Bookmark, Heart } from 'lucide-react';

const SavedShortcuts = ({ role, onShortcutClick }) => {
  const shortcuts = [
    {
      title: 'Saved Events',
      description: 'Events you bookmarked',
      icon: Bookmark,
      action: 'events',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: role === 'alumni' ? 'My Followers' : 'Favorite Mentors',
      description: role === 'alumni' ? 'Your followers' : 'Mentors you follow',
      icon: Heart,
      action: role === 'alumni' ? 'network' : 'mentorships',
      color: 'from-red-500 to-red-600',
    },
    {
      title: 'Saved Jobs',
      description: 'Jobs you bookmarked',
      icon: Bookmark,
      action: 'job-openings',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 px-2 sm:px-4">Quick Access</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-2 sm:px-4">
        {shortcuts.map((shortcut, idx) => {
          const Icon = shortcut.icon;
          return (
            <button
              key={idx}
              onClick={() => onShortcutClick(shortcut.action)}
              className={`bg-gradient-to-br ${shortcut.color} rounded-lg shadow-md p-4 sm:p-5 text-white hover:shadow-lg hover:scale-105 transition-all cursor-pointer flex items-start justify-between`}
            >
              <div className="text-left">
                <p className="font-semibold text-sm sm:text-base">{shortcut.title}</p>
                <p className="text-xs opacity-90 mt-1">{shortcut.description}</p>
              </div>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 opacity-70 flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

SavedShortcuts.propTypes = {
  role: PropTypes.string,
  onShortcutClick: PropTypes.func,
};

export default SavedShortcuts;
