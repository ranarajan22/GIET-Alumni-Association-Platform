import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { Users, GraduationCap, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import AdminHeader from './AdminHeader';
import Sidebar from './Sidebar';
import Alumni from './Alumni';
import Students from './Students';
import AdminSettings from './AdminSettings';
import AdvancedMetrics from './AdvancedMetrics';
import ContactMessages from './ContactMessages';
import SubscribersList from './SubscribersList';
import AdminPosts from './AdminPosts';
import BulkAlumniImport from './BulkAlumniImport';
import AdminViewErrorBoundary from './AdminViewErrorBoundary';
import { assets } from '../../assets/assets';

function AdminPanel() {
    const [currentView, setCurrentView] = useState('all');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('adminTheme') || 'dark');
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalAlumni: 0,
        verifiedAlumni: 0,
        eventsCount: 0,
        jobsCount: 0,
        mentorshipsCount: 0
    });
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const isDark = theme === 'dark';

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

    useEffect(() => {
        localStorage.setItem('adminTheme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    const fetchMetrics = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            console.log('Fetching metrics from:', `${API_BASE_URL}/admin/metrics`, 'with token:', !!token);
            const response = await axios.get(`${API_BASE_URL}/admin/metrics`, { headers });
            console.log('Metrics response:', response.data);
            setStats({
                totalStudents: response.data.totalStudents,
                totalAlumni: response.data.totalAlumni,
                verifiedAlumni: response.data.verifiedAlumni,
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
            console.log('Fetching activity from:', `${API_BASE_URL}/admin/activity`, 'with token:', !!token);
            const response = await axios.get(`${API_BASE_URL}/admin/activity`, { headers });
            console.log('Activity response:', response.data);
            setActivity(response.data.feed?.slice(0, 10) || []);
        } catch (error) {
            console.error('Error fetching activity:', error.message, error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={theme === 'dark' ? 'min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white' : 'min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 text-slate-900'}>
            {/* Admin Header */}
            <AdminHeader
                onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                theme={theme}
                onToggleTheme={toggleTheme}
            />

            <div className="flex h-[calc(100vh-5rem)] mt-20 overflow-hidden">
                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <div className={`fixed top-20 bottom-0 left-0 md:static md:top-auto md:bottom-auto z-40 transform transition-transform duration-300 md:h-full md:overflow-y-auto ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}>
                    <Sidebar setCurrentView={setCurrentView} currentView={currentView} onClose={() => setIsSidebarOpen(false)} theme={theme} />
                </div>

                {/* Main Content */}
                <main className="flex-1 w-full h-full overflow-hidden">
                    {/* Content Area */}
                    <div className="h-full p-4 sm:p-6 lg:p-10 space-y-6 lg:space-y-8 overflow-y-auto">
                        {currentView === 'all' && (
                            <>
                                {/* Stats Cards - Real Time */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                                <button 
                                    onClick={() => setCurrentView('students')}
                                    className={isDark ? 'bg-gradient-to-br from-blue-600/20 to-blue-500/10 border border-blue-500/30 rounded-2xl p-5 hover:scale-105 transition-transform cursor-pointer text-left' : 'bg-gradient-to-br from-blue-100 to-white border border-blue-300 rounded-2xl p-5 hover:scale-105 transition-transform cursor-pointer text-left'}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <Users className="w-8 h-8 text-blue-400" />
                                        <span className={isDark ? 'text-3xl font-bold text-white' : 'text-3xl font-bold text-slate-900'}>{stats.totalStudents}</span>
                                    </div>
                                    <p className={isDark ? 'text-sm font-medium text-slate-200' : 'text-sm font-medium text-slate-800'}>Total Students</p>
                                    <p className={isDark ? 'text-xs text-slate-400 mt-1' : 'text-xs text-slate-600 mt-1'}>Click to view list</p>
                                </button>

                                <button
                                    onClick={() => setCurrentView('all-alumni')}
                                    className={isDark ? 'bg-gradient-to-br from-purple-600/20 to-purple-500/10 border border-purple-500/30 rounded-2xl p-5 hover:scale-105 transition-transform cursor-pointer text-left' : 'bg-gradient-to-br from-purple-100 to-white border border-purple-300 rounded-2xl p-5 hover:scale-105 transition-transform cursor-pointer text-left'}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <GraduationCap className="w-8 h-8 text-purple-400" />
                                        <span className={isDark ? 'text-3xl font-bold text-white' : 'text-3xl font-bold text-slate-900'}>{stats.totalAlumni}</span>
                                    </div>
                                    <p className={isDark ? 'text-sm font-medium text-slate-200' : 'text-sm font-medium text-slate-800'}>Total Alumni</p>
                                    <p className={isDark ? 'text-xs text-slate-400 mt-1' : 'text-xs text-slate-600 mt-1'}>Registered: {stats.verifiedAlumni}</p>
                                </button>

                                <div className={isDark ? 'bg-gradient-to-br from-green-600/20 to-green-500/10 border border-green-500/30 rounded-2xl p-5 hover:scale-105 transition-transform' : 'bg-gradient-to-br from-green-100 to-white border border-green-300 rounded-2xl p-5 hover:scale-105 transition-transform'}>
                                    <div className="flex items-center justify-between mb-3">
                                        <TrendingUp className="w-8 h-8 text-green-400" />
                                        <span className={isDark ? 'text-3xl font-bold text-white' : 'text-3xl font-bold text-slate-900'}>{stats.eventsCount + stats.jobsCount + stats.mentorshipsCount}</span>
                                    </div>
                                    <p className={isDark ? 'text-sm font-medium text-slate-200' : 'text-sm font-medium text-slate-800'}>Total Postings</p>
                                    <p className={isDark ? 'text-xs text-slate-400 mt-1' : 'text-xs text-slate-600 mt-1'}>Events, Jobs & Mentorships</p>
                                </div>
                            </div>

                            {/* Secondary Stats Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                                <button onClick={() => setCurrentView('events')} className={isDark ? 'bg-slate-800/40 border border-slate-700 rounded-xl p-4 text-left hover:border-cyan-500/50 transition' : 'bg-white border border-slate-300 rounded-xl p-4 text-left hover:border-cyan-500/50 transition'}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-cyan-400" />
                                        </div>
                                        <div>
                                            <p className={isDark ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-slate-900'}>{stats.eventsCount}</p>
                                            <p className={isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-600'}>Events Posted</p>
                                        </div>
                                    </div>
                                </button>

                                <button onClick={() => setCurrentView('jobs')} className={isDark ? 'bg-slate-800/40 border border-slate-700 rounded-xl p-4 text-left hover:border-cyan-500/50 transition' : 'bg-white border border-slate-300 rounded-xl p-4 text-left hover:border-cyan-500/50 transition'}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className={isDark ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-slate-900'}>{stats.jobsCount}</p>
                                            <p className={isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-600'}>Job Openings</p>
                                        </div>
                                    </div>
                                </button>

                                <button onClick={() => setCurrentView('mentorships')} className={isDark ? 'bg-slate-800/40 border border-slate-700 rounded-xl p-4 text-left hover:border-cyan-500/50 transition' : 'bg-white border border-slate-300 rounded-xl p-4 text-left hover:border-cyan-500/50 transition'}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                                            <Users className="w-5 h-5 text-pink-400" />
                                        </div>
                                        <div>
                                            <p className={isDark ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-slate-900'}>{stats.mentorshipsCount}</p>
                                            <p className={isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-600'}>Mentorships Available</p>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            {/* Recent Activity Feed */}
                            <div className={isDark ? 'bg-slate-900/60 border border-slate-800 rounded-2xl p-6' : 'bg-white border border-slate-200 rounded-2xl p-6'}>
                                <div className="flex items-center gap-3 mb-4">
                                    <Activity className="w-6 h-6 text-cyan-400" />
                                    <h2 className={isDark ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-slate-900'}>Recent Activity</h2>
                                </div>

                                {loading ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className={isDark ? 'h-12 bg-slate-800 rounded-lg animate-pulse' : 'h-12 bg-slate-200 rounded-lg animate-pulse'} />
                                        ))}
                                    </div>
                                ) : activity.length === 0 ? (
                                    <p className={isDark ? 'text-slate-400 text-center py-8' : 'text-slate-600 text-center py-8'}>No activity yet</p>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {activity.map((item, idx) => (
                                            <div key={idx} className={isDark ? 'flex items-start gap-4 p-3 bg-slate-800/40 rounded-lg border border-slate-700/50 hover:border-slate-600 transition' : 'flex items-start gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition'}>
                                                <img
                                                    src={item.photo || assets.Profile}
                                                    alt={item.by}
                                                    className={isDark ? 'w-10 h-10 rounded-full object-cover border border-slate-600' : 'w-10 h-10 rounded-full object-cover border border-slate-300'}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className={isDark ? 'text-sm text-white font-medium truncate' : 'text-sm text-slate-900 font-medium truncate'}>{item.by || 'Anonymous'}</p>
                                                    <p className={isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-600'}>
                                                        Added a <span className="text-cyan-500 font-semibold">{item.type}</span>: <span className={isDark ? 'text-slate-300 truncate' : 'text-slate-700 truncate'}>{item.title}</span>
                                                    </p>
                                                    <p className={isDark ? 'text-xs text-slate-500 mt-1' : 'text-xs text-slate-600 mt-1'}>
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Platform Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                                                    <div className={isDark ? 'bg-slate-900/60 border border-slate-800 rounded-2xl p-5' : 'bg-white border border-slate-200 rounded-2xl p-5'}>
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <p className={isDark ? 'text-xs uppercase tracking-[0.2em] text-slate-500' : 'text-xs uppercase tracking-[0.2em] text-slate-600'}>Alumni Verification</p>
                                                                <h3 className={isDark ? 'text-2xl font-bold text-white mt-1' : 'text-2xl font-bold text-slate-900 mt-1'}>{stats.totalAlumni > 0 ? Math.round((stats.verifiedAlumni / stats.totalAlumni) * 100) : 0}%</h3>
                                                            </div>
                                                            <div className={isDark ? 'px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-semibold' : 'px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-semibold'}>{stats.verifiedAlumni}/{stats.totalAlumni}</div>
                                                        </div>
                                                        <p className={isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-600'}>Registered & Verified</p>
                                                    </div>

                                                    <div className={isDark ? 'bg-slate-900/60 border border-slate-800 rounded-2xl p-5' : 'bg-white border border-slate-200 rounded-2xl p-5'}>
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <p className={isDark ? 'text-xs uppercase tracking-[0.2em] text-slate-500' : 'text-xs uppercase tracking-[0.2em] text-slate-600'}>Platform Health</p>
                                                                <h3 className={isDark ? 'text-2xl font-bold text-white mt-1' : 'text-2xl font-bold text-slate-900 mt-1'}>Excellent</h3>
                                                            </div>
                                                            <div className={isDark ? 'px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-semibold' : 'px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-semibold'}>Live</div>
                                                        </div>
                                                        <p className={isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-600'}>All systems operational</p>
                                                    </div>

                                                    <div className={isDark ? 'bg-slate-900/60 border border-slate-800 rounded-2xl p-5' : 'bg-white border border-slate-200 rounded-2xl p-5'}>
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <p className={isDark ? 'text-xs uppercase tracking-[0.2em] text-slate-500' : 'text-xs uppercase tracking-[0.2em] text-slate-600'}>Active Users</p>
                                                                <h3 className={isDark ? 'text-2xl font-bold text-white mt-1' : 'text-2xl font-bold text-slate-900 mt-1'}>{stats.totalStudents + stats.totalAlumni}</h3>
                                                            </div>
                                                            <div className={isDark ? 'px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-sm font-semibold' : 'px-3 py-1 rounded-lg bg-purple-100 text-purple-700 text-sm font-semibold'}>Total</div>
                                                        </div>
                                                        <p className={isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-600'}>Students + Alumni combined</p>
                                                    </div>
                            </div>

                        </>

                    )}
                    {currentView === 'students' && <Students theme={theme} />}
                    {currentView === 'alumni' && <Alumni theme={theme} />}
                    {currentView === 'import' && (
                        <AdminViewErrorBoundary onReset={() => setCurrentView('all')}>
                            <BulkAlumniImport theme={theme} />
                        </AdminViewErrorBoundary>
                    )}
                    {currentView === 'all-alumni' && <Alumni showAll={true} theme={theme} />}
                    {currentView === 'messages' && <ContactMessages theme={theme} />}
                    {currentView === 'subscribers' && <SubscribersList theme={theme} />}
                    {currentView === 'events' && <AdminPosts view="events" theme={theme} />}
                    {currentView === 'jobs' && <AdminPosts view="jobs" theme={theme} />}
                    {currentView === 'mentorships' && <AdminPosts view="mentorships" theme={theme} />}
                    {currentView === 'settings' && <AdminSettings theme={theme} />}
                    {currentView === 'analytics' && <AdvancedMetrics stats={stats} theme={theme} />}
                </div>
            </main>
            </div>
        </div>
    );
}

export default AdminPanel;
