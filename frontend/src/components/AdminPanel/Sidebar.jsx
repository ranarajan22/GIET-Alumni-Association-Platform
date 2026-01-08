import React from 'react';
import { Users, GraduationCap, Settings, LayoutDashboard, BarChart3 } from 'lucide-react';
import { assets } from '../../assets/assets';

function Sidebar({ setCurrentView, currentView, onClose }) {
    const handleMenuClick = (key) => {
        setCurrentView(key);
        if (onClose) onClose();
    };

    const menuItems = [
           { label: 'Dashboard', key: 'all', icon: LayoutDashboard },
           { label: 'Students', key: 'students', icon: Users },
           { label: 'Alumni', key: 'alumni', icon: GraduationCap },
           { label: 'Events', key: 'events', icon: BarChart3 },
           { label: 'Jobs', key: 'jobs', icon: BarChart3 },
           { label: 'Mentorships', key: 'mentorships', icon: BarChart3 },
           { label: 'Messages', key: 'messages', icon: Settings },
           { label: 'Subscribers', key: 'subscribers', icon: Settings },
           { label: 'Settings', key: 'settings', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-950 text-white h-screen border-r border-slate-800 shadow-xl flex flex-col">
            <div className="py-6 px-6 border-b border-slate-800">
                <img src={assets.Logo} alt="Logo" className="h-10 w-auto mb-3" />
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Control Center</p>
                <h2 className="text-2xl font-bold text-white mt-1">Admin Panel</h2>
            </div>
            <nav className="flex-1 py-4 overflow-y-auto">
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
                                            ? 'bg-slate-800 text-cyan-300 border-l-4 border-cyan-400 shadow-inner'
                                            : 'text-slate-200 hover:bg-slate-900 hover:text-white'
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
            <div className="p-4 border-t border-slate-800">
                <p className="text-xs text-slate-500 text-center">© 2025 Alumni Connect</p>
            </div>
        </aside>
    );
}

export default Sidebar;
