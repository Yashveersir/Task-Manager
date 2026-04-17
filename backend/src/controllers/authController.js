const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Team = require('../models/Team');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, inviteCode } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.',
      });
    }

    let teamId;

    if (inviteCode) {
      // Find team by invite code
      const team = await Team.findOne({ inviteCode });
      if (!team) {
        return res.status(400).json({
          success: false,
          message: 'Invalid invitation code.',
        });
      }
      teamId = team._id;
    } else {
      // Create new team
      const generatedCode = crypto.randomBytes(4).toString('hex').toUpperCase(); // 8 chars
      const newTeam = await Team.create({
        name: `${name}'s Workspace`,
        inviteCode: generatedCode,
      });
      teamId = newTeam._id;
    }

    // Create user
    const user = await User.create({ 
      name, 
      email, 
      password,
      activeTeam: teamId,
      teams: [teamId] 
    });

    // If we just created the team, set the createdBy to this new user
    if (!inviteCode) {
      await Team.findByIdAndUpdate(teamId, { createdBy: user._id });
    }

    // Generate token
    const token = generateToken(user._id);

    // Populate before sending
    const populatedUser = await User.findById(user._id)
      .populate('activeTeam', 'name inviteCode')
      .populate('teams', 'name inviteCode');

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: {
        user: populatedUser.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating account. Please try again.',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Populate before sending
    const populatedUser = await User.findById(user._id)
      .populate('activeTeam', 'name inviteCode')
      .populate('teams', 'name inviteCode');

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        user: populatedUser.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in. Please try again.',
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('activeTeam', 'name inviteCode')
      .populate('teams', 'name inviteCode');
      
    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile.',
    });
  }
};

// @desc    Switch active team
// @route   PATCH /api/auth/switch-team/:teamId
exports.switchTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    
    // Check if user belongs to this team
    if (!req.user.teams.some(id => id.toString() === teamId)) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this team.'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { activeTeam: teamId },
      { new: true }
    ).populate('activeTeam', 'name inviteCode').populate('teams', 'name inviteCode');
    
    res.json({
      success: true,
      message: 'Team switched successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Switch Team Error:', error);
    res.status(500).json({ success: false, message: 'Error switching team' });
  }
};

// @desc    Join a new team via invite code
// @route   POST /api/auth/join-team
exports.joinTeam = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    
    const team = await Team.findOne({ inviteCode });
    if (!team) {
      return res.status(404).json({ success: false, message: 'Invalid invite code' });
    }
    
    // Check if user is already in this team
    if (req.user.teams.some(id => id.toString() === team._id.toString())) {
      return res.status(400).json({ success: false, message: 'You are already a member of this team' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $push: { teams: team._id },
        activeTeam: team._id 
      },
      { new: true }
    ).populate('activeTeam', 'name inviteCode').populate('teams', 'name inviteCode');
    
    res.json({
      success: true,
      message: `Joined ${team.name} successfully`,
      data: { user }
    });
  } catch (error) {
    console.error('Join Team Error:', error);
    res.status(500).json({ success: false, message: 'Error joining team' });
  }
};

// @desc    Create an additional team
// @route   POST /api/auth/create-team
exports.createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Team name is required' });
    
    const generatedCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    const newTeam = await Team.create({
      name,
      inviteCode: generatedCode,
      createdBy: req.user._id
    });
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $push: { teams: newTeam._id },
        activeTeam: newTeam._id 
      },
      { new: true }
    ).populate('activeTeam', 'name inviteCode').populate('teams', 'name inviteCode');
    
    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Create Team Error:', error);
    res.status(500).json({ success: false, message: 'Error creating team' });
  }
};
