import React, { useEffect, useState } from "react";
import axios from "axios";
import { Briefcase, Building2, Clock } from "lucide-react";
import PropTypes from "prop-types";

const JobOpeningsList = ({ searchQuery = "", filterByPoster = false }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredJobs, setFilteredJobs] = useState([]);

  // Current user info
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to close this job opening?')) return;
    
    try {
      await axios.delete(`http://localhost:8083/api/job-openings/${jobId}`, {
        data: { userId: currentUserId, userRole }
      });
      // Refresh jobs instead of removing from list
      const res = await axios.get("http://localhost:8083/api/job-openings");
      setJobs(res.data);
      alert('Job opening closed successfully');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to close job opening');
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:8083/api/job-openings");
        setJobs(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching job openings:", err);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search query
  useEffect(() => {
    if (searchQuery) {
      let filtered = jobs.filter((job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // If filtering by poster, only show jobs posted by current user
      if (filterByPoster && currentUserId) {
        filtered = filtered.filter((job) => String(job.postedBy?._id || job.postedBy) === String(currentUserId));
      }
      
      setFilteredJobs(filtered);
    } else {
      let filtered = jobs;
      
      // If filtering by poster, only show jobs posted by current user
      if (filterByPoster && currentUserId) {
        filtered = jobs.filter((job) => String(job.postedBy?._id || job.postedBy) === String(currentUserId));
      }
      
      setFilteredJobs(filtered);
    }
  }, [searchQuery, jobs, filterByPoster, currentUserId]);

  if (loading) return <p className="p-4">Loading job opportunities...</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg m-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-secondary">Job Opportunities</h2>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
          {filteredJobs.length} openings
        </span>
      </div>

      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className={`shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all ${job?.isClosed ? 'bg-gray-50 opacity-60' : 'bg-gradient-to-br from-white to-green-50'}`}
            >
              {job?.isClosed && (
                <div className="mb-2 inline-block bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  CLOSED
                </div>
              )}
              {/* Poster info */}
              {job.postedBy && (
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                  <img
                    src={job.postedBy.profilePhoto || job.posterPhoto || 'https://via.placeholder.com/40?text=J'}
                    alt={job.postedBy.fullName || job.posterName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{job.postedBy.fullName || job.posterName}</p>
                    <p className="text-xs text-gray-600">Batch {job.postedBy.graduationYear || job.posterGraduationYear}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-secondary mb-1">{job.title}</h3>
                  <div className="flex items-center text-gray-700 font-medium">
                    <Building2 className="w-4 h-4 mr-2" />
                    {job.company}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

              <div className="flex items-center text-gray-500 text-sm mb-4">
                <Clock className="w-4 h-4 mr-2" />
                Posted: {new Date(job.postedAt).toLocaleDateString()}
              </div>

              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-semibold"
              >
                Apply Now
              </a>
              {job.postedBy && currentUserId && (String(job.postedBy._id || job.postedBy) === String(currentUserId) || userRole === 'admin') && (
                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="w-full mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-semibold"
                >
                  Close Posting
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {searchQuery
              ? `No job openings found matching "${searchQuery}"`
              : "No job openings available at the moment."}
          </p>
        </div>
      )}
    </div>
  );
};

JobOpeningsList.propTypes = {
  searchQuery: PropTypes.string,
};

export default JobOpeningsList;
