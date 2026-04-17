import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import StatsCards from '../components/dashboard/StatsCards';
import TaskChart from '../components/dashboard/TaskChart';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { Clock, TrendingUp } from 'lucide-react';
import { timeAgo, priorityConfig, statusConfig } from '../utils/helpers';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { socket } = useSocket();
  
  const teamId = user?.activeTeam?._id;

  const fetchStats = async () => {
    try {
      const res = await api.get('/tasks/stats');
      setStats(res.data.data.stats);
      setRecentTasks(res.data.data.recentTasks);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teamId) {
      fetchStats();
    }
  }, [teamId]);

  // Listen for real-time updates
  useEffect(() => {
    if (!socket) return;

    const refreshStats = () => fetchStats();
    socket.on('task:created', refreshStats);
    socket.on('task:updated', refreshStats);
    socket.on('task:deleted', refreshStats);
    socket.on('task:status-changed', refreshStats);

    return () => {
      socket.off('task:created', refreshStats);
      socket.off('task:updated', refreshStats);
      socket.off('task:deleted', refreshStats);
      socket.off('task:status-changed', refreshStats);
    };
  }, [socket]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-dark-50">Dashboard</h1>
        <p className="text-dark-400 mt-1">Overview of your team's progress</p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3 glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-accent-blue" />
            <h2 className="text-lg font-semibold text-dark-100">Task Distribution</h2>
          </div>
          <TaskChart stats={stats} />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-accent-purple" />
            <h2 className="text-lg font-semibold text-dark-100">Recent Tasks</h2>
          </div>
          <div className="space-y-3">
            {recentTasks.length === 0 ? (
              <p className="text-dark-500 text-sm text-center py-8">No tasks yet. Create your first task!</p>
            ) : (
              recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-colors"
                >
                  {task.assignedTo ? (
                    <Avatar name={task.assignedTo.name} size="sm" />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-dark-700 flex items-center justify-center">
                      <span className="text-xs text-dark-500">?</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-200 truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-dark-500">{timeAgo(task.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={task.priority}>{priorityConfig[task.priority]?.label}</Badge>
                    <Badge variant={task.status}>{statusConfig[task.status]?.label}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
