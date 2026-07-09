import { Home, FileText, BarChart3, Calendar, HelpCircle, Settings, LogOut, Zap } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: FileText, label: 'History', path: '/history' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
  ];

  return (
    <aside className="w-20 flex flex-col items-center justify-between h-full py-6 bg-white border-r border-slate-100 shrink-0 z-20">
      
      {/* Brand Logo Container */}
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 bg-slate-900 rounded-full flex items-center justify-center shadow-sm">
          <Zap size={16} className="text-white" />
        </div>
      </div>

      {/* Navigation Stack */}
      <nav className="flex flex-col items-center gap-4 flex-1 justify-center w-full">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={item.label}
            className={({ isActive }) =>
              `h-10 w-10 rounded-full flex items-center justify-center transition-all duration-150 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
              }`
            }
          >
            <item.icon size={18} strokeWidth={2} />
          </NavLink>
        ))}

        <div className="w-8 h-px bg-slate-100 my-2" />

        <NavLink
          to="/help"
          title="Help & Support"
          className={({ isActive }) =>
            `h-10 w-10 rounded-full flex items-center justify-center transition-all duration-150 ${
              isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
            }`
          }
        >
          <HelpCircle size={18} />
        </NavLink>

        <NavLink
          to="/settings"
          title="Settings"
          className={({ isActive }) =>
            `h-10 w-10 rounded-full flex items-center justify-center transition-all duration-150 ${
              isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
            }`
          }
        >
          <Settings size={18} />
        </NavLink>
      </nav>

      {/* Footer Profile Stack */}
      <div className="flex flex-col items-center gap-4">
        {/* User initials circle */}
        <div
          title={`${user?.name || 'User'} (${user?.tier || 'Free'} Member)`}
          className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs border border-slate-200 cursor-help"
        >
          {initial}
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          title="Logout"
          className="h-10 w-10 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150 cursor-pointer"
        >
          <LogOut size={16} />
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
