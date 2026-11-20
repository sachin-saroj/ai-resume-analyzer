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

  const card = 'bg-white/95 dark:bg-[#151d16]/95 backdrop-blur-xl rounded-[28px] shadow-sm border border-black/10 dark:border-white/10';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20 max-w-3xl font-geometric">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-[10px] font-black uppercase tracking-wider text-[#c27838] mb-2">
          <span>✦ Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#141c15] dark:text-white tracking-tight">Account & Security</h1>
        <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">Manage profile credentials, theme preference, and career intelligence tier</p>
      </div>

      {/* Profile Form Card */}
      <div className={`${card} p-6`}>
        <div className="flex items-center gap-2.5 mb-5 border-b border-black/5 dark:border-white/5 pb-3">
          <div className="h-8 w-8 rounded-full bg-[#f6f8f5] dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-white shrink-0">
            <User size={14} className="text-[#c27838]" />
          </div>
          <h3 className="text-sm font-black text-[#141c15] dark:text-white">Profile Details</h3>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <AnimatePresence>
            {profileSuccess && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle size={14} />
                <span>{profileSuccess}</span>
              </motion.div>
            )}
            {profileError && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-2xl bg-red-50 border border-red-200 dark:bg-red-950/40 dark:border-red-900/40 text-red-600 dark:text-red-300 text-xs font-bold flex items-center gap-2">
                <AlertTriangle size={14} />
                <span>{profileError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-white/10 bg-[#f6f8f5] dark:bg-white/5 outline-none focus-visible:ring-1 focus-visible:ring-[#c27838] font-medium text-[#141c15] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-white/10 bg-[#f6f8f5] dark:bg-white/5 outline-none focus-visible:ring-1 focus-visible:ring-[#c27838] font-medium text-[#141c15] dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={profileSaving}
              className="bg-[#141c15] hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#141c15] px-6 py-2.5 rounded-full text-xs font-black shadow-md transition-colors cursor-pointer disabled:opacity-50"
            >
              {profileSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Password Change Form Card */}
      <div className={`${card} p-6`}>
        <div className="flex items-center gap-2.5 mb-5 border-b border-black/5 dark:border-white/5 pb-3">
          <div className="h-8 w-8 rounded-full bg-[#f6f8f5] dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-white shrink-0">
            <Lock size={14} className="text-[#c27838]" />
          </div>
          <h3 className="text-sm font-black text-[#141c15] dark:text-white">Security & Credentials</h3>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <AnimatePresence>
            {passwordSuccess && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle size={14} />
                <span>{passwordSuccess}</span>
              </motion.div>
            )}
            {passwordError && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-2xl bg-red-50 border border-red-200 dark:bg-red-950/40 dark:border-red-900/40 text-red-600 dark:text-red-300 text-xs font-bold flex items-center gap-2">
                <AlertTriangle size={14} />
                <span>{passwordError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-white/10 bg-[#f6f8f5] dark:bg-white/5 outline-none focus-visible:ring-1 focus-visible:ring-[#c27838] font-medium text-[#141c15] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-white/10 bg-[#f6f8f5] dark:bg-white/5 outline-none focus-visible:ring-1 focus-visible:ring-[#c27838] font-medium text-[#141c15] dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={passwordSaving}
              className="bg-[#141c15] hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#141c15] px-6 py-2.5 rounded-full text-xs font-black shadow-md transition-colors cursor-pointer disabled:opacity-50"
            >
              {passwordSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Appearance Settings */}
      <div className={`${card} p-6 flex items-center justify-between flex-wrap gap-4`}>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#f6f8f5] dark:bg-white/10 flex items-center justify-center text-[#c27838] shrink-0">
            {darkMode ? <Moon size={16} /> : <Sun size={16} />}
          </div>
          <div>
            <h4 className="text-xs font-black text-[#141c15] dark:text-white">Theme Preference</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Currently using {darkMode ? 'Dark Forest Mode' : 'Organic Light Sage Mode'}</p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="px-5 py-2.5 rounded-full text-xs font-black border border-slate-200 dark:border-white/10 bg-[#f6f8f5] dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 text-[#141c15] dark:text-white shadow-sm transition-colors cursor-pointer"
        >
          Toggle Theme
        </button>
      </div>

      {/* Billing & Subscription */}
      <div className={`${card} p-6 flex items-center justify-between flex-wrap gap-4`}>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#f6f8f5] dark:bg-white/10 flex items-center justify-center text-[#c27838] shrink-0">
            <CreditCard size={16} />
          </div>
          <div>
            <h4 className="text-xs font-black text-[#141c15] dark:text-white">Career Intelligence Tier</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Active plan: <span className="font-black text-[#c27838] uppercase">{user?.tier || 'Platinum Pro'}</span></p>
          </div>
        </div>
        <span className="px-4 py-2 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
          ✦ Unlimited Pro Access
        </span>
      </div>

    </motion.div>
  );
};

export default Settings;
