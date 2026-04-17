export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-dark-700 text-dark-200 border-dark-600',
    // Status
    todo: 'bg-dark-700/80 text-dark-200 border-dark-600/50',
    'in-progress': 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
    done: 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20',
    // Priority
    low: 'bg-dark-700/80 text-dark-300 border-dark-600/50',
    medium: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
    high: 'bg-accent-rose/10 text-accent-rose border-accent-rose/20',
    // Roles
    admin: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
    member: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium
        border transition-colors
        ${variants[variant] || variants.default}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
