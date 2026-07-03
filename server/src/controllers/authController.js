const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

// In-memory fallback for offline mode
global.OFFLINE_USERS = global.OFFLINE_USERS || {};

const generateToken = (id, subscriptionTier) => {
  return jwt.sign({ id, subscriptionTier }, process.env.JWT_SECRET || 'fallback_secret_for_local_development', {
    expiresIn: '30d',
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please add all fields' });
    }

    const dbConnected = mongoose.connection.readyState === 1;
    let user;

    if (dbConnected) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
    } else {
      // Offline fallback
      const normalizedEmail = email.toLowerCase();
      if (global.OFFLINE_USERS[normalizedEmail]) {
        return res.status(400).json({ success: false, message: 'User already exists (Offline Mode)' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const fakeId = 'offline-user-' + Date.now();
      user = {
        _id: fakeId,
        name,
        email: normalizedEmail,
        password: hashedPassword,
        subscriptionTier: 'free',
        createdAt: new Date()
      };
      global.OFFLINE_USERS[normalizedEmail] = user;
    }

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id, user.subscriptionTier),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          tier: user.subscriptionTier
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please add all fields' });
    }

    const dbConnected = mongoose.connection.readyState === 1;
    let user;

    if (dbConnected) {
      user = await User.findOne({ email }).select('+password');
      if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
          success: true,
          token: generateToken(user._id, user.subscriptionTier),
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            tier: user.subscriptionTier
          }
        });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } else {
      // Offline fallback
      const normalizedEmail = email.toLowerCase();
      user = global.OFFLINE_USERS[normalizedEmail];
      if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
          success: true,
          token: generateToken(user._id, user.subscriptionTier),
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            tier: user.subscriptionTier
          }
        });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials (Offline Mode)' });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const dbConnected = mongoose.connection.readyState === 1;
    let user;

    if (dbConnected) {
      user = await User.findById(req.user.id);
    } else {
      // Offline fallback
      user = Object.values(global.OFFLINE_USERS).find(u => u._id === req.user.id);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        tier: user.subscriptionTier
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
