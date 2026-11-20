import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Zap, Sun, Moon, LogOut, UploadCloud, Bell, Menu, X, Sparkles, User, FileText, BarChart3, Calendar, Settings as SettingsIcon, HelpCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  const navLinks = [
    { label: 'Dashboard', path: '/' },
    { label: 'History', path: '/history' },
    { label: 'Analytics', path: '/analytics' },
    { label: 'Schedule', path: '/schedule' },
    { label: 'Help', path: '/help' },
    { label: 'Settings', path: '/settings' },
  ];

  const handlePostResume = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const fileInput = document.getElementById('hero-resume-file-input');
      if (fileInput) fileInput.click();
    }
  };

  return (
    <header className="sticky top-4 z-40 w-full px-4 sm:px-6 lg:px-8 mb-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 bg-white/80 dark:bg-[#141c15]/80 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-full px-4 sm:px-6 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300">
        
        {/* Left: Brand Capsule */}
        <NavLink to="/" className="flex items-center gap-2 group cursor-pointer shrink-0">
          <div className="h-8 w-8 rounded-full bg-[#141c15] dark:bg-white text-white dark:text-[#141c15] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
            <Zap size={14} className="fill-current" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-[#141c15] dark:text-white flex items-center gap-1 font-geometric">
            ResumeIQ <span className="text-[10px] font-black text-[#c27838] dark:text-[#d68d4d] tracking-widest uppercase">PRO</span>
          </span>
        </NavLink>

        {/* Center: Desktop Capsule Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-full p-1 shadow-inner">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#141c15] text-white dark:bg-white dark:text-[#141c15] shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Actions Cluster */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Post Resume CTA Button with Nested Circular Badge */}
          <button
            onClick={handlePostResume}
            className="hidden sm:inline-flex items-center gap-2 bg-[#141c15] hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#141c15] pl-3.5 pr-1.5 py-1.5 rounded-full text-xs font-black shadow-sm transition-all duration-200 tactile-button cursor-pointer"
          >
            <span>Analyze Resume</span>
            <div className="h-5 w-5 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center shrink-0">
              <UploadCloud size={11} className="text-white dark:text-[#141c15]" />
            </div>
          </button>

          {/* Theme Toggle Capsule */}
          <button
            onClick={toggleTheme}
            className="h-8 w-8 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* User Profile Pill */}
          <div
            title={`${user?.name || 'User'} (${user?.tier || 'Free'} Member)`}
            className="h-8 w-8 rounded-full bg-[#e6efe5] dark:bg-white/10 border border-[#d3e3d1] dark:border-white/10 text-[#141c15] dark:text-white font-black text-xs flex items-center justify-center shadow-sm cursor-help"
          >
            {initial}
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            title="Logout"
            className="h-8 w-8 rounded-full border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <LogOut size={13} />
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden h-8 w-8 rounded-full border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 flex items-center justify-center text-slate-700 dark:text-slate-200"
          >
            {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-3 bg-white/95 dark:bg-[#141c15]/95 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-3xl shadow-xl flex flex-col gap-1.5 transition-all">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#141c15] text-white dark:bg-white dark:text-[#141c15]'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </NavLink>
            );
          })}
          <button
            onClick={() => { setMobileMenuOpen(false); handlePostResume(); }}
            className="mt-2 w-full py-2.5 rounded-2xl bg-[#141c15] text-white dark:bg-white dark:text-[#141c15] text-xs font-bold flex items-center justify-center gap-2"
          >
            <UploadCloud size={13} />
            <span>Upload Resume</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
