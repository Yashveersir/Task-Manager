import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useSocket } from '../context/SocketContext';
import BoardColumn from '../components/tasks/BoardColumn';
import TaskModal from '../components/tasks/TaskModal';
import Button from '../components/ui/Button';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { socket } = useSocket();

  const teamId = user?.activeTeam?._id;

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.data.tasks);
    } catch (err) {
      toast.error('Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    if (teamId) {
      fetchTasks();
      fetchUsers();
    }
  }, [teamId]);

  // Real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on('task:created', (task) => {
      setTasks((prev) => [task, ...prev]);
    });

    socket.on('task:updated', (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    });

    socket.on('task:status-changed', (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    });

    socket.on('task:deleted', ({ taskId }) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    });

    return () => {
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:status-changed');
      socket.off('task:deleted');
    };
  }, [socket]);

  const handleStatusChange = async (taskId, newStatus) => {
    // Optimistically update the UI so the select works seamlessly
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
    } catch (err) {
      toast.error('Error updating task status');
      fetchTasks(); // Revert on error
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await api.post('/tasks', taskData);
      toast.success('Task created!');
      setModalOpen(false);
    } catch (err) {
      toast.error('Error creating task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await api.put(`/tasks/${editingTask._id}`, taskData);
      toast.success('Task updated!');
      setEditingTask(null);
      setModalOpen(false);
    } catch (err) {
      toast.error('Error updating task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted!');
    } catch (err) {
      toast.error('Error deleting task');
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: 'text-dark-300', accent: 'bg-dark-500' },
    { id: 'in-progress', title: 'In Progress', color: 'text-accent-blue', accent: 'bg-accent-blue' },
    { id: 'done', title: 'Done', color: 'text-accent-emerald', accent: 'bg-accent-emerald' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-dark-50">Task Board</h1>
          <p className="text-dark-400 mt-1">Drag tasks between columns to update status</p>
        </div>
        <Button onClick={openCreateModal} id="create-task-btn">
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {columns.map((col) => (
          <BoardColumn
            key={col.id}
            column={col}
            tasks={tasks.filter((t) => t.status === col.id)}
            onStatusChange={handleStatusChange}
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        users={users}
      />
    </div>
  );
}
