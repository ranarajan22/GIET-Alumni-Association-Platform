import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { assets } from '../../assets/assets';

function AdminHeader({ onMenuClick }) {
  const navigate = useNavigate();
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
    <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 backdrop-blur-md z-50 flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-700 shadow-lg">
      {/* Left Side - Logo & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
        <img
          src={assets.Logo}
          alt="Admin"
          className="w-12 h-12 rounded-lg hover:scale-110 transition-transform cursor-pointer"
          onClick={() => navigate('/admin')}
        />
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-xs text-slate-400">Management Dashboard</p>
        </div>
      </div>

      {/* Right Side - User Info & Logout */}
      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3 pr-4 border-r border-slate-700">
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
            <p className="text-sm font-semibold text-white">{loggedInUser}</p>
            <p className="text-xs text-slate-400">Administrator</p>
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
