// Format date to readable string
export function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Format relative time
export function timeAgo(date) {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(date);
}

// Status display config
export const statusConfig = {
  todo: { label: 'To Do', color: 'text-dark-300', bg: 'bg-dark-700' },
  'in-progress': { label: 'In Progress', color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
  done: { label: 'Done', color: 'text-accent-emerald', bg: 'bg-accent-emerald/10' },
};

// Priority display config
export const priorityConfig = {
  low: { label: 'Low', color: 'text-dark-300' },
  medium: { label: 'Medium', color: 'text-accent-amber' },
  high: { label: 'High', color: 'text-accent-rose' },
};
