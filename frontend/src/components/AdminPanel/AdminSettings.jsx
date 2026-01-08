import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { Settings, Bell, Lock, Database, LogOut, AlertTriangle, CheckCircle } from 'lucide-react';
import { assets } from '../../assets/assets';

function AdminSettings() {
  const [settings, setSettings] = useState({
    appName: 'Alumni Connect',
    maintenanceMode: false,
    emailNotifications: true,
    autoVerifyAlumni: false,
    maxUploadSize: 10, // MB
  });

  const [logs, setLogs] = useState([
    { id: 1, action: 'Alumni Verification', by: 'Admin', time: '2 hours ago', status: 'success' },
    { id: 2, action: 'Student Registration', by: 'System', time: '1 day ago', status: 'success' },
    { id: 3, action: 'Data Export', by: 'Admin', time: '3 days ago', status: 'success' },
  ]);

  const [savedMessage, setSavedMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const storedPhoto = localStorage.getItem('profilePhoto');
  const cleanedPhoto = storedPhoto?.trim();
  const profilePhoto = cleanedPhoto && cleanedPhoto !== 'undefined' && cleanedPhoto !== 'null'
    ? cleanedPhoto
    : assets.Profile;
  const loggedInUser = localStorage.getItem('loggedInUser');

  // Fetch maintenance status on component mount
  useEffect(() => {
    fetchMaintenanceStatus();
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      const base = API_BASE_URL;
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`${base}/maintenance/status`, { headers });
      if (response.data) {
        setSettings((prev) => ({
          ...prev,
          maintenanceMode: response.data.isActive || false
        }));
      }
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      const base = API_BASE_URL;
      const token = localStorage.getItem('token');
      
      if (!token) {
        setSavedMessage('Error: No authentication token found. Please log in again.');
        setTimeout(() => setSavedMessage(''), 5000);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Save maintenance mode status to backend
      const response = await axios.put(
        `${base}/maintenance/update`,
        {
          isActive: settings.maintenanceMode,
          message: 'System is under maintenance. Please try again later.',
          estimatedTime: 'Unknown'
        },
        { headers }
      );

      console.log('Maintenance status updated:', response.data);
      setSavedMessage('Settings saved successfully!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Error saving settings!';
      setSavedMessage(`Error: ${errorMsg}`);
      setTimeout(() => setSavedMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Settings className="w-8 h-8 text-cyan-400" />
        <h1 className="text-3xl font-bold text-white">Admin Settings</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-700">
        {['general', 'security', 'notifications', 'logs'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-semibold capitalize border-b-2 transition ${
              activeTab === tab
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Saved Message */}
      {savedMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-300">
          <CheckCircle className="w-5 h-5" />
          {savedMessage}
        </div>
      )}

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">General Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Application Name</label>
                <input
                  type="text"
                  value={settings.appName}
                  onChange={(e) => handleSettingChange('appName', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Max Upload Size (MB)</label>
                <input
                  type="number"
                  value={settings.maxUploadSize}
                  onChange={(e) => handleSettingChange('maxUploadSize', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div>
                  <p className="font-semibold text-white">Maintenance Mode</p>
                  <p className="text-xs text-slate-400">Temporarily disable user access</p>
                </div>
                <button
                  onClick={() => handleSettingChange('maintenanceMode', !settings.maintenanceMode)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    settings.maintenanceMode
                      ? 'bg-red-600/20 text-red-300 border border-red-600/50'
                      : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  }`}
                >
                  {settings.maintenanceMode ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div>
                  <p className="font-semibold text-white">Auto-Verify Alumni</p>
                  <p className="text-xs text-slate-400">Automatically verify alumni registrations</p>
                </div>
                <button
                  onClick={() => handleSettingChange('autoVerifyAlumni', !settings.autoVerifyAlumni)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    settings.autoVerifyAlumni
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-600/50'
                      : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  }`}
                >
                  {settings.autoVerifyAlumni ? 'ON' : 'OFF'}
                </button>
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg transition"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Security Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <p className="font-semibold text-white">Admin Account</p>
                <div className="flex items-center gap-3 mt-3">
                  <img
                    src={profilePhoto || assets.Profile}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      if (e.target.src !== assets.Profile) {
                        e.target.src = assets.Profile;
                      }
                    }}
                  />
                  <div>
                    <p className="text-slate-200">{loggedInUser}</p>
                    <p className="text-xs text-slate-400">Active</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <p className="font-semibold text-white mb-3">Change Password</p>
                <input
                  type="password"
                  placeholder="Current password"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 mb-2 focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="password"
                  placeholder="New password"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 mb-2 focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 mb-3 focus:outline-none focus:border-cyan-500"
                />
                <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition">
                  Update Password
                </button>
              </div>

              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="font-semibold text-red-300 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Danger Zone
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-600/50 font-semibold rounded-lg transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Notification Settings</h2>
            </div>

            <div className="space-y-4">
              {[
                { id: 1, label: 'New Alumni Registration', desc: 'Get notified when alumni register' },
                { id: 2, label: 'Student Signups', desc: 'Get notified when students sign up' },
                { id: 3, label: 'Event Updates', desc: 'Get notified for new events posted' },
                { id: 4, label: 'Job Postings', desc: 'Get notified for new job openings' },
                { id: 5, label: 'Mentorship Offers', desc: 'Get notified for new mentorships' },
              ].map((notif) => (
                <div key={notif.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div>
                    <p className="font-semibold text-white">{notif.label}</p>
                    <p className="text-xs text-slate-400">{notif.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={settings.emailNotifications}
                    className="w-5 h-5 rounded accent-cyan-500 cursor-pointer"
                  />
                </div>
              ))}

              <button
                onClick={handleSaveSettings}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg transition"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logs & Activity */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Activity Logs</h2>
            </div>

            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div className="flex-1">
                      <p className="text-white font-semibold">{log.action}</p>
                      <p className="text-xs text-slate-400">By {log.by}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">{log.time}</p>
                    <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 mt-1">
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSettings;
