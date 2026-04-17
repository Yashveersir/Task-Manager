const express = require('express');
const { body } = require('express-validator');
const { signup, login, getMe, switchTeam, joinTeam, createTeam } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }),
  body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], signup);

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
], login);

// GET /api/auth/me
router.get('/me', auth, getMe);

// PATCH /api/auth/switch-team/:teamId
router.patch('/switch-team/:teamId', auth, switchTeam);

// POST /api/auth/join-team
router.post('/join-team', auth, joinTeam);

// POST /api/auth/create-team
router.post('/create-team', auth, createTeam);

module.exports = router;
