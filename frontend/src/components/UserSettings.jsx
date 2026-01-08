import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Settings, Bell, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { applyTheme } from '../utils/theme';
import api from '../utils/api';

const defaultPrefs = (role) => ({
  theme: 'system',
  emailNotifications: true,
  pushNotifications: role === 'student',
  profileVisibility: role === 'alumni' ? 'public' : 'students-only',
  showContactInfo: role === 'alumni',
  dataSharing: false,
});

const sectionDesc = {
  general: 'App basics and defaults like theme and visibility.',
  notifications: 'Choose how you want to be notified.',
  privacy: 'Control who can see your profile and data.',
  // appearance removed
};

function Row({ label, hint, children }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 bg-white dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">{label}</p>
        {hint && <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{hint}</p>}
      </div>
      <div className="flex-shrink-0 w-full sm:w-auto">{children}</div>
    </div>
  );
}

Row.propTypes = {
  label: PropTypes.string.isRequired,
  hint: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default function UserSettings({ role = 'student', userName, onSave, onEditProfile }) {
  const storageKey = `prefs:${role}`;
  const [activeTab, setActiveTab] = useState('general');
  const [savedMessage, setSavedMessage] = useState('');
  const [prefs, setPrefs] = useState(defaultPrefs(role));
  const [uploading, setUploading] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setPrefs({ ...defaultPrefs(role), ...parsed });
      }
    } catch { /* ignore */ }
  }, [storageKey, role]);

  const savePrefs = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(prefs));
      // Apply theme immediately
      applyTheme(prefs.theme);
      setSavedMessage('Settings saved successfully');
      setTimeout(() => setSavedMessage(''), 2500);
      onSave?.(prefs);
    } catch {
      setSavedMessage('Error saving settings');
      setTimeout(() => setSavedMessage(''), 3500);
    }
  };

  const setPref = (key, val) => setPrefs((p) => ({ ...p, [key]: val }));

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setSavedMessage('File size must be less than 2MB');
      setTimeout(() => setSavedMessage(''), 3500);
      return;
    }

    setUploading(true);
    try {
      // Step 1: Upload to Cloudinary
      const form = new FormData();
      form.append('profilePhoto', file);
      const uploadPath = role === 'alumni' ? '/api/alumni/upload/alumni' : '/api/student/upload/student';
      console.log('Uploading to:', uploadPath);

      const res = await api.post(uploadPath, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Upload response:', res.data);

      const url = (res.data && res.data.data && (res.data.data.secure_url || res.data.data.url)) || null;
      if (!url) throw new Error('Upload failed - no URL returned');

      setNewPhotoUrl(url);

      // Step 2: Update user/alumni profile with new photo URL
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User ID not found in localStorage');
      console.log('Updating profile for userId:', userId, 'role:', role);

      if (role === 'alumni') {
        await api.put(`/api/alumni-profile/${userId}`, { profilePhoto: url });
      } else {
        await api.put(`/api/user/${userId}`, { profilePhoto: url });
      }

      // Step 3: Update localStorage and trigger UI refresh
      localStorage.setItem('profilePhoto', url);
      setSavedMessage('Profile photo updated successfully');
      setTimeout(() => {
        setSavedMessage('');
        // Reload page to show new photo everywhere
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error('Photo update error:', err);
      setSavedMessage(err.response?.data?.error || err.message || 'Failed to update photo');
      setTimeout(() => setSavedMessage(''), 3500);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4 flex-1">
          <Settings className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400 flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{userName || (role === 'alumni' ? 'Alumni' : 'Student')} · {sectionDesc[activeTab]}</p>
          </div>
        </div>
        <button
          onClick={() => onEditProfile?.()}
          className="w-full sm:w-auto px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg border border-blue-500/60 transition"
        >
          Edit Profile
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 sm:gap-2 mb-4 border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
        {[
          { id: 'general', icon: Settings, label: 'General' },
          { id: 'notifications', icon: Bell, label: 'Notifications' },
          { id: 'privacy', icon: Shield, label: 'Privacy' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === t.id
                ? 'border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-400'
                : 'border-transparent text-gray-600 hover:text-gray-800 dark:text-slate-400 hover:dark:text-slate-200'
            }`}
          >
            <t.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Saved Message */}
      {savedMessage && (
        <div className="p-3 bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {savedMessage}
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'general' && (
          <div className="space-y-4">
            <Row label="Default Theme" hint="Choose light, dark, or follow your system preference.">
              <select
                value={prefs.theme}
                onChange={(e) => { setPref('theme', e.target.value); applyTheme(e.target.value); }}
                className="w-full sm:w-auto px-3 py-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </Row>

            <Row label="Profile Visibility" hint="Control who can see your profile details.">
              <select
                value={prefs.profileVisibility}
                onChange={(e) => setPref('profileVisibility', e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600"
              >
                <option value="public">Public</option>
                <option value="students-only">Students Only</option>
                <option value="private">Private</option>
              </select>
            </Row>

            {/* Moved from Appearance: Profile photo update */}
            <Row label="Profile Photo" hint="Upload a new avatar image.">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full">
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="text-xs text-gray-700 dark:text-slate-300 w-full sm:w-auto" />
                {uploading && <span className="text-xs text-gray-600 dark:text-slate-400">Uploading...</span>}
                {newPhotoUrl && (
                  <img src={newPhotoUrl} alt="New avatar" className="w-8 h-8 rounded-full border border-gray-300 dark:border-slate-600" />
                )}
              </div>
            </Row>

            {role === 'alumni' && (
              <Row label="Show Contact Info" hint="Display email/links to students and followers.">
                <button
                  onClick={() => setPref('showContactInfo', !prefs.showContactInfo)}
                  className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    prefs.showContactInfo
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-600/20 dark:text-emerald-300 dark:border-emerald-600/50'
                      : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:border-slate-600'
                  }`}
                >
                  {prefs.showContactInfo ? 'ON' : 'OFF'}
                </button>
              </Row>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <Row label="Email Notifications" hint="Receive updates for messages and mentions.">
              <button
                onClick={() => setPref('emailNotifications', !prefs.emailNotifications)}
                className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  prefs.emailNotifications
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-600/20 dark:text-emerald-300 dark:border-emerald-600/50'
                    : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:border-slate-600'
                }`}
              >
                {prefs.emailNotifications ? 'ON' : 'OFF'}
              </button>
            </Row>

            <Row label="Push Notifications" hint="Enable in-browser notifications for new messages.">
              <button
                onClick={() => setPref('pushNotifications', !prefs.pushNotifications)}
                className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  prefs.pushNotifications
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-600/20 dark:text-emerald-300 dark:border-emerald-600/50'
                    : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:border-slate-600'
                }`}
              >
                {prefs.pushNotifications ? 'ON' : 'OFF'}
              </button>
            </Row>

            {!prefs.pushNotifications && (
              <div className="p-3 bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-600/10 dark:text-amber-200 dark:border-amber-600/30 rounded-lg text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                You may miss real-time alerts when push notifications are OFF.
              </div>
            )}
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <Row label="Data Sharing" hint="Allow anonymized usage analytics to improve the app.">
              <button
                onClick={() => setPref('dataSharing', !prefs.dataSharing)}
                className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  prefs.dataSharing
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-600/20 dark:text-emerald-300 dark:border-emerald-600/50'
                    : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:border-slate-600'
                }`}
              >
                {prefs.dataSharing ? 'ON' : 'OFF'}
              </button>
            </Row>

            <Row label="Profile Visibility" hint="Set who can view your full profile.">
              <select
                value={prefs.profileVisibility}
                onChange={(e) => setPref('profileVisibility', e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600"
              >
                <option value="public">Public</option>
                <option value="students-only">Students Only</option>
                <option value="private">Private</option>
              </select>
            </Row>
          </div>
        )}

        {/* Appearance section removed */}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={savePrefs}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg transition"
        >
          Save Settings
        </button>
        <button
          onClick={() => setPrefs(defaultPrefs(role))}
          className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 font-semibold rounded-lg transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

UserSettings.propTypes = {
  role: PropTypes.string,
  userName: PropTypes.string,
  onSave: PropTypes.func,
  onEditProfile: PropTypes.func,
};
