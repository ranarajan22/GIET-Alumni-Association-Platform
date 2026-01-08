import { useEffect, useState } from 'react';
import { AlertCircle, Clock, Wrench } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function MaintenancePage() {
  const [maintenanceInfo, setMaintenanceInfo] = useState({
    message: 'System is under maintenance.',
    estimatedTime: 'Unknown'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenanceStatus();
    // Refresh maintenance status every 30 seconds
    const interval = setInterval(fetchMaintenanceStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/maintenance/check`);
      if (response.data) {
        setMaintenanceInfo({
          message: response.data.message || 'System is under maintenance.',
          estimatedTime: response.data.estimatedTime || 'Unknown'
        });
      }
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-slate-800 border border-yellow-500/30 rounded-lg p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-lg animate-pulse"></div>
              <div className="relative bg-yellow-500/10 p-4 rounded-full">
                <Wrench className="w-12 h-12 text-yellow-500 animate-bounce" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-white mb-2">
            Maintenance Mode
          </h1>
          
          {/* Status Badge */}
          <div className="flex items-center justify-center gap-2 mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg py-2 px-4">
            <AlertCircle className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-400 text-sm font-medium">System Under Maintenance</span>
          </div>

          {/* Message */}
          <p className="text-center text-slate-300 text-lg mb-6">
            {maintenanceInfo.message}
          </p>

          {/* Estimated Time */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <div>
                <p className="text-slate-400 text-sm">Estimated Time</p>
                <p className="text-cyan-400 font-semibold">
                  {maintenanceInfo.estimatedTime}
                </p>
              </div>
            </div>
          </div>

          {/* Support Message */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
            <p className="text-slate-300 text-sm mb-2">
              We apologize for the inconvenience.
            </p>
            <p className="text-slate-400 text-xs">
              Please check back shortly. We&apos;re working hard to improve your experience!
            </p>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="mt-6 flex justify-center">
              <div className="animate-spin">
                <div className="h-8 w-8 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
              </div>
            </div>
          )}

          {/* Retry Button */}
          <button
            onClick={() => {
              setLoading(true);
              fetchMaintenanceStatus();
            }}
            className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Refresh Status
          </button>
        </div>

        {/* Footer Message */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Alumni Connect is temporarily unavailable
        </p>
      </div>
    </div>
  );
}

export default MaintenancePage;
