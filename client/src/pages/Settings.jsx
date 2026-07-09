import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Eye, Sun, Moon, CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Settings = () => {
  const { user, checkAuth } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  // Profile fields state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const res = await axios.put(`${API}/auth/me`, { name, email });
      if (res.data.success) {
        setProfileSuccess('Profile updated successfully.');
        await checkAuth();
      }
    } catch (err) {
      setProfileError(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordSuccess('');
    setPasswordError('');

    try {
      const res = await axios.put(`${API}/auth/me/password`, { currentPassword, newPassword });
      if (res.data.success) {
        setPasswordSuccess('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || err.message || 'Failed to change password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const card = 'bg-white rounded-2xl shadow-sm border border-slate-100/50';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pb-16 max-w-2xl">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold mb-0.5 text-slate-800">Account Settings</h1>
        <p className="text-xs font-medium text-slate-400">Manage your profile credentials, theme preferences, and subscription tier</p>
      </div>

      {/* Profile Form Card */}
      <div className={`${card} p-4`}>
        <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-2">
          <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
            <User size={13} className="text-slate-500" />
          </div>
          <h3 className="text-xs font-bold text-slate-800">Profile Details</h3>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-3.5">
          <AnimatePresence>
            {profileSuccess && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-1.5">
                <CheckCircle size={12} />
                <span>{profileSuccess}</span>
              </motion.div>
            )}
            {profileError && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-2.5 rounded-lg bg-red-50 border border-red-100 text-red-500 text-[10px] font-bold flex items-center gap-1.5">
                <AlertTriangle size={12} />
                <span>{profileError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs border border-slate-200 outline-none font-medium bg-white text-slate-700 focus:ring-1 focus:ring-slate-400"
              />
            </div>
            <div>
              <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs border border-slate-200 outline-none font-medium bg-white text-slate-700 focus:ring-1 focus:ring-slate-400"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={profileSaving}
              className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {profileSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Password Change Form Card */}
      <div className={`${card} p-4`}>
        <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-2">
          <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
            <Lock size={13} className="text-slate-500" />
          </div>
          <h3 className="text-xs font-bold text-slate-800">Security & Credentials</h3>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-3.5">
          <AnimatePresence>
            {passwordSuccess && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-1.5">
                <CheckCircle size={12} />
                <span>{passwordSuccess}</span>
              </motion.div>
            )}
            {passwordError && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-2.5 rounded-lg bg-red-50 border border-red-100 text-red-500 text-[10px] font-bold flex items-center gap-1.5">
                <AlertTriangle size={12} />
                <span>{passwordError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg text-xs border border-slate-200 outline-none font-medium bg-white text-slate-700 placeholder:text-slate-300 focus:ring-1 focus:ring-slate-400"
              />
            </div>
            <div>
              <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg text-xs border border-slate-200 outline-none font-medium bg-white text-slate-700 placeholder:text-slate-300 focus:ring-1 focus:ring-slate-400"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={passwordSaving}
              className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {passwordSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Appearance Settings */}
      <div className={`${card} p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
            {darkMode ? <Moon size={14} /> : <Sun size={14} />}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Theme Preference</h4>
            <p className="text-[10px] text-slate-400 font-medium">Currently using {darkMode ? 'Dark Mode' : 'Light Mode'}</p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="px-3.5 py-1.5 rounded-lg text-[10px] font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition-colors cursor-pointer"
        >
          Toggle Theme
        </button>
      </div>

      {/* Billing & Subscription */}
      <div className={`${card} p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
            <CreditCard size={14} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Subscription Status</h4>
            <p className="text-[10px] text-slate-400 font-medium">Active tier: <span className="font-bold text-slate-700 uppercase">{user?.tier || 'Free'}</span></p>
          </div>
        </div>
        <button
          disabled
          className="bg-slate-100 text-slate-400 cursor-not-allowed px-3.5 py-1.5 rounded-lg text-[10px] font-bold border border-slate-200"
          title="Upgrade billing is not yet implemented"
        >
          Upgrade Tier (Mocks Not Yet Implemented)
        </button>
      </div>

    </motion.div>
  );
};

export default Settings;
