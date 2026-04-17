const express = require('express');
const { getUsers, getUser } = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/users
router.get('/', getUsers);

// GET /api/users/:id
router.get('/:id', getUser);

module.exports = router;
