import { Menu, Bell, LogOut, Wifi } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useNavigate }  from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { onlineUsers } = useSocket();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-16 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700/50 flex items-center justify-between px-4 md:px-6 lg:px-8">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white transition-colors"
          id="menu-toggle"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:flex items-center gap-2 text-sm text-dark-400">
          <Wifi className="w-4 h-4 text-accent-emerald" />
          <span>{onlineUsers} online</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className="relative p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white transition-colors"
          id="notification-bell"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-rose rounded-full animate-pulse-soft" />
        </button>

        {/* User info */}
        <div className="flex items-center gap-3 pl-3 border-l border-dark-700/50">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-dark-100">{user?.name}</p>
            <p className="text-xs text-dark-400">{user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
            <span className="text-xs font-bold text-white">{initials}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-accent-rose transition-colors"
            id="logout-button"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
