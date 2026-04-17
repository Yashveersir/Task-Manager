const User = require('../models/User');

// @desc    Get all users (for task assignment)
// @route   GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ team: req.user.team }).select('name email role avatar createdAt');
    res.json({
      success: true,
      data: { users },
    });
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching users.' });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email role avatar createdAt');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, data: { user } });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching user.' });
  }
};
