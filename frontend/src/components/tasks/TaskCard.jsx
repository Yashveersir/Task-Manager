import { MoreHorizontal, Pencil, Trash2, Calendar, User } from 'lucide-react';
import { useState } from 'react';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { formatDate, priorityConfig } from '../../utils/helpers';

export default function TaskCard({ task, onStatusChange, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task._id);
    e.currentTarget.classList.add('opacity-50', 'rotate-2');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('opacity-50', 'rotate-2');
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="group glass-card p-4 cursor-grab active:cursor-grabbing hover:border-accent-blue/30 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-dark-100 line-clamp-2 flex-1">
          {task.title}
        </h4>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-dark-700 text-dark-400 hover:text-white transition-all"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-8 z-20 w-36 bg-dark-800 border border-dark-600/50 rounded-xl shadow-xl overflow-hidden animate-scale-in">
                <button
                  onClick={() => {
                    onEdit(task);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-dark-200 hover:bg-dark-700 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(task._id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-accent-rose hover:bg-dark-700 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-dark-400 line-clamp-2 mb-3">{task.description}</p>
      )}

      {/* Priority & Status Select */}
      <div className="flex items-center justify-between mb-3">
        <Badge variant={task.priority}>
          {priorityConfig[task.priority]?.label}
        </Badge>
        
        <select
          value={task.status}
          onChange={(e) => onStatusChange && onStatusChange(task._id, e.target.value)}
          className="bg-dark-800/80 border border-dark-600/50 text-xs text-dark-200 rounded-lg px-2 py-1 outline-none focus:border-accent-blue/50 cursor-pointer hover:bg-dark-700/80 transition-colors"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-dark-700/30">
        {/* Assigned user */}
        <div className="flex items-center gap-1.5">
          {task.assignedTo ? (
            <>
              <Avatar name={task.assignedTo.name} size="xs" />
              <span className="text-xs text-dark-400 truncate max-w-[80px]">
                {task.assignedTo.name}
              </span>
            </>
          ) : (
            <span className="text-xs text-dark-600 flex items-center gap-1">
              <User className="w-3 h-3" />
              Unassigned
            </span>
          )}
        </div>

        {/* Due date */}
        {task.dueDate && (
          <span className="text-xs text-dark-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
}
