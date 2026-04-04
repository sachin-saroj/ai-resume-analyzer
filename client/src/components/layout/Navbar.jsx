import { Bell, Search, UploadCloud, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className={`h-20 flex items-center justify-between px-8 transition-colors duration-300 ${darkMode ? 'bg-transparent' : 'bg-transparent'}`}>
      <div className="flex-1"></div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-slate-400'}`} size={16} />
          <input
            type="text"
            placeholder="Search analyses..."
            className={`pl-10 pr-4 py-2.5 rounded-full text-sm border-none outline-none w-64 font-medium transition-colors duration-300
              ${darkMode
                ? 'bg-gray-800 text-gray-200 placeholder:text-gray-500 shadow-[0_2px_10px_rgba(0,0,0,0.2)] focus:ring-2 focus:ring-indigo-500/30'
                : 'bg-white text-slate-600 placeholder:text-slate-400 shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-indigo-100'
              }`}
          />
        </div>

        {/* Dark/Light Toggle */}
        <button
          onClick={toggleTheme}
          className={`h-10 w-10 flex items-center justify-center rounded-full transition-all duration-300 relative overflow-hidden
            ${darkMode
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 shadow-[0_2px_10px_rgba(0,0,0,0.2)]'
              : 'bg-white text-indigo-500 hover:text-indigo-600 shadow-[0_2px_10px_rgba(0,0,0,0.02)]'
            }`}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification */}
        <button className={`h-10 w-10 flex items-center justify-center rounded-full transition-colors relative
          ${darkMode
            ? 'bg-gray-800 text-gray-400 hover:text-indigo-400 shadow-[0_2px_10px_rgba(0,0,0,0.2)]'
            : 'bg-white text-slate-400 hover:text-indigo-600 shadow-[0_2px_10px_rgba(0,0,0,0.02)]'
          }`}
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
        </button>

        {/* Upload Button */}
        <button className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-5 py-2.5 rounded-full transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]">
          <UploadCloud size={18} />
          <span className="text-sm font-semibold">Post Resume</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
