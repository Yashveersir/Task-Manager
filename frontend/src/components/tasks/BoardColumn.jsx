import TaskCard from './TaskCard';

export default function BoardColumn({ column, tasks, onStatusChange, onEdit, onDelete }) {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-dark-800/30');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-dark-800/30');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-dark-800/30');
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onStatusChange(taskId, column.id);
    }
  };

  return (
    <div
      className="flex flex-col rounded-2xl bg-dark-900/50 border border-dark-700/30 transition-colors duration-200 min-h-[400px]"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-700/30">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full ${column.accent}`} />
          <h3 className={`text-sm font-semibold ${column.color}`}>
            {column.title}
          </h3>
        </div>
        <span className="text-xs font-medium text-dark-500 bg-dark-800 px-2 py-0.5 rounded-lg">
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-dark-600 text-sm">
            No tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
