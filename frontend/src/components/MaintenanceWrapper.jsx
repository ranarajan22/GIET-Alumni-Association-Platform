import { useState, useEffect } from 'react';
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
    checkMaintenanceStatus();
    // Check maintenance status every 30 seconds
    const interval = setInterval(checkMaintenanceStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkMaintenanceStatus = async () => {
    try {
      const base = API_BASE_URL;
      
      // Check if user is admin
      const userRole = localStorage.getItem('userRole');
      setIsAdmin(userRole === 'admin');

      // Public endpoint that doesn't require authentication
      const response = await axios.get(`${base}/maintenance/check`);
      
      if (response.data && response.data.isActive) {
        // Only block non-admin users from non-admin routes
        if (userRole !== 'admin') {
          setIsMaintenanceActive(true);
        }
      }
    } catch (error) {
      console.error('Error checking maintenance status:', error);
      // If there's an error, assume maintenance is not active
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
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-cyan-400 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  // Otherwise, show the children
  return children;
}

export default MaintenanceWrapper;
