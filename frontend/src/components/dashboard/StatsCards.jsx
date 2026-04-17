import {
  ListTodo,
  Timer,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: BarChart3,
      gradient: 'from-accent-blue to-indigo-600',
      glow: 'shadow-accent-blue/10',
    },
    {
      label: 'To Do',
      value: stats.todo,
      icon: ListTodo,
      gradient: 'from-dark-500 to-dark-600',
      glow: 'shadow-dark-500/10',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Timer,
      gradient: 'from-accent-amber to-orange-500',
      glow: 'shadow-accent-amber/10',
    },
    {
      label: 'Completed',
      value: stats.done,
      icon: CheckCircle2,
      gradient: 'from-accent-emerald to-teal-500',
      glow: 'shadow-accent-emerald/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, gradient, glow }) => (
        <div
          key={label}
          className={`glass-card p-5 hover:shadow-xl ${glow} transition-all duration-300`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-dark-50">{value}</p>
          <p className="text-sm text-dark-400 mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}
