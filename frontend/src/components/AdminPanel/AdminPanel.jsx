import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ORIGIN } from '../../config';
import { Users, GraduationCap, Clock, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import AdminHeader from './AdminHeader';
import Sidebar from './Sidebar';
import Alumni from './Alumni';
import Students from './Students';
import AdminSettings from './AdminSettings';
import AdvancedMetrics from './AdvancedMetrics';
import ContactMessages from './ContactMessages';
import SubscribersList from './SubscribersList';
import AdminPosts from './AdminPosts';
import { assets } from '../../assets/assets';

function AdminPanel() {
    const [currentView, setCurrentView] = useState('all');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalAlumni: 0,
        pendingVerifications: 0,
        verifiedAlumni: 0,
        eventsCount: 0,
        jobsCount: 0,
        mentorshipsCount: 0
    });
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMetrics();
        fetchActivity();
        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchMetrics();
            fetchActivity();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchMetrics = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            console.log('Fetching metrics from:', `${API_ORIGIN}/admin/metrics`, 'with token:', !!token);
            const response = await axios.get(`${API_ORIGIN}/admin/metrics`, { headers });
            console.log('Metrics response:', response.data);
            setStats({
                totalStudents: response.data.totalStudents,
                totalAlumni: response.data.totalAlumni,
                verifiedAlumni: response.data.verifiedAlumni,
                pendingVerifications: response.data.pendingVerifications,
                eventsCount: response.data.eventsCount,
                jobsCount: response.data.jobsCount,
                mentorshipsCount: response.data.mentorshipsCount
            });
        } catch (error) {
            console.error('Error fetching metrics:', error.message, error.response?.data || error);
        }
    };

    const fetchActivity = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            console.log('Fetching activity from:', `${API_ORIGIN}/admin/activity`, 'with token:', !!token);
            const response = await axios.get(`${API_ORIGIN}/admin/activity`, { headers });
            console.log('Activity response:', response.data);
            setActivity(response.data.feed?.slice(0, 10) || []);
        } catch (error) {
            console.error('Error fetching activity:', error.message, error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
            {/* Admin Header */}
            <AdminHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="flex pt-20">
                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <div className={`fixed md:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}>
                    <Sidebar setCurrentView={setCurrentView} currentView={currentView} onClose={() => setIsSidebarOpen(false)} />
                </div>

                {/* Main Content */}
                <main className="flex-1 w-full">
                    {/* Content Area */}
                    <div className="p-4 sm:p-6 lg:p-10 space-y-6 lg:space-y-8 overflow-y-auto">
                        {currentView === 'all' && (
                            <>
                                {/* Stats Cards - Real Time */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                                <button 
                                    onClick={() => setCurrentView('students')}
                                    className="bg-gradient-to-br from-blue-600/20 to-blue-500/10 border border-blue-500/30 rounded-2xl p-5 hover:scale-105 transition-transform cursor-pointer text-left"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <Users className="w-8 h-8 text-blue-400" />
                                        <span className="text-3xl font-bold text-white">{stats.totalStudents}</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-200">Total Students</p>
                                    <p className="text-xs text-slate-400 mt-1">Click to view list</p>
                                </button>

                                <button
                                    onClick={() => setCurrentView('all-alumni')}
                                    className="bg-gradient-to-br from-purple-600/20 to-purple-500/10 border border-purple-500/30 rounded-2xl p-5 hover:scale-105 transition-transform cursor-pointer text-left"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <GraduationCap className="w-8 h-8 text-purple-400" />
                                        <span className="text-3xl font-bold text-white">{stats.totalAlumni}</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-200">Total Alumni</p>
                                    <p className="text-xs text-slate-400 mt-1">Verified: {stats.verifiedAlumni}</p>
                                </button>

                                <div className="bg-gradient-to-br from-amber-600/20 to-amber-500/10 border border-amber-500/30 rounded-2xl p-5 hover:scale-105 transition-transform">
                                    <div className="flex items-center justify-between mb-3">
                                        <Clock className="w-8 h-8 text-amber-400" />
                                        <span className="text-3xl font-bold text-white">{stats.pendingVerifications}</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-200">Pending Verifications</p>
                                    <p className="text-xs text-slate-400 mt-1">Awaiting approval</p>
                                </div>

                                <div className="bg-gradient-to-br from-green-600/20 to-green-500/10 border border-green-500/30 rounded-2xl p-5 hover:scale-105 transition-transform">
                                    <div className="flex items-center justify-between mb-3">
                                        <TrendingUp className="w-8 h-8 text-green-400" />
                                        <span className="text-3xl font-bold text-white">{stats.eventsCount + stats.jobsCount + stats.mentorshipsCount}</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-200">Total Postings</p>
                                    <p className="text-xs text-slate-400 mt-1">Events, Jobs & Mentorships</p>
                                </div>
                            </div>

                            {/* Secondary Stats Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                                <button onClick={() => setCurrentView('events')} className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 text-left hover:border-cyan-500/50 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-cyan-400" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-white">{stats.eventsCount}</p>
                                            <p className="text-xs text-slate-400">Events Posted</p>
                                        </div>
                                    </div>
                                </button>

                                <button onClick={() => setCurrentView('jobs')} className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 text-left hover:border-cyan-500/50 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-white">{stats.jobsCount}</p>
                                            <p className="text-xs text-slate-400">Job Openings</p>
                                        </div>
                                    </div>
                                </button>

                                <button onClick={() => setCurrentView('mentorships')} className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 text-left hover:border-cyan-500/50 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                                            <Users className="w-5 h-5 text-pink-400" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-white">{stats.mentorshipsCount}</p>
                                            <p className="text-xs text-slate-400">Mentorships Available</p>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            {/* Recent Activity Feed */}
                            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Activity className="w-6 h-6 text-cyan-400" />
                                    <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
                                </div>

                                {loading ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="h-12 bg-slate-800 rounded-lg animate-pulse" />
                                        ))}
                                    </div>
                                ) : activity.length === 0 ? (
                                    <p className="text-slate-400 text-center py-8">No activity yet</p>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {activity.map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-4 p-3 bg-slate-800/40 rounded-lg border border-slate-700/50 hover:border-slate-600 transition">
                                                <img
                                                    src={item.photo || assets.Profile}
                                                    alt={item.by}
                                                    className="w-10 h-10 rounded-full object-cover border border-slate-600"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-white font-medium truncate">{item.by || 'Anonymous'}</p>
                                                    <p className="text-xs text-slate-400">
                                                        Added a <span className="text-cyan-400 font-semibold">{item.type}</span>: <span className="text-slate-300 truncate">{item.title}</span>
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Lists Section */}
                            <div className="space-y-6 lg:space-y-8">
                                <Students />
                                <Alumni />
                            </div>
                        </>
                    )}
                    {currentView === 'students' && <Students />}
                    {currentView === 'alumni' && <Alumni />}
                    {currentView === 'all-alumni' && <Alumni showAll={true} />}
                    {currentView === 'messages' && <ContactMessages />}
                    {currentView === 'subscribers' && <SubscribersList />}
                    {currentView === 'events' && <AdminPosts view="events" />}
                    {currentView === 'jobs' && <AdminPosts view="jobs" />}
                    {currentView === 'mentorships' && <AdminPosts view="mentorships" />}
                    {currentView === 'settings' && <AdminSettings />}
                    {currentView === 'analytics' && <AdvancedMetrics stats={stats} />}
                </div>
            </main>
            </div>
        </div>
    );
}

export default AdminPanel;
