import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, Sun, Moon } from 'lucide-react';
import { assets } from '../../assets/assets';

function AdminHeader({ onMenuClick, theme = 'dark', onToggleTheme }) {
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const loggedInUser = localStorage.getItem('loggedInUser') || 'Admin';
  const storedPhoto = localStorage.getItem('profilePhoto');
  const cleanedPhoto = storedPhoto?.trim();
  const profilePhoto = cleanedPhoto && cleanedPhoto !== 'undefined' && cleanedPhoto !== 'null'
    ? cleanedPhoto
    : assets.Profile;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className={isDark
      ? 'fixed top-0 left-0 w-full bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 backdrop-blur-md z-50 flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-700 shadow-lg'
      : 'fixed top-0 left-0 w-full bg-gradient-to-r from-white via-slate-100 to-white backdrop-blur-md z-50 flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-200 shadow-lg'}>
      {/* Left Side - Logo & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className={isDark ? 'md:hidden p-2 hover:bg-slate-800 rounded-lg transition' : 'md:hidden p-2 hover:bg-slate-200 rounded-lg transition'}
        >
          <Menu className={isDark ? 'w-6 h-6 text-white' : 'w-6 h-6 text-slate-900'} />
        </button>
        <img
          src={assets.Logo}
          alt="Admin"
          className="w-12 h-12 rounded-lg hover:scale-110 transition-transform cursor-pointer"
          onClick={() => navigate('/admin')}
        />
        <div>
          <h1 className={isDark ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-slate-900'}>Admin Portal</h1>
          <p className={isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-600'}>Management Dashboard</p>
        </div>
      </div>

      {/* Right Side - User Info & Logout */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleTheme}
          className={isDark
            ? 'flex items-center gap-2 px-3 py-2 bg-slate-800/70 hover:bg-slate-700 text-slate-100 rounded-lg transition border border-slate-600'
            : 'flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition border border-slate-300'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span className="hidden sm:inline text-xs font-semibold">{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
        </button>

        {/* User Info */}
        <div className={isDark ? 'flex items-center gap-3 pr-4 border-r border-slate-700' : 'flex items-center gap-3 pr-4 border-r border-slate-300'}>
          <img
            src={profilePhoto}
            alt={loggedInUser}
            className="w-10 h-10 rounded-full object-cover border border-blue-500"
            onError={(e) => {
              // Fallback to bundled placeholder if the stored URL fails
              if (e.target.src !== assets.Profile) {
                e.target.src = assets.Profile;
              }
            }}
          />
          <div className="hidden sm:block">
            <p className={isDark ? 'text-sm font-semibold text-white' : 'text-sm font-semibold text-slate-900'}>{loggedInUser}</p>
            <p className={isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-600'}>Administrator</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg transition border border-red-600/50 font-semibold"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default AdminHeader;
