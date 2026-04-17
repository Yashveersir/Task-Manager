  Zap,
} from 'lucide-react';
import TeamSwitcher from '../team/TeamSwitcher';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/board', icon: KanbanSquare, label: 'Task Board' },
  { to: '/team', icon: Users, label: 'Team' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-dark-900/95 backdrop-blur-xl
        border-r border-dark-700/50
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-dark-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">TaskFlow</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Team Switcher */}
      <div className="pt-4">
        <TeamSwitcher />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20 shadow-lg shadow-accent-blue/5'
                  : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-dark-700/50">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
            <span className="text-xs font-semibold text-accent-emerald">PRO TIP</span>
          </div>
          <p className="text-xs text-dark-300 leading-relaxed">
            Drag tasks between columns to update their status in real-time.
          </p>
        </div>
      </div>
    </aside>
  );
}
