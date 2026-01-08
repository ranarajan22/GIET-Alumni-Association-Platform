import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { House, MessageSquareMore, Globe, Users, SquareChevronRight, Settings, LogOut } from "lucide-react";
import {assets} from '../assets/assets';
import { handleSuccess } from "../utils/utils";
import PropTypes from 'prop-types';

const Sidebar = ({ setActiveSection, activeSection, onExpandedChange }) => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("Logged Out Successfully");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const MenuItem = ({ icon: Icon, label, section }) => (
    <div
      className={`relative flex items-center justify-center py-4 px-3 cursor-pointer transition-all group ${
        activeSection === section 
          ? "bg-white bg-opacity-10 border-l-4 border-blue-500" 
          : "hover:bg-white hover:bg-opacity-5"
      }`}
      onClick={() => handleSectionClick(section)}
      onMouseEnter={() => setHoveredItem(section)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <Icon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
      {hoveredItem === section && (
        <div className="absolute left-20 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded whitespace-nowrap pointer-events-none z-50 border border-gray-700">
          {label}
        </div>
      )}
    </div>
  );

  const LogoutButton = () => (
    <div
      className={`relative flex items-center justify-center py-4 px-3 cursor-pointer transition-all group hover:bg-red-500 hover:bg-opacity-10`}
      onClick={handleLogout}
      onMouseEnter={() => setHoveredItem("logout")}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <LogOut className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" />
      {hoveredItem === "logout" && (
        <div className="absolute left-20 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded whitespace-nowrap pointer-events-none z-50 border border-gray-700">
          Logout
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen bg-gray-900 border-r border-gray-800 flex flex-col items-center w-20">
      {/* Logo */}
      <div className="flex justify-center py-4 mb-4">
        <img
          src={assets.Logo}
          alt="Logo"
          className="h-10 w-auto cursor-pointer hover:opacity-80 transition"
        />
      </div>

      <div className="border-b border-gray-800 w-full"></div>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col w-full">
        <MenuItem icon={House} label="Dashboard" section="dashboard" />
        <MenuItem icon={MessageSquareMore} label="Messages" section="messages" />
        <MenuItem icon={Globe} label="Events" section="events" />
        <MenuItem icon={Users} label="Network" section="network" />
        <MenuItem icon={SquareChevronRight} label="Open Source" section="open-source" />
      </nav>

      {/* Divider before Settings */}
      <div className="border-t border-gray-800 w-full"></div>

      {/* Settings and Logout */}
      <div className="flex flex-col w-full pb-4">
        <MenuItem icon={Settings} label="Settings" section="settings" />
        <LogoutButton />
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  setActiveSection: PropTypes.func.isRequired,
  activeSection: PropTypes.string.isRequired,
  onExpandedChange: PropTypes.func,
};

export default Sidebar;
