import { Bell, Search, UploadCloud, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-transparent">
      <div className="flex-1"></div>

      <div className="flex items-center space-x-3">
        {/* Search */}
        <div className="relative">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
            <Search className="text-slate-400" size={10} />
          </div>
          <input
            type="text"
            placeholder="Search analyses..."
            className="pl-9 pr-4 py-2 rounded-lg text-xs border border-slate-200 outline-none w-60 font-medium bg-white text-slate-700 placeholder:text-slate-400 shadow-sm focus:ring-1 focus:ring-slate-400 transition-all duration-150"
          />
        </div>

        {/* Dark/Light Toggle */}
        <button
          onClick={toggleTheme}
          className="h-8 w-8 flex items-center justify-center rounded-full bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm transition-all duration-150 relative"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Notification */}
        <button className="h-8 w-8 flex items-center justify-center rounded-full bg-white text-slate-500 hover:text-slate-800 border border-slate-200 hover:bg-slate-50 shadow-sm transition-all duration-150 relative">
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-slate-900 rounded-full border border-white"></span>
        </button>

        {/* Upload Button */}
        <button className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white pl-2.5 pr-4 py-1.5 rounded-lg transition-all duration-150 shadow-sm text-xs font-bold">
          <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <UploadCloud size={10} className="text-white" />
          </div>
          <span className="font-semibold">Post Resume</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
