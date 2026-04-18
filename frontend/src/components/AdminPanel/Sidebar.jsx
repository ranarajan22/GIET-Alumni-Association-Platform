import React from 'react';
import { Users, GraduationCap, Settings, LayoutDashboard, BarChart3, Upload } from 'lucide-react';
import { assets } from '../../assets/assets';

function Sidebar({ setCurrentView, currentView, onClose, theme = 'dark' }) {
    const isDark = theme === 'dark';
    const handleMenuClick = (key) => {
        setCurrentView(key);
        if (onClose) onClose();
    };

    const menuItems = [
           { label: 'Dashboard', key: 'all', icon: LayoutDashboard },
           { label: 'Students', key: 'students', icon: Users },
           { label: 'Alumni', key: 'alumni', icon: GraduationCap },
           { label: 'Bulk Import', key: 'import', icon: Upload },
           { label: 'Events', key: 'events', icon: BarChart3 },
           { label: 'Jobs', key: 'jobs', icon: BarChart3 },
           { label: 'Mentorships', key: 'mentorships', icon: BarChart3 },
           { label: 'Messages', key: 'messages', icon: Settings },
           { label: 'Subscribers', key: 'subscribers', icon: Settings },
           { label: 'Settings', key: 'settings', icon: Settings },
    ];

    return (
        <aside className={isDark ? 'w-64 bg-gradient-to-b from-slate-900 to-slate-950 text-white h-full border-r border-slate-800 shadow-xl flex flex-col overflow-hidden' : 'w-64 bg-gradient-to-b from-white to-slate-100 text-slate-900 h-full border-r border-slate-200 shadow-xl flex flex-col overflow-hidden'}>
            <div className={isDark ? 'py-6 px-6 border-b border-slate-800' : 'py-6 px-6 border-b border-slate-200'}>
                <img src={assets.Logo} alt="Logo" className="h-10 w-auto mb-3" />
                <p className={isDark ? 'text-xs uppercase tracking-[0.2em] text-slate-400' : 'text-xs uppercase tracking-[0.2em] text-slate-600'}>Control Center</p>
                <h2 className={isDark ? 'text-2xl font-bold text-white mt-1' : 'text-2xl font-bold text-slate-900 mt-1'}>Admin Panel</h2>
            </div>
            <nav className="flex-1 min-h-0 py-4 overflow-y-auto">
                <ul>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = currentView === item.key;
                        return (
                            <li key={item.key}>
                                <button
                                    type="button"
                                    onClick={() => handleMenuClick(item.key)}
                                    className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-semibold transition-all duration-150 ${
                                        active
                                            ? isDark
                                                ? 'bg-slate-800 text-cyan-300 border-l-4 border-cyan-400 shadow-inner'
                                                : 'bg-cyan-50 text-cyan-700 border-l-4 border-cyan-500 shadow-inner'
                                            : isDark
                                                ? 'text-slate-200 hover:bg-slate-900 hover:text-white'
                                                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className={isDark ? 'p-4 border-t border-slate-800' : 'p-4 border-t border-slate-200'}>
                <p className={isDark ? 'text-xs text-slate-500 text-center' : 'text-xs text-slate-600 text-center'}>© 2025 Alumni Connect</p>
            </div>
        </aside>
    );
}

export default Sidebar;
