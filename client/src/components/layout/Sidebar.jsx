import { Home, FileText, PieChart, Calendar, HelpCircle, Settings, MoreHorizontal, Trophy, Star, Zap } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAnalysis } from '../../context/AnalysisContext';
import { useEffect, useState } from 'react';

const Sidebar = () => {
  const { darkMode } = useTheme();
  const { points, fetchPoints } = useAnalysis();
  const [tier, setTier] = useState('Bronze');

  useEffect(() => {
    fetchPoints().then(data => {
      if (data?.tier) setTier(data.tier);
    });
  }, [fetchPoints]);

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: FileText, label: 'History', path: '/history' },
    { icon: PieChart, label: 'Analytics', path: '/analytics' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
  ];

  const tierColors = {
    Bronze: { bg: 'from-amber-700 to-amber-900', text: 'text-amber-300', icon: '🥉' },
    Silver: { bg: 'from-slate-400 to-slate-600', text: 'text-slate-200', icon: '🥈' },
    Gold: { bg: 'from-yellow-400 to-amber-500', text: 'text-yellow-100', icon: '🥇' },
    Diamond: { bg: 'from-cyan-400 to-blue-500', text: 'text-cyan-100', icon: '💎' },
  };

  const currentTier = tierColors[tier] || tierColors.Bronze;

  return (
    <aside className={`w-64 flex flex-col h-full rounded-tr-3xl rounded-br-3xl z-10 m-2 mr-0 transition-colors duration-300
      ${darkMode
        ? 'bg-gray-900 border-r border-gray-800 shadow-[4px_0_24px_rgba(0,0,0,0.3)]'
        : 'bg-white border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]'
      }`}
    >
      {/* Brand */}
      <div className="pt-8 pb-6 px-8 flex items-center gap-3">
        <div className="h-9 w-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <h1 className={`text-lg font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>ResumeAI</h1>
          <p className={`text-[9px] font-bold uppercase tracking-widest ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`}>Pro Edition</p>
        </div>
      </div>

      <div className="px-8 mb-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>Main Menu</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                isActive
                  ? darkMode
                    ? 'bg-indigo-500/15 text-indigo-400 shadow-sm shadow-indigo-500/10'
                    : 'bg-indigo-50 text-indigo-600 shadow-sm'
                  : darkMode
                    ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-sm">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        <div className="mt-8 px-4 mb-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>Other</span>
        </div>

        <NavLink to="/help" className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
          <HelpCircle size={20} />
          <span className="text-sm">Help & Support</span>
        </NavLink>
        <NavLink to="/settings" className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
          <Settings size={20} />
          <span className="text-sm">Settings</span>
        </NavLink>
      </nav>

      {/* Gamification Points Card */}
      <div className="px-6 pb-3">
        <div className={`bg-gradient-to-br ${currentTier.bg} p-4 rounded-2xl text-white shadow-lg relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full transform translate-x-6 -translate-y-6"></div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={16} className="text-yellow-300" />
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Career Points</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black">{points}</span>
            <span className="text-xs opacity-70">pts</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <Star size={12} className={currentTier.text} />
            <span className={`text-xs font-bold ${currentTier.text}`}>{currentTier.icon} {tier} Tier</span>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="px-6 pb-3">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-2xl text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full transform translate-x-8 -translate-y-8"></div>
          <h4 className="font-bold text-sm mb-1 z-10 relative">Mastering Resumes</h4>
          <p className="text-xs text-indigo-100 mb-3 z-10 relative">FAANG-tier strategies for ATS optimization</p>
          <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-2 px-4 rounded-lg text-xs font-bold w-max flex items-center z-10 relative transition-colors border border-white/10">
            Learn More <span className="ml-1">→</span>
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className={`p-4 mx-4 mb-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-200 ${darkMode ? 'border border-gray-700 bg-gray-800/50 hover:bg-gray-800' : 'border border-slate-100 bg-white hover:shadow-md'}`}>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shrink-0 text-white font-bold text-sm">
            S
          </div>
          <div>
            <p className={`text-sm font-bold leading-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>Sachin</p>
            <p className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>Pro Member</p>
          </div>
        </div>
        <MoreHorizontal size={18} className={darkMode ? 'text-gray-500' : 'text-slate-400'} />
      </div>
    </aside>
  );
};

export default Sidebar;
