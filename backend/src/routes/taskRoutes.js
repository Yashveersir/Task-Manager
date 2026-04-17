const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/tasks/stats — must be before /:id
router.get('/stats', getTaskStats);

// GET /api/tasks
router.get('/', getTasks);

// GET /api/tasks/:id
router.get('/:id', getTask);

// POST /api/tasks
router.post('/', [
  body('title').trim().notEmpty().withMessage('Task title is required').isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('status').optional().isIn(['todo', 'in-progress', 'done']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
], createTask);

// PUT /api/tasks/:id
router.put('/:id', [
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('status').optional().isIn(['todo', 'in-progress', 'done']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
], updateTask);

// PATCH /api/tasks/:id/status
router.patch('/:id/status', updateTaskStatus);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

module.exports = router;
