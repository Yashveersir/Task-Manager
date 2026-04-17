import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = {
  todo: '#64748b',
  inProgress: '#6366f1',
  done: '#10b981',
  high: '#f43f5e',
  medium: '#f59e0b',
  low: '#64748b',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-800 border border-dark-600/50 rounded-xl px-4 py-2 shadow-xl">
        <p className="text-sm font-medium text-dark-100">{payload[0].name}</p>
        <p className="text-lg font-bold text-accent-blue">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function TaskChart({ stats }) {
  if (!stats) return null;

  const statusData = [
    { name: 'To Do', value: stats.todo, fill: COLORS.todo },
    { name: 'In Progress', value: stats.inProgress, fill: COLORS.inProgress },
    { name: 'Done', value: stats.done, fill: COLORS.done },
  ];

  const priorityData = [
    { name: 'High', value: stats.highPriority, fill: COLORS.high },
    { name: 'Medium', value: stats.mediumPriority, fill: COLORS.medium },
    { name: 'Low', value: stats.lowPriority, fill: COLORS.low },
  ];

  const totalTasks = stats.total || 1; // avoid division by zero

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Status Bar Chart */}
      <div>
        <p className="text-xs font-medium text-dark-400 uppercase tracking-wider mb-4">By Status</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={statusData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {statusData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Priority Pie Chart */}
      <div>
        <p className="text-xs font-medium text-dark-400 uppercase tracking-wider mb-4">By Priority</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={priorityData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {priorityData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-2">
          {priorityData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="text-xs text-dark-400">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
