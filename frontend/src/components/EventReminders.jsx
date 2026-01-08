// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

const EventReminders = () => {
  const [reminders] = useState([
    {
      id: 1,
      title: "Tech Webinar: AI & ML Trends",
      date: "2024-12-28",
      time: "3:00 PM",
      status: "upcoming",
      attendees: 234,
    },
    {
      id: 2,
      title: "Alumni Meetup - Delhi Chapter",
      date: "2024-12-25",
      time: "5:00 PM",
      status: "today",
      attendees: 45,
    },
    {
      id: 3,
      title: "Career Counseling Session",
      date: "2024-12-20",
      time: "2:00 PM",
      status: "past",
      attendees: 120,
    },
  ]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 font-outfit">
      <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
        <FaCalendarAlt /> Event Reminders
      </h2>

      <div className="space-y-4">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className={`p-4 rounded-lg border-l-4 ${
              reminder.status === "today"
                ? "bg-green-50 border-green-500"
                : reminder.status === "upcoming"
                ? "bg-blue-50 border-blue-500"
                : "bg-gray-50 border-gray-400"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-800">{reminder.title}</h3>
              {reminder.status === "today" && (
                <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  TODAY
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <span className="flex items-center gap-1">
                <FaCalendarAlt className="text-primary" />
                {new Date(reminder.date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <FaClock className="text-primary" />
                {reminder.time}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{reminder.attendees} attending</span>
              <button className="text-primary hover:text-orange-600 text-sm font-semibold transition">
                Set Reminder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventReminders;
