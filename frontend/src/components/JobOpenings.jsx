// src/components/JobOpenings.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { handleSuccess, handleError } from '../utils/utils';
import { Briefcase, Building2, Link2, FileText, X } from 'lucide-react';
import { API_BASE_URL } from '../config';

const JobOpeningsForm = ({ onCancel }) => {
  const [jobDetails, setJobDetails] = useState({
    title: '',
    description: '',
    company: '',
    link: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!jobDetails.title || !jobDetails.company || !jobDetails.description || !jobDetails.link) {
      handleError('Please fill in all fields.');
      return;
    }

    try {
      // Get poster information from localStorage
      const postedBy = localStorage.getItem('userId');
      const posterName = localStorage.getItem('loggedInUser');
      const posterPhoto = localStorage.getItem('profilePhoto');
      const posterEmail = localStorage.getItem('userEmail');
      const posterGraduationYear = localStorage.getItem('graduationYear');
      const posterCourse = localStorage.getItem('course');
      const posterFieldOfStudy = localStorage.getItem('fieldOfStudy');
      const token = localStorage.getItem('token');

      const payload = {
        ...jobDetails,
        postedBy,
        posterName,
        posterPhoto,
        posterEmail,
        posterGraduationYear: posterGraduationYear ? parseInt(posterGraduationYear) : null,
        posterCourse,
        posterFieldOfStudy
      };

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const response = await axios.post(`${API_BASE_URL}/job-openings`, payload, { headers });
      handleSuccess('Job opening posted successfully!');
      setJobDetails({ title: '', description: '', company: '', link: '' });
      onCancel(); // Close the form after submission
    } catch (error) {
      handleError('Failed to post job opening. Please try again.');
      console.error('Error posting job:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-2xl p-6 mx-4 my-6 border border-green-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-3 rounded-lg">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Post Job Opening</h2>
            <p className="text-sm text-gray-600">Share career opportunities with students</p>
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
            <Briefcase className="w-4 h-4 text-green-600" />
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={jobDetails.title}
            onChange={handleChange}
            required
            placeholder="e.g., Senior Software Engineer"
            className="border border-gray-300 rounded-lg w-full py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
            <Building2 className="w-4 h-4 text-green-600" />
            Company <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="company"
            value={jobDetails.company}
            onChange={handleChange}
            required
            placeholder="Company name"
            className="border border-gray-300 rounded-lg w-full py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
            <Link2 className="w-4 h-4 text-green-600" />
            Application Link <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            name="link"
            value={jobDetails.link}
            placeholder="https://company.com/careers/apply"
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg w-full py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
            <FileText className="w-4 h-4 text-green-600" />
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={jobDetails.description}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Describe the role, responsibilities, requirements, and benefits..."
            className="border border-gray-300 rounded-lg w-full py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
          />
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
            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition shadow-lg hover:shadow-xl"
          >
            Post Job Opening
          </button>
        </div>
      </form>
    </div>
  );
};

JobOpeningsForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
};

export default JobOpeningsForm;
