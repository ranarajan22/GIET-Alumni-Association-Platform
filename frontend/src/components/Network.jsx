import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, MessageSquare, Mail, BookOpen, Briefcase, Link as LinkIcon, Github, Award, Code } from 'lucide-react';
import { API_BASE_URL } from '../config';
import AlumniCard from './AlumniCard';
import { mergeCourseOptions, mergeBranchOptions, getCourseLabel, getBranchLabel } from '../constants/courseCatalog';

const Network = ({ onChatClick, userRole = null }) => {
  const [alumni, setAlumni] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [facets, setFacets] = useState({ batches: [], courses: [], branches: [] });

  // Determine role from prop or localStorage
  const role = userRole || localStorage.getItem("userRole");
  const isAlumni = role === 'alumni';

  const currentList = isAlumni ? students : alumni;
  const courseOptions = mergeCourseOptions(currentList.map((person) => person.course));
  const branchOptions = mergeBranchOptions(selectedCourse, currentList.map((person) => person.branch || person.fieldOfStudy));

  const handleChatClick = (person) => {
    // Call the parent's onChatClick callback
    if (onChatClick) {
      onChatClick(person);
    }
  };

  const handleViewProfile = (person) => {
    setSelectedProfile(person);
  };

  const closeProfileModal = () => {
    setSelectedProfile(null);
  };

  useEffect(() => {
    if (selectedBranch && !branchOptions.some((branch) => branch.value === selectedBranch)) {
      setSelectedBranch('');
    }
  }, [branchOptions, selectedBranch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const commonParams = {
          search: searchQuery || undefined,
          batch: selectedBatch || undefined,
          course: selectedCourse || undefined,
          branch: selectedBranch || undefined
        };

        if (isAlumni) {
          // If alumni user, fetch all students
          const [studentsResponse, studentFacetsResponse] = await Promise.all([
            axios.get(`${API_BASE_URL}/user/all/students`, { params: commonParams }),
            axios.get(`${API_BASE_URL}/user/all/students/facets`)
          ]);
          const studentsData = (studentsResponse.data.students || []).map(student => ({
            ...student,
            email: student.collegeEmail, // Map collegeEmail to email for consistency
            branch: student.branch || student.fieldOfStudy,
            role: 'student'
          }));
          setStudents(studentsData);
          setFacets(studentFacetsResponse.data || { batches: [], courses: [], branches: [] });
        } else {
          // If student user, fetch all alumni
          const [alumniResponse, alumniFacetsResponse] = await Promise.all([
            axios.get(`${API_BASE_URL}/alumni-list`, { params: commonParams }),
            axios.get(`${API_BASE_URL}/alumni-list/facets`)
          ]);
          const alumniData = (alumniResponse.data.alumni || []).map(alumni => ({
            ...alumni,
            email: alumni.collegeEmail, // Map collegeEmail to email for consistency
            branch: alumni.branch || alumni.fieldOfStudy,
            role: 'alumni'
          }));
          setAlumni(alumniData);
          setFacets(alumniFacetsResponse.data || { batches: [], courses: [], branches: [] });
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching network data:', err);
        setError('Failed to load network data');
        setLoading(false);
      }
    };

    fetchData();
  }, [isAlumni, searchQuery, selectedBatch, selectedCourse, selectedBranch]);

  // Server already applies filters; keep client-side fallback for immediate search refinement.
  const displayData = isAlumni ? students : alumni;
  const filteredData = displayData.filter(person => 
    person.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (person.email && person.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <div className="p-6 text-center text-gray-900 dark:text-white">Loading network...</div>;
  if (error) return <div className="p-6 text-center text-red-600 dark:text-red-400">{error}</div>;

  const sectionTitle = isAlumni ? "Student Network" : "Alumni Network";
  const sectionCount = filteredData.length;

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="mb-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{sectionTitle}</h1>
          <span className="text-base sm:text-lg font-semibold text-gray-700 dark:text-slate-300">Total: {sectionCount}</span>
        </div>
        <input
          type="text"
          placeholder={`Search ${isAlumni ? 'students' : 'alumni'} by name or email...`}
          className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg"
          >
            <option value="">All Batches</option>
            {facets.batches?.map((batch) => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg"
          >
            <option value="">All Courses</option>
            {courseOptions.map((course) => (
              <option key={course.value} value={course.value}>{course.label}</option>
            ))}
          </select>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg"
          >
            <option value="">All Branches</option>
            {branchOptions.map((branch) => (
              <option key={branch.value} value={branch.value}>{branch.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredData.length > 0 ? (
          filteredData.map((person) => (
            isAlumni ? (
              // For alumni viewing students - use old card
              <div key={person._id} className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-5 flex flex-col border border-gray-200 dark:border-slate-700 hover:shadow-lg transition h-full">
                {/* Header with photo and basic info */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="flex-shrink-0 mb-3">
                    {person.profilePhoto ? (
                      <img 
                        src={person.profilePhoto} 
                        alt={person.fullName} 
                        className="h-24 w-24 rounded-full object-cover border-4 border-blue-100"
                      />
                    ) : (
                      <User className="h-24 w-24 text-blue-600" />
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">{person.fullName}</h2>
                  <p className="text-xs text-white bg-gradient-to-r from-cyan-600 to-blue-600 px-2 py-1 rounded mt-1">
                    {person.role === 'alumni' ? '🎓 Alumni' : '👨‍🎓 Student'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 mt-auto">
                  <button
                    onClick={() => handleChatClick(person)}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm px-3 py-2 rounded hover:opacity-90 transition flex items-center justify-center gap-2 font-semibold"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Send Message
                  </button>
                  <button
                    onClick={() => handleViewProfile(person)}
                    className="w-full bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-sm px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-slate-600 transition font-semibold"
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
            ) : (
              // For students viewing alumni - use AlumniCard with rating and follow
              <AlumniCard 
                key={person._id} 
                alumni={person} 
                onChatClick={handleChatClick}
                onViewProfile={handleViewProfile}
              />
            )
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 dark:text-slate-400 py-8">
            No {isAlumni ? 'students' : 'alumni'} found
          </div>
        )}
      </div>

      {/* Full Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header with Name */}
            <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-8 flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-bold mb-2">{selectedProfile.fullName}</h2>
                <p className="text-cyan-100 text-sm">
                  {selectedProfile.role === 'alumni' ? '🎓 Alumni Profile' : '👨‍🎓 Student Profile'}
                </p>
              </div>
              <button
                onClick={closeProfileModal}
                className="text-white text-2xl hover:text-gray-200 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Profile Header with Photo */}
              <div className="flex flex-col items-center text-center mb-8">
                {selectedProfile.profilePhoto ? (
                  <img
                    src={selectedProfile.profilePhoto}
                    alt={selectedProfile.fullName}
                    className="h-32 w-32 rounded-full object-cover border-4 border-blue-200 mb-4"
                  />
                ) : (
                  <User className="h-32 w-32 text-blue-600 mb-4" />
                )}
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Contact & Academic */}
                <div>
                  {/* Contact Section */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 pb-2 border-b-2 border-cyan-500">Contact Information</h4>
                    <div className="space-y-3">
                      {selectedProfile.collegeEmail && (
                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-600 dark:text-slate-400">Email</p>
                            <p className="text-gray-800 dark:text-white break-all">{selectedProfile.collegeEmail}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Academic Section */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 pb-2 border-b-2 border-cyan-500">Academic Details</h4>
                    <div className="space-y-3">
                      {selectedProfile.graduationYear ? (
                        <div className="flex items-start gap-3">
                          <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-600 dark:text-slate-400">Passing Year</p>
                            <p className="text-gray-800 dark:text-white">{selectedProfile.graduationYear}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-slate-400">Passing Year not provided</p>
                        </div>
                      )}
                      {selectedProfile.course ? (
                        <div className="flex items-start gap-3">
                          <Award className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-600 dark:text-slate-400">Course</p>
                            <p className="text-gray-800 dark:text-white">{getCourseLabel(selectedProfile.course)}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-slate-400">Course not provided</p>
                        </div>
                      )}
                      {selectedProfile.fieldOfStudy ? (
                        <div className="flex items-start gap-3">
                          <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-600 dark:text-slate-400">Branch/Field</p>
                            <p className="text-gray-800 dark:text-white">{getBranchLabel(selectedProfile.course, selectedProfile.branch || selectedProfile.fieldOfStudy)}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-slate-400">Branch/Field not provided</p>
                        </div>
                      )}
                      {(selectedProfile.registrationNumber || selectedProfile.usn) ? (
                        <div className="flex items-start gap-3">
                          <Code className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-600 dark:text-slate-400">Registration Number</p>
                            <p className="text-gray-800 dark:text-white font-mono">{selectedProfile.registrationNumber || selectedProfile.usn}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-slate-400">Registration Number not provided</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Professional Links */}
                <div>
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 pb-2 border-b-2 border-cyan-500">Professional Links</h4>
                    <div className="space-y-3">
                      {selectedProfile.linkedin ? (
                        <a
                          href={selectedProfile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-cyan-600 dark:border-cyan-500 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition"
                        >
                          <LinkIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                          <div>
                            <p className="text-xs text-gray-600 dark:text-slate-400">LinkedIn Profile</p>
                            <p className="text-cyan-600 dark:text-cyan-400 hover:underline break-all text-sm">View Profile →</p>
                          </div>
                        </a>
                      ) : (
                        <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-slate-400">LinkedIn profile not provided</p>
                        </div>
                      )}
                      {selectedProfile.github ? (
                        <a
                          href={selectedProfile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-600 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                        >
                          <Github className="w-5 h-5 text-gray-800 dark:text-white" />
                          <div>
                            <p className="text-xs text-gray-600 dark:text-slate-400">GitHub Profile</p>
                            <p className="text-gray-800 dark:text-white hover:underline break-all text-sm">View Profile →</p>
                          </div>
                        </a>
                      ) : (
                        <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-slate-400">GitHub profile not provided</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        handleChatClick(selectedProfile);
                        closeProfileModal();
                      }}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-3 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 font-semibold"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Send Message
                    </button>
                    <button
                      onClick={closeProfileModal}
                      className="w-full bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 px-4 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Network;
