// Dashboard.jsx

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import EventsList from "../components/EventsList";
import Card from "../components/Card";
import ScheduleEventForm from "../components/ScheduleEvent";
import HostMentorshipForm from "../components/HostMentorship";
import JobOpeningsForm from "../components/JobOpenings";
import { Menu, CheckCircle, AlertCircle, Bell } from "lucide-react";
import { assets } from "../assets/assets";
import Network from "../components/Network";
import OpenSource from "../components/OpenSource";
import Messages from "../components/Message";
import EditProfilePopup from "../components/EditProfilePopup";
import MentorshipList from "../components/MentorshipList";
import JobOpeningsList from "../components/JobOpeningsList";
import QuickStats from "../components/QuickStats";
import MiniCalendar from "../components/MiniCalendar";
import SavedShortcuts from "../components/SavedShortcuts";
import NotificationsPanel from "../components/NotificationsPanel";
import Achievements from "../components/Achievements";
import SuccessMetrics from "../components/SuccessMetrics";
import AlumniDashboardHeader from "../components/AlumniDashboardHeader";
import UserSettings from "../components/UserSettings";

function Dashboard() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCard, setActiveCard] = useState("");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [role, setRole] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [, setIsSidebarExpanded] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState(null);
  const [, setLoading] = useState(false);
  const [preSelectedUser, setPreSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const [, setSelectedDate] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const formSectionRef = useRef(null);

  const userIdRef = useRef(localStorage.getItem("userId"));
  const userId = userIdRef.current;
  const token = localStorage.getItem("token");

  const fetchAlumniData = useCallback(async () => {
    const currentUserId = userIdRef.current;
    try {
      setLoading(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const profileRes = await axios.get(
        `http://localhost:8083/api/alumni-list/profile/${currentUserId}`,
        { headers }
      );
      
      // Fetch both alumni-list stats and review stats
      const [alumniStatsRes, reviewStatsRes] = await Promise.all([
        axios.get(`http://localhost:8083/api/alumni-list/stats/${currentUserId}`, { headers }),
        axios.get(`http://localhost:8083/api/reviews/${currentUserId}/stats`, { headers }).catch(() => null)
      ]);
      
      console.log('Profile Data:', profileRes.data);
      console.log('Alumni Stats Data:', alumniStatsRes.data);
      console.log('Review Stats Data:', reviewStatsRes?.data);
      
      setProfileData(profileRes.data);
      
      // Get follower count from alumni profile
      const alumniFollowers = profileRes.data?.alumni?.followers?.length || 0;
      
      // Merge alumni stats with review stats
      const mergedStats = {
        ...alumniStatsRes.data,
        followers: alumniFollowers || reviewStatsRes?.data?.followerCount || 0,
        averageRating: reviewStatsRes?.data?.averageRating || 0
      };
      
      console.log('Merged Stats with Follower Count:', mergedStats);
      setStats(mergedStats);
    } catch (error) {
      console.error("Error fetching alumni data:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchStudentData = useCallback(async () => {
    try {
      setLoading(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // Fetch student stats (events, mentorships, jobs available, unread messages)
      const [eventsRes, mentorshipsRes, jobsRes] = await Promise.all([
        axios.get('http://localhost:8083/api/events', { headers }).catch(() => ({ data: { events: [] } })),
        axios.get('http://localhost:8083/api/mentorships', { headers }).catch(() => ({ data: [] })),
        axios.get('http://localhost:8083/api/job-openings', { headers }).catch(() => ({ data: [] }))
      ]);

      console.log('Events Response:', eventsRes.data);
      console.log('Mentorships Response:', mentorshipsRes.data);
      console.log('Jobs Response:', jobsRes.data);

      // Filter upcoming events only (events with dateTime >= now)
      const now = new Date();
      const upcomingEvents = eventsRes.data?.events?.filter(event => {
        const eventDate = new Date(event.dateTime);
        return eventDate >= now;
      }) || [];

      // Count unread messages for students
      let unreadMessages = 0;
      try {
        const contactsRes = await axios.get('http://localhost:8083/api/messages/contacts', { headers });
        const contacts = contactsRes.data || [];
        unreadMessages = contacts.filter(contact => contact.unreadCount > 0).length;
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
      
      // Events response has { events, page, total } structure
      // Mentorships and jobs return arrays directly
      const studentStats = {
        stats: {
          totalEvents: upcomingEvents.length,
          totalMentorships: Array.isArray(mentorshipsRes.data) ? mentorshipsRes.data.length : 0,
          totalJobOpenings: Array.isArray(jobsRes.data) ? jobsRes.data.length : 0,
          unreadMessages: unreadMessages
        }
      };
      
      console.log('Student Stats:', studentStats);
      setStats(studentStats);
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    const photo = localStorage.getItem("profilePhoto");
    const userRole = localStorage.getItem("userRole");

    if (user) setLoggedInUser(user);
    if (photo) setProfilePhoto(photo);
    if (userRole) setRole(userRole);

    // Fetch profile and stats based on role
    if (userRole === "alumni" && userId) {
      fetchAlumniData();
    } else if (userRole === "student" && userId) {
      fetchStudentData();
    }

    // Check URL parameters for section
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    if (section) {
      setActiveSection(section);
      // Clear the query parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check for preselected user from Network component
    const selectedUserJson = localStorage.getItem('selectedChatUser');
    if (selectedUserJson) {
      try {
        const selectedUser = JSON.parse(selectedUserJson);
        setPreSelectedUser(selectedUser);
        localStorage.removeItem('selectedChatUser'); // Clear after use
      } catch (error) {
        console.error('Error parsing selected user:', error);
      }
    }
  }, [fetchAlumniData, fetchStudentData, userId]);

  useEffect(() => {
    if (activeSection === 'home' && userId) {
      if (role === 'alumni') {
        fetchAlumniData();
      } else if (role === 'student') {
        fetchStudentData();
      }
    } else if (activeSection === 'dashboard' && userId) {
      // Also refresh when switching to dashboard from messages
      if (role === 'alumni') {
        fetchAlumniData();
      } else if (role === 'student') {
        fetchStudentData();
      }
    }
  }, [activeSection, role, userId, fetchAlumniData, fetchStudentData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleChatClick = (person) => {
    // Set the preselected user
    setPreSelectedUser(person);
    // Change section to messages
    setActiveSection('messages');
  };

  const handleMentorChat = (mentorship) => {
    // Create a mentor user object from mentorship data
    const mentorUser = {
      _id: mentorship.mentorId || mentorship._id,
      fullName: mentorship.mentorName,
      profilePhoto: mentorship.mentorPhoto || assets.Profile,
      email: mentorship.mentorEmail || '',
      role: 'alumni'
    };
    // Set the preselected user and navigate to messages
    setPreSelectedUser(mentorUser);
    setActiveSection('messages');
  };

  const currentDate = new Date().toLocaleDateString();

  const handleCardClick = (title) => {
    setActiveCard(title);
    if (title === "Events") setActiveSection("events");
    if (title === "Network") setActiveSection("network");
    if (title === "Open Source") setActiveSection("open-source");
  };

  const handleStatClick = (action) => {
    setActiveSection(action);
  };

  const handleShortcutClick = (action) => {
    // Normalize quick-access actions to existing sections
    const shortcutMap = {
      'saved-events': 'events',
      'saved-mentors': role === 'alumni' ? 'network' : 'mentorships',
      'saved-jobs': 'job-openings',
    };

    const nextSection = shortcutMap[action] || action;
    setActiveSection(nextSection);
    // Jump to top so the user immediately sees the target section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleCancelForm = () => setActiveCard("");

  // Smooth-scroll to the form section when a form card is activated
  useEffect(() => {
    if (
      activeCard === "Schedule an Event" ||
      activeCard === "Host a Mentorship" ||
      activeCard === "Job Openings"
    ) {
      setTimeout(() => {
        formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }, [activeCard]);

  const renderProfileCompleteness = () => {
    if (!profileData?.profileCompleteness) return null;
    
    const { percentage, missingFields } = profileData.profileCompleteness;
    const color = percentage === 100 ? 'text-green-600' : percentage >= 75 ? 'text-blue-600' : 'text-yellow-600';
    const bgColor = percentage === 100 ? 'bg-green-50' : percentage >= 75 ? 'bg-blue-50' : 'bg-yellow-50';
    const borderColor = percentage === 100 ? 'border-green-200' : percentage >= 75 ? 'border-blue-200' : 'border-yellow-200';
    
    return (
      <div className={`${bgColor} rounded-xl shadow-md p-4 sm:p-5 mb-4 mx-4 border ${borderColor}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800">Profile Completeness</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {percentage === 100 ? '🎉 Your profile is complete!' : `${missingFields?.length || 0} fields remaining`}
            </p>
          </div>
          <span className={`text-2xl sm:text-3xl font-bold ${color}`}>{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 shadow-inner">
          <div
            className={`h-3 sm:h-4 rounded-full transition-all duration-500 ${
              percentage === 100 ? 'bg-green-600' : percentage >= 75 ? 'bg-blue-600' : 'bg-yellow-600'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        {percentage < 100 && missingFields && missingFields.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-300">
            <p className="text-sm font-semibold text-gray-700 mb-2">Complete these fields:</p>
            <div className="flex flex-wrap gap-2">
              {missingFields.map((field, idx) => (
                <span key={idx} className="text-xs bg-white px-3 py-1 rounded-full border border-gray-300 text-gray-700">
                  {field}
                </span>
              ))}
            </div>
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              Update Profile →
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderVerificationStatus = () => {
    if (role !== "alumni" || !profileData?.alumni) return null;
    
    const isVerified = profileData.alumni.verified;
    
    return (
      <div className={`bg-white rounded-lg shadow-md p-3 sm:p-4 mb-4 mx-2 sm:mx-4 border-l-4 ${
        isVerified ? 'border-l-green-600' : 'border-l-yellow-600'
      }`}>
        <div className="flex items-center gap-3">
          {isVerified ? (
            <>
              <CheckCircle className="text-green-600 w-6 h-6" />
              <div>
                <h3 className="font-semibold text-green-600">Verified Alumni</h3>
                <p className="text-sm text-gray-600">Your alumni status is verified</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="text-yellow-600 w-6 h-6" />
              <div>
                <h3 className="font-semibold text-yellow-600">Pending Verification</h3>
                <p className="text-sm text-gray-600">Your alumni status is under review</p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderStats = () => {
    // Use actual stats or provide default empty stats
    const statsData = stats?.stats || { totalEvents: 0, totalMentorships: 0, totalJobOpenings: 0, unreadMessages: 0 };
    return <QuickStats role={role} stats={statsData} onStatClick={handleStatClick} />;
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
            {role === "alumni" && (
              <>
                <div className="mt-8 mb-6 mx-2 sm:mx-4">
                  <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-sm uppercase tracking-wide opacity-90">Alumni Dashboard</p>
                        <h3 className="text-2xl sm:text-3xl font-bold mt-1">Share your expertise and give back</h3>
                        <p className="text-sm sm:text-base opacity-90 mt-2 max-w-2xl">
                          Create events, offer mentorship to students, post job opportunities, and help the next generation succeed. Your experience matters!
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleCardClick("Schedule an Event")}
                        className="px-4 py-2 bg-white/15 border border-white/30 rounded-lg text-white hover:bg-white/25 transition"
                      >
                        Schedule event
                      </button>
                      <button
                        onClick={() => handleCardClick("Host a Mentorship")}
                        className="px-4 py-2 bg-white/15 border border-white/30 rounded-lg text-white hover:bg-white/25 transition"
                      >
                        Host mentorship
                      </button>
                      <button
                        onClick={() => handleCardClick("Job Openings")}
                        className="px-4 py-2 bg-white text-purple-700 font-semibold rounded-lg hover:bg-gray-100 transition"
                      >
                        Post job
                      </button>
                    </div>
                  </div>
                </div>

                <AlumniDashboardHeader stats={stats} profileData={profileData} />
                {renderVerificationStatus()}
                {renderProfileCompleteness()}
                {renderStats()}
                <Achievements stats={stats?.stats || { totalEvents: 0, totalMentorships: 0, totalJobOpenings: 0 }} />
                <SuccessMetrics stats={{
                  followers: stats?.followers || 0,
                  studentsConnected: stats?.stats?.studentsConnected || 0,
                  mentorshipsCompleted: stats?.stats?.mentorshipsCompleted || 0,
                  jobsFilled: stats?.stats?.jobsFilled || 0,
                  averageRating: stats?.averageRating || 0
                }} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 px-2 sm:px-4">
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">Create & Post</h3>
                    <div className="space-y-3">
                      <Card
                        title="Schedule an Event"
                        description="Organize and promote alumni events."
                        icon={assets.Calender}
                        onClick={() => handleCardClick("Schedule an Event")}
                      />
                      <Card
                        title="Host a Mentorship"
                        description="Offer your expertise to students and fellow alumni."
                        icon={assets.ShakeHand}
                        onClick={() => handleCardClick("Host a Mentorship")}
                      />
                      <Card
                        title="Job Openings"
                        description="Share opportunities with alumni."
                        icon={assets.Money}
                        onClick={() => handleCardClick("Job Openings")}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">Calendar</h3>
                    <MiniCalendar onDateClick={handleDateClick} />
                  </div>
                </div>

                <div className="mt-8 px-2 sm:px-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">Manage Your Posts</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <Card
                      title="View My Events"
                      description="Manage events you've created."
                      icon={assets.Calender}
                      onClick={() => setActiveSection("my-events")}
                    />
                    <Card
                      title="View My Mentorships"
                      description="Manage mentorships you're offering."
                      icon={assets.ShakeHand}
                      onClick={() => setActiveSection("my-mentorships")}
                    />
                    <Card
                      title="View My Job Posts"
                      description="Manage job openings you've posted."
                      icon={assets.Money}
                      onClick={() => setActiveSection("my-jobs")}
                    />
                  </div>
                </div>
              </>
            )}

            {role === "student" && (
              <div className="mt-8 px-2 sm:px-4 space-y-6">
                <div className="bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 text-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-wide opacity-90">Student Dashboard</p>
                      <h3 className="text-2xl sm:text-3xl font-bold mt-1">Explore guidance and opportunities</h3>
                      <p className="text-sm sm:text-base opacity-90 mt-2 max-w-2xl">
                        Connect with alumni mentors, browse open mentorship sessions, and find job opportunities curated by alumni.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveSection("network")}
                      className="px-4 py-2 bg-white/15 border border-white/30 rounded-lg text-white hover:bg-white/25 transition"
                    >
                      Find mentors
                    </button>
                    <button
                      onClick={() => setActiveSection("job-openings")}
                      className="px-4 py-2 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition"
                    >
                      View jobs
                    </button>
                  </div>
                </div>

                {renderStats()}
                <SavedShortcuts role={role} onShortcutClick={handleShortcutClick} />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card
                    title="Find Mentors"
                    description="Connect with alumni for guidance."
                    icon={assets.ShakeHand}
                    onClick={() => setActiveSection("network")}
                  />
                  <Card
                    title="Mentorship Listings"
                    description="Browse available mentorship sessions."
                    icon={assets.ShakeHand}
                    onClick={() => setActiveSection("mentorships")}
                  />
                  <Card
                    title="Job Opportunities"
                    description="Explore alumni-shared job openings."
                    icon={assets.Money}
                    onClick={() => setActiveSection("job-openings")}
                  />
                </div>
              </div>
            )}
          </>
        );
      case "events":
        return <EventsList searchQuery={searchQuery} />;
      case "my-events":
        return <EventsList searchQuery={searchQuery} filterByCreator={true} />;
      case "my-mentorships":
        return <MentorshipList searchQuery={searchQuery} onMentorChat={handleMentorChat} filterByMentor={true} />;
      case "my-jobs":
        return <JobOpeningsList searchQuery={searchQuery} filterByPoster={true} />;
      case "network":
        return <Network onChatClick={handleChatClick} />;
      case "open-source":
        return <OpenSource />;
      case "messages":
        return (
          <div className="h-[calc(100vh-10rem)] md:h-[calc(100vh-9rem)] overflow-hidden px-0">
            <Messages loggedInUser={loggedInUser} preSelectedUser={preSelectedUser} />
          </div>
        );
      case "mentorships":
        return <MentorshipList searchQuery={searchQuery} onMentorChat={handleMentorChat} />;
      case "job-openings":
        return <JobOpeningsList searchQuery={searchQuery} />;
      case "settings":
        return (
          <div className="px-4 py-6 bg-white dark:bg-slate-950 min-h-[calc(100vh-10rem)]">
            <UserSettings
              role={role}
              userName={loggedInUser}
              onSave={() => { /* toast hook reserved */ }}
              onEditProfile={() => setIsEditProfileOpen(true)}
            />
          </div>
        );
      default:
        return <div>Default content</div>;
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#EDF0F7] dark:bg-slate-950 overflow-x-hidden">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#EDF0F7] dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 h-16 sm:h-20 flex items-center px-2 sm:px-4 pl-14 sm:pl-16 md:pl-4 md:ml-20">
        <div className="w-full flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Name & Date */}
          <div className="flex flex-col justify-center min-w-0 flex-shrink">
            <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-outfit font-bold text-gray-900 dark:text-white typewriter truncate">
              Welcome, {loggedInUser}
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-slate-400">{currentDate}</p>
          </div>

          {/* Center: Search & Bell */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 justify-center flex-1 max-w-xs sm:max-w-sm md:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 w-20 sm:w-32 md:w-48 lg:w-56"
            />
            {role === 'alumni' && activeSection === 'home' && (
              <button
                onClick={() => fetchAlumniData()}
                className="p-1.5 sm:p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition flex-shrink-0 hidden sm:block"
                title="Refresh stats"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setIsNotificationsPanelOpen(!isNotificationsPanelOpen)}
              className="relative p-1.5 sm:p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition flex-shrink-0"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-slate-300" />
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          {/* Right: Profile Image */}
          <div className="relative flex flex-col items-center min-w-fit flex-shrink-0" ref={dropdownRef}>
            <img
              src={profilePhoto || assets.Profile}
              alt="Profile"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-14 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg z-[60] border border-gray-200 dark:border-slate-700">
                <button
                  className="block px-4 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 w-full text-left rounded-t-md transition"
                  onClick={() => {
                    setActiveSection("settings");
                    setIsDropdownOpen(false);
                  }}
                >
                  Settings
                </button>
                <button
                  className="block px-4 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 w-full text-left rounded-b-md transition"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    localStorage.removeItem("loggedInUser");
                    localStorage.removeItem("userRole");
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Rest of the layout */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-6 left-4 z-50 bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg p-2 rounded-lg hover:opacity-90 md:hidden transition"
      >
        <Menu className="h-5 w-5 text-white" />
      </button>

      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Navigation */}
        <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} onExpandedChange={setIsSidebarExpanded} />
      </div>

      <div className="w-full md:w-[calc(100%-5rem)] ml-0 md:ml-20 pt-16 sm:pt-20 overflow-x-hidden bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)] transition-colors">

        {renderContent()}

        <div className="mt-8 px-4" ref={formSectionRef}>
          {role === "alumni" && activeCard === "Schedule an Event" && (
            <ScheduleEventForm onCancel={handleCancelForm} />
          )}
          {role === "alumni" && activeCard === "Host a Mentorship" && (
            <HostMentorshipForm onCancel={handleCancelForm} />
          )}
          {role === "alumni" && activeCard === "Job Openings" && (
            <JobOpeningsForm onCancel={handleCancelForm} />
          )}
        </div>
      </div>

      <NotificationsPanel isOpen={isNotificationsPanelOpen} onClose={() => setIsNotificationsPanelOpen(false)} />

      {isEditProfileOpen && (
        <EditProfilePopup onClose={() => {
          setIsEditProfileOpen(false);
          fetchAlumniData();
        }} />
      )}
    </div>
  );
}

export default Dashboard;
