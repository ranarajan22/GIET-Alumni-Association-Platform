// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { FaTrophy, FaFireAlt } from "react-icons/fa";

const Gamification = () => {
  const [userStats] = useState({
    level: 5,
    points: 2450,
    badges: [
      { id: 1, name: "Networking Pro", icon: "🤝", achieved: true },
      { id: 2, name: "Mentor Star", icon: "⭐", achieved: true },
      { id: 3, name: "Event Attendee", icon: "🎉", achieved: true },
      { id: 4, name: "Job Seeker", icon: "💼", achieved: false },
      { id: 5, name: "Super Connector", icon: "🔗", achieved: true },
    ],
    streak: 7,
  });

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 font-outfit">
      <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
        <FaTrophy className="text-yellow-500" /> Achievement Dashboard
      </h2>

      {/* Level & Points */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 text-center shadow">
          <div className="text-3xl font-bold text-primary mb-2">Lv. {userStats.level}</div>
          <p className="text-gray-600 text-sm">Your Level</p>
        </div>

        <div className="bg-white rounded-lg p-4 text-center shadow">
          <div className="text-3xl font-bold text-green-600 mb-2">{userStats.points}</div>
          <p className="text-gray-600 text-sm">Total Points</p>
        </div>

        <div className="bg-white rounded-lg p-4 text-center shadow">
          <div className="flex items-center justify-center gap-1 mb-2">
            <FaFireAlt className="text-orange-500" />
            <span className="text-3xl font-bold text-orange-500">{userStats.streak}</span>
          </div>
          <p className="text-gray-600 text-sm">Day Streak</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Level Progress</span>
          <span className="text-sm text-gray-600">2450 / 5000 XP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-primary to-orange-600 h-3 rounded-full transition-all duration-300"
            style={{ width: "49%" }}
          ></div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4">Badges Earned</h3>
        <div className="grid grid-cols-5 gap-3">
          {userStats.badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3 rounded-lg text-center ${
                badge.achieved
                  ? "bg-white shadow-lg scale-100"
                  : "bg-gray-200 opacity-50 grayscale"
              }`}
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <p className="text-xs font-semibold text-gray-700">{badge.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gamification;
