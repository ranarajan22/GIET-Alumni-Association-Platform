// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";
import { handleSuccess, handleError } from "../utils/utils";
import PropTypes from 'prop-types';
import { Calendar, Link2, FileText, Tag, X } from 'lucide-react';
import { API_BASE_URL } from '../config';

const ScheduleEvent = ({ onCancel }) => {
  const [eventDescription, setEventDescription] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [category, setCategory] = useState("");

  const categories = ["Tech Talk", "Hackathon", "Workshop", "Networking", "Non-Tech Meetup"];

  const handleSchedule = async () => {
    const currentDate = new Date();
    const selectedDate = new Date(dateTime);

    // Form validation
    if (!eventDescription || !eventLink || !dateTime || !category) {
      handleError("Please fill in all fields.");
      return;
    }

    if (selectedDate < currentDate) {
      handleError("Date cannot be in the past.");
      return;
    }

    // Event data to be sent in the POST request
    const eventData = {
      title: eventDescription, // optional title using description for now
      description: eventDescription,
      link: eventLink,
      dateTime,
      category,
      createdBy: localStorage.getItem('userId') || undefined,
      organizerName: localStorage.getItem('loggedInUser') || undefined,
      organizerContact: localStorage.getItem('userEmail') || undefined,
      registrationRequired: true,
    };

    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    try {
      // POST request to create a new event
      const response = await axios.post(`${API_BASE_URL}/events`, eventData, { headers });

      // Show success message and reset form if request is successful
      handleSuccess("Event Scheduled Successfully");
      setEventDescription("");
      setEventLink("");
      setDateTime("");
      setCategory("");
      onCancel(); // Close the form
    } catch (error) {
      handleError("Failed to schedule the event. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl shadow-2xl p-6 mx-4 my-6 border border-orange-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 p-3 rounded-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Schedule an Event</h2>
            <p className="text-sm text-gray-600">Create and share events with the community</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition"
          title="Close"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
            <FileText className="w-4 h-4 text-orange-600" />
            Event Description <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
            placeholder="Describe your event, what attendees will learn, and why they should join..."
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            rows="4"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
            <Link2 className="w-4 h-4 text-orange-600" />
            Event Link <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            placeholder="https://meet.google.com/... or event registration link"
            value={eventLink}
            onChange={(e) => setEventLink(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
              <Tag className="w-4 h-4 text-orange-600" />
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition shadow-lg hover:shadow-xl"
            type="button"
          >
            Schedule Event
          </button>
        </div>
      </div>
    </div>
  );
};

ScheduleEvent.propTypes = {
  onCancel: PropTypes.func.isRequired,
};

export default ScheduleEvent;
