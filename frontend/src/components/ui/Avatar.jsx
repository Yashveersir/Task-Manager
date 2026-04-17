export default function Avatar({ name, size = 'md', className = '' }) {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  const colors = [
    'from-accent-blue to-accent-purple',
    'from-accent-emerald to-cyan-500',
    'from-accent-amber to-orange-500',
    'from-accent-rose to-pink-500',
    'from-violet-500 to-purple-500',
    'from-teal-500 to-emerald-500',
  ];

  // Deterministic color based on name
  const colorIndex = name
    ? name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    : 0;

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  return (
    <div
      className={`
        ${sizes[size]} rounded-xl bg-gradient-to-br ${colors[colorIndex]}
        flex items-center justify-center font-bold text-white
        ring-2 ring-dark-800 ${className}
      `}
      title={name}
    >
      {initials}
    </div>
  );
}
