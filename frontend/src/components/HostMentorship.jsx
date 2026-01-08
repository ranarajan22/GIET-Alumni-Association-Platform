// src/components/HostMentorship.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { handleSuccess, handleError } from '../utils/utils';
import { Users, FileText, User, X } from 'lucide-react';

const HostMentorshipForm = ({ onCancel }) => {
  const [mentorshipDetails, setMentorshipDetails] = useState({
    title: '',
    description: '',
    mentorName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMentorshipDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!mentorshipDetails.title || !mentorshipDetails.description) {
      handleError('Please fill in all required fields.');
      return;
    }

    try {
      // Get mentor information from localStorage
      const mentorId = localStorage.getItem('userId');
      const mentorName = localStorage.getItem('loggedInUser');
      const mentorPhoto = localStorage.getItem('profilePhoto');
      const mentorEmail = localStorage.getItem('userEmail');
      const mentorGraduationYear = localStorage.getItem('graduationYear');
      const mentorCourse = localStorage.getItem('course');
      const mentorFieldOfStudy = localStorage.getItem('fieldOfStudy');
      const token = localStorage.getItem('token');

      const payload = {
        ...mentorshipDetails,
        mentorId,
        mentorName: mentorshipDetails.mentorName || mentorName,
        mentorPhoto,
        mentorEmail,
        mentorGraduationYear: mentorGraduationYear ? parseInt(mentorGraduationYear) : null,
        mentorCourse,
        mentorFieldOfStudy
      };

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const response = await axios.post('http://localhost:8083/api/mentorships', payload, { headers });
      handleSuccess('Mentorship posted successfully!');
      setMentorshipDetails({ title: '', description: '', mentorName: '' });
      onCancel(); // Close the form after submission
    } catch (error) {
      handleError('Failed to post mentorship. Please try again.');
      console.error('Error posting mentorship:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-2xl p-6 mx-4 my-6 border border-purple-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-3 rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Host a Mentorship</h2>
            <p className="text-sm text-gray-600">Share your expertise with students</p>
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
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
            <FileText className="w-4 h-4 text-purple-600" />
            Mentorship Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={mentorshipDetails.title}
            onChange={handleChange}
            required
            placeholder="e.g., Software Development Mentorship"
            className="border border-gray-300 rounded-lg w-full py-3 px-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
            <FileText className="w-4 h-4 text-purple-600" />
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={mentorshipDetails.description}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Describe what you'll teach, topics covered, and how students will benefit..."
            className="border border-gray-300 rounded-lg w-full py-3 px-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
          />
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
            <User className="w-4 h-4 text-purple-600" />
            Display Name (Optional)
          </label>
          <input
            type="text"
            name="mentorName"
            value={mentorshipDetails.mentorName}
            onChange={handleChange}
            placeholder="Leave blank to use your account name"
            className="border border-gray-300 rounded-lg w-full py-3 px-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
          <p className="text-xs text-gray-500 mt-1">This name will be shown to students</p>
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition shadow-lg hover:shadow-xl"
          >
            Post Mentorship
          </button>
        </div>
      </form>
    </div>
  );
};

HostMentorshipForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
};

export default HostMentorshipForm;
