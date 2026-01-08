import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import GlobalSearch from './GlobalSearch';
import NotificationBell from './NotificationBell';
import DarkModeToggle from './DarkModeToggle';
import handleLogout from '../utils/logout';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const [isAuthed, setIsAuthed] = useState(Boolean(token && userRole));

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    });
  }, []);

  const [dropDown, setDropDown] = useState(false);

  const hiddenButtonPaths = ['/student-register', '/roleselection', '/login', '/alumni-register','/admin'];
  const hideButtons = hiddenButtonPaths.includes(location.pathname);
  const showAuthCtas = !isAuthed && !hideButtons;

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      // Only consider user authenticated if BOTH token AND userRole exist
      setIsAuthed(Boolean(token && userRole));
    };
    syncAuth();
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full bg-blue-700/95 dark:bg-blue-900/95 backdrop-blur-md z-50 flex items-center justify-between text-sm py-4 px-4 md:px-6 border-b border-blue-800 dark:border-blue-950 font-outfit shadow-lg">
      {/* Logo */}
      <img
        className="w-20 h-auto cursor-pointer hover:scale-110 transition-transform duration-300 drop-shadow-lg hover:drop-shadow-2xl rounded-lg p-1 hover:bg-blue-600 dark:hover:bg-blue-800"
        src={assets.Logo}
        alt="Alumni Connect"
        data-aos="zoom-in"
        data-aos-duration="800"
        onClick={() => navigate('/')}
      />

      {/* Desktop Navbar */}
      <ul
        className={`relative  items-center gap-10 font-medium text-white dark:text-blue-100 hidden xl:flex`}
        data-aos="fade-down"
        data-aos-duration="800"
      >
        {['/', '/about', '/features', '/contact'].map((path, index) => (
          <li key={index} className="relative">
            <NavLink
              to={path}
              className={({ isActive }) =>
                `py-1 font-semibold transition-colors ${
                  isActive ? 'text-yellow-300 dark:text-yellow-200' : 'text-white hover:text-yellow-300 dark:hover:text-yellow-200'
                }`
              }
            >
              {path === '/' ? 'HOME' : path.toUpperCase().slice(1)}
            </NavLink>
            {/* Line under active link */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 mt-1 h-[3px] bg-yellow-300 dark:bg-yellow-200 rounded-full transition-all duration-500 ${
                location.pathname === path ? 'w-full' : 'w-0'
              }`}
            ></div>
          </li>
        ))}
      </ul>

      {/* Search Bar & Icons */}
      <div className="hidden md:flex items-center gap-4">
        <GlobalSearch />
        <NotificationBell />
        <DarkModeToggle />
        {isAuthed && (
          <button
            onClick={() => handleLogout(navigate)}
            className="hidden xl:flex items-center gap-2 bg-red-500/90 hover:bg-red-500 text-white px-4 py-2 rounded-full text-sm transition"
          >
            <LogOut size={16} /> Logout
          </button>
        )}
      </div>

      {/* Buttons (Create Account and Login) */}
      {showAuthCtas && (
        <div
          className="flex items-start gap-4 md:max-lg:gap-2"
          data-aos="zoom-in"
          data-aos-duration="800"
        >
          <button
            onClick={() => navigate('/roleselection')}
            className="bg-primary hover:bg-orange-600 font-outfit text-white px-10 py-3 rounded-full font-light transition hidden xl:block md:max-lg:px-6 md:max-lg:py-2"
          >
            Create Account
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-secondary hover:opacity-90 font-outfit text-white px-10 py-3 rounded-full font-light hidden xl:block md:max-lg:px-6 md:max-lg:py-2 transition"
          >
            Login
          </button>
        </div>
      )}

      {/* Mobile Dropdown */}
      <div className="xl:hidden flex items-center gap-3">
        <div className="hidden sm:block">
          <NotificationBell />
        </div>
        <div className="mr-2" onClick={() => setDropDown(!dropDown)}>
          {dropDown ? <X className="text-white" /> : <Menu className="text-white" />}
        </div>

        {/* Dropdown Menu */}
        {dropDown && (
          <div
            className="absolute w-full top-0 left-0 flex flex-col justify-center items-center bg-blue-700 dark:bg-blue-900 gap-4 py-6 backdrop-blur-lg bg-opacity-95 transition-all duration-300 ease-in-out z-40"
          >
            <ul className="flex flex-col items-center gap-4 font-medium text-white dark:text-blue-100 text-center">
              {['/', '/about', '/features', '/contact'].map((path, index) => (
                <li key={index}>
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `py-1 font-semibold transition-colors ${
                        isActive ? 'text-yellow-300 dark:text-yellow-200' : 'text-white hover:text-yellow-300 dark:hover:text-yellow-200'
                      }`
                    }
                    onClick={() => setDropDown(false)} // Close dropdown on click
                  >
                    {path === '/' ? 'HOME' : path.toUpperCase().slice(1)}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Create Account and Login buttons in mobile view */}
            {showAuthCtas && (
              <div className="flex flex-col items-start gap-4">
                <button
                  onClick={() => navigate('/roleselection')}
                  className="bg-primary font-outfit text-white px-10 py-3 rounded-full font-light hover:bg-orange-600 transition w-full"
                >
                  Create Account
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-secondary font-outfit text-white px-10 py-3 rounded-full font-light w-full"
                >
                  Login
                </button>
              </div>
            )}
            {isAuthed && (
              <button
                onClick={() => handleLogout(navigate)}
                className="mt-2 flex items-center gap-2 bg-red-500 text-white px-10 py-3 rounded-full font-light w-full justify-center"
              >
                <LogOut size={16} /> Logout
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
