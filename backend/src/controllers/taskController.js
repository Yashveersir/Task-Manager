const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ team: req.user.team }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: { tasks },
    });
  } catch (error) {
    console.error('Get Tasks Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching tasks.' });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }
    res.json({ success: true, data: { task } });
  } catch (error) {
    console.error('Get Task Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching task.' });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, status, priority, assignedTo, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      dueDate: dueDate || null,
      team: req.user.team,
    });

    // Populate the created task
    const populatedTask = await Task.findById(task._id);

    // Emit real-time event to team room
    const io = req.app.get('io');
    io.to(req.user.team.toString()).emit('task:created', populatedTask);

    // Send notification to assigned user
    if (assignedTo) {
      io.to(req.user.team.toString()).emit('notification', {
        type: 'task_assigned',
        message: `You have been assigned: "${title}"`,
        taskId: task._id,
        userId: assignedTo,
        createdBy: req.user.name,
        timestamp: new Date(),
      });
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      data: { task: populatedTask },
    });
  } catch (error) {
    console.error('Create Task Error:', error);
    res.status(500).json({ success: false, message: 'Error creating task.' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const { title, description, status, priority, assignedTo, dueDate } = req.body;

    // Track if assignee changed
    const prevAssignee = task.assignedTo ? task.assignedTo._id?.toString() : null;
    const newAssignee = assignedTo || null;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, assignedTo: newAssignee, dueDate },
      { new: true, runValidators: true }
    );

    // Emit real-time event to team room
    const io = req.app.get('io');
    io.to(req.user.team.toString()).emit('task:updated', updatedTask);

    // Notify new assignee
    if (newAssignee && newAssignee !== prevAssignee) {
      io.to(req.user.team.toString()).emit('notification', {
        type: 'task_assigned',
        message: `You have been assigned: "${updatedTask.title}"`,
        taskId: updatedTask._id,
        userId: newAssignee,
        createdBy: req.user.name,
        timestamp: new Date(),
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully!',
      data: { task: updatedTask },
    });
  } catch (error) {
    console.error('Update Task Error:', error);
    res.status(500).json({ success: false, message: 'Error updating task.' });
  }
};

// @desc    Update task status (for drag-and-drop)
// @route   PATCH /api/tasks/:id/status
exports.updateTaskStatus = async (req, res) => {
  try {
    console.log('--- updateTaskStatus HIT! ---', req.params.id, req.body);
    const { status } = req.body;

    if (!['todo', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: todo, in-progress, or done.',
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    // Emit real-time event to team room
    const io = req.app.get('io');
    io.to(req.user.team.toString()).emit('task:status-changed', task);

    // Notify if task completed
    if (status === 'done') {
      io.to(req.user.team.toString()).emit('notification', {
        type: 'task_completed',
        message: `Task "${task.title}" has been completed!`,
        taskId: task._id,
        timestamp: new Date(),
      });
    }

    res.json({
      success: true,
      message: 'Task status updated!',
      data: { task },
    });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ success: false, message: 'Error updating task status.' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    await Task.findByIdAndDelete(req.params.id);

    // Emit real-time event backward to team room
    const io = req.app.get('io');
    io.to(req.user.team.toString()).emit('task:deleted', { taskId: req.params.id });

    res.json({
      success: true,
      message: 'Task deleted successfully!',
    });
  } catch (error) {
    console.error('Delete Task Error:', error);
    res.status(500).json({ success: false, message: 'Error deleting task.' });
  }
};

// @desc    Get task stats for dashboard
// @route   GET /api/tasks/stats
exports.getTaskStats = async (req, res) => {
  try {
    const teamFilter = { team: req.user.team };
    const totalTasks = await Task.countDocuments(teamFilter);
    const todoTasks = await Task.countDocuments({ ...teamFilter, status: 'todo' });
    const inProgressTasks = await Task.countDocuments({ ...teamFilter, status: 'in-progress' });
    const doneTasks = await Task.countDocuments({ ...teamFilter, status: 'done' });

    const highPriority = await Task.countDocuments({ ...teamFilter, priority: 'high' });
    const mediumPriority = await Task.countDocuments({ ...teamFilter, priority: 'medium' });
    const lowPriority = await Task.countDocuments({ ...teamFilter, priority: 'low' });

    // Recent tasks
    const recentTasks = await Task.find(teamFilter)
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          total: totalTasks,
          todo: todoTasks,
          inProgress: inProgressTasks,
          done: doneTasks,
          highPriority,
          mediumPriority,
          lowPriority,
        },
        recentTasks,
      },
    });
  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching stats.' });
  }
};

