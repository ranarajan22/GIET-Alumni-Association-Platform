import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Users, Clock } from "lucide-react";
import PropTypes from "prop-types";

const MentorshipList = ({ searchQuery = "", onMentorChat, filterByMentor = false }) => {
  const [mentorships, setMentorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredMentorships, setFilteredMentorships] = useState([]);

  // Current user info
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const handleMentorChat = (mentorship) => {
    if (onMentorChat) {
      onMentorChat(mentorship);
    }
  };

  const handleDeleteMentorship = async (mentorshipId) => {
    if (!window.confirm('Are you sure you want to close this mentorship?')) return;
    
    try {
      await api.delete(`/mentorships/${mentorshipId}`, {
        data: { userId: currentUserId, userRole }
      });
      // Refresh mentorships instead of removing from list
      api.get("/mentorships").then((res) => {
        setMentorships(res.data);
      });
      alert('Mentorship closed successfully');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to close mentorship');
    }
  };

  useEffect(() => {
    api.get("/mentorships").then((res) => {
      setMentorships(res.data);
      setLoading(false);
    });
  }, []);

  // Filter mentorships based on search query
  useEffect(() => {
    if (searchQuery) {
      let filtered = mentorships
        .filter((m) => !m.isClosed)
        .filter((m) => !/\bdsa\b/i.test(m.title || '')) // exclude DSA entries
        .filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // If filtering by mentor, only show mentorships created by current user
      if (filterByMentor && currentUserId) {
        filtered = filtered.filter((m) => String(m.mentorId?._id || m.mentorId) === String(currentUserId));
      }
      
      setFilteredMentorships(filtered);
    } else {
      let filtered = mentorships
        .filter((m) => !m.isClosed)
        .filter((m) => !/\bdsa\b/i.test(m.title || ''));
      
      // If filtering by mentor, only show mentorships created by current user
      if (filterByMentor && currentUserId) {
        filtered = mentorships.filter((m) => String(m.mentorId?._id || m.mentorId) === String(currentUserId));
      }
      
      setFilteredMentorships(filtered);
    }
  }, [searchQuery, mentorships, filterByMentor, currentUserId]);

  if (loading) return <p className="p-4">Loading mentorships...</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg m-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-secondary">Mentorship Opportunities</h2>
        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
          {filteredMentorships.length} available
        </span>
      </div>

      {filteredMentorships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMentorships.map((m) => (
            <div key={m._id} className={`border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow ${m?.isClosed ? 'bg-gray-50 opacity-60' : 'bg-gradient-to-br from-white to-purple-50'}`}>
              {m?.isClosed && (
                <div className="mb-2 inline-block bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  CLOSED
                </div>
              )}
              {/* Mentor info */}
              {m.mentorId && (
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                  <img
                    src={m.mentorId.profilePhoto || m.mentorPhoto || 'https://via.placeholder.com/48?text=M'}
                    alt={m.mentorId.fullName || m.mentorName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{m.mentorId.fullName || m.mentorName}</p>
                    <p className="text-xs text-gray-600 mb-1">Batch {m.mentorId.graduationYear || m.mentorGraduationYear}</p>
                    {(m.mentorId.course || m.mentorCourse) && <p className="text-xs text-gray-600">{m.mentorId.course || m.mentorCourse}</p>}
                    {(m.mentorId.fieldOfStudy || m.mentorFieldOfStudy) && <p className="text-xs text-gray-600">{m.mentorId.fieldOfStudy || m.mentorFieldOfStudy}</p>}
                  </div>
                </div>
              )}
              <h3 className="text-xl font-semibold text-secondary mb-2">{m.title}</h3>
              <p className="text-gray-600 mb-3">{m.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Posted: {new Date(m.postedAt).toLocaleDateString()}
                </div>
              </div>

              <button
                onClick={() => handleMentorChat(m)}
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition-colors font-semibold"
              >
                Connect with Mentor
              </button>
              {m.mentorId && currentUserId && (String(m.mentorId._id || m.mentorId) === String(currentUserId) || userRole === 'admin') && (
                <button
                  onClick={() => handleDeleteMentorship(m._id)}
                  className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors font-semibold"
                >
                  Close Mentorship
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            {searchQuery
              ? `No mentorships found matching "${searchQuery}"`
              : "No mentorships available."}
          </p>
        </div>
      )}
    </div>
  );
};

MentorshipList.propTypes = {
  searchQuery: PropTypes.string,
  onMentorChat: PropTypes.func,
};

export default MentorshipList;
