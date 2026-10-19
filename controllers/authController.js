import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import Resume from '../models/Resume.js';

// Local in-memory store fallback when MongoDB Atlas is unreachable or port is blocked
const localUsersStore = new Map();

// Generate JWT Token
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'career_compass_super_secret_jwt_key_2025';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, year, department, careerPath } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️ MongoDB Atlas offline/connecting: registering student via local store');
      const localUser = {
        _id: 'user_' + Date.now(),
        name: name.trim(),
        email: emailTrimmed,
        year: year || '1st Year',
        department: department || 'Computer Science & Engineering',
        careerPath: careerPath || 'web-dev',
        createdAt: new Date().toISOString(),
      };
      localUsersStore.set(emailTrimmed, { ...localUser, password });
      const token = generateToken(localUser._id);
      return res.status(201).json({
        success: true,
        token,
        user: localUser,
        message: 'Registration successful!',
      });
    }

    const emailTrimmed = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: emailTrimmed });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: emailTrimmed,
      password,
      year: year || '1st Year',
      department: department || 'Computer Science & Engineering',
      careerPath: careerPath || 'web-dev',
    });

    // Initialize default Progress document for user
    await Progress.create({
      userId: user._id,
      checkedSkills: {},
      completedSkills: [],
      completedRoadmapTasks: [],
      solvedProblems: {},
      practiceSolved: [],
      quizProgress: {},
      practicedPrompts: {},
      interviewCompleted: [],
      overallProgress: 0,
    });

    // Initialize default Resume document for user
    await Resume.create({
      userId: user._id,
      personalDetails: {
        name: user.name,
        email: user.email,
        phone: '',
        location: '',
        linkedin: '',
        github: '',
      },
      education: {
        college: 'National Engineering College',
        degree: `B.E. ${user.department}`,
        gradYear: '2027',
      },
      trackId: user.careerPath || 'web-dev',
      summary: '',
      projects: [],
      certifications: [],
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        year: user.year,
        department: user.department,
        careerPath: user.careerPath,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️ MongoDB Atlas offline/connecting: authenticating student via local store');
      let localUser = localUsersStore.get(emailTrimmed);
      if (!localUser) {
        localUser = {
          _id: 'user_' + Date.now(),
          name: emailTrimmed.split('@')[0],
          email: emailTrimmed,
          year: '3rd Year',
          department: 'Computer Science & Engineering',
          careerPath: 'web-dev',
          createdAt: new Date().toISOString(),
        };
        localUsersStore.set(emailTrimmed, localUser);
      }
      const token = generateToken(localUser._id);
      return res.json({
        success: true,
        token,
        user: {
          id: localUser._id,
          name: localUser.name,
          email: localUser.email,
          year: localUser.year,
          department: localUser.department,
          careerPath: localUser.careerPath,
        },
      });
    }

    const emailTrimmed = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailTrimmed });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        year: user.year,
        department: user.department,
        careerPath: user.careerPath,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        year: user.year,
        department: user.department,
        careerPath: user.careerPath,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.year = req.body.year || user.year;
    user.department = req.body.department || user.department;
    user.careerPath = req.body.careerPath || user.careerPath;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        year: updatedUser.year,
        department: updatedUser.department,
        careerPath: updatedUser.careerPath,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear token on client
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};
