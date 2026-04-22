import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import MaintenancePage from '../pages/MaintenancePage';
import { useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function MaintenanceWrapper({ children }) {
  const [isMaintenanceActive, setIsMaintenanceActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const maxLoaderTimer = setTimeout(() => setLoading(false), 1200);
    checkMaintenanceStatus();
    // Check maintenance status every 30 seconds
    const interval = setInterval(checkMaintenanceStatus, 30000);
    return () => {
      clearInterval(interval);
      clearTimeout(maxLoaderTimer);
    };
  }, []);

  const checkMaintenanceStatus = async () => {
    try {
      const base = API_BASE_URL;
      
      // Check if user is admin
      const userRole = localStorage.getItem('userRole');
      setIsAdmin(userRole === 'admin');

      // Public endpoint that doesn't require authentication
      const response = await axios.get(`${base}/maintenance/check`, { timeout: 10000 });
      
      if (response.data && response.data.isActive) {
        // Only block non-admin users from non-admin routes
        if (userRole !== 'admin') {
          setIsMaintenanceActive(true);
        }
      } else {
        setIsMaintenanceActive(false);
      }
    } catch (error) {
      const isTimeout = error?.code === 'ECONNABORTED' || /timeout/i.test(error?.message || '');
      if (isTimeout) {
        console.warn('Maintenance check timed out; continuing without maintenance lock.');
      } else {
        console.error('Error checking maintenance status:', error);
      }
      // If there's an error, assume maintenance is not active
      setIsMaintenanceActive(false);
    } finally {
      setLoading(false);
    }
  };

  // Allow admin routes during maintenance (admin must be able to access settings to turn it off)
  const isAdminRoute = location.pathname === '/admin' || location.pathname.startsWith('/admin/');
  
  // If maintenance is active and user is not admin AND not accessing admin route, show maintenance page
  if (isMaintenanceActive && !isAdmin && !isAdminRoute) {
    return <MaintenancePage />;
  }

  // If still loading, show a loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-8 animate-pulse">
          <div className="h-10 w-56 rounded-md bg-slate-800 mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="h-24 rounded-xl bg-slate-800" />
            <div className="h-24 rounded-xl bg-slate-800" />
            <div className="h-24 rounded-xl bg-slate-800" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl bg-slate-800 h-64" />
            <div className="rounded-xl bg-slate-800 h-64" />
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, show the children
  return children;
}

MaintenanceWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MaintenanceWrapper;
