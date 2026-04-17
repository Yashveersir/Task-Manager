import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Type, AlignLeft, Calendar } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSubmit, task, users }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignedTo: '',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        assignedTo: task.assignedTo?._id || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignedTo: '',
        dueDate: '',
      });
    }
  }, [task, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        assignedTo: formData.assignedTo || null,
        dueDate: formData.dueDate || null,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <Input
          label="Task Title"
          placeholder="Enter task title..."
          icon={Type}
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          id="task-title-input"
          required
        />

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-dark-200">Description</label>
          <div className="relative">
            <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-dark-400" />
            <textarea
              placeholder="Describe the task..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full bg-dark-800/50 border border-dark-600/50 rounded-xl pl-10 pr-4 py-3 text-sm text-dark-100 placeholder-dark-500 focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/10 transition-all duration-200 resize-none"
              id="task-description-input"
            />
          </div>
        </div>

        {/* Status + Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-dark-200">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full bg-dark-800/50 border border-dark-600/50 rounded-xl px-4 py-3 text-sm text-dark-100 focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/10 transition-all duration-200"
              id="task-status-select"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-dark-200">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="w-full bg-dark-800/50 border border-dark-600/50 rounded-xl px-4 py-3 text-sm text-dark-100 focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/10 transition-all duration-200"
              id="task-priority-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Assign To */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-dark-200">Assign To</label>
          <select
            value={formData.assignedTo}
            onChange={(e) => handleChange('assignedTo', e.target.value)}
            className="w-full bg-dark-800/50 border border-dark-600/50 rounded-xl px-4 py-3 text-sm text-dark-100 focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/10 transition-all duration-200"
            id="task-assign-select"
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <Input
          label="Due Date"
          type="date"
          icon={Calendar}
          value={formData.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          id="task-due-date-input"
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} id="task-submit-btn">
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
