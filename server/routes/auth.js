const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(authLimiter);

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });

router.post('/login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const safeUsername = String(username).trim();
    const safePassword = String(password);
    const user = await User.findOne({ username: safeUsername });
    if (!user || !(await user.comparePassword(safePassword))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = signToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        organization: user.organization,
        verified: user.verified,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', authLimiter, protect, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      role: req.user.role,
      fullName: req.user.fullName,
      organization: req.user.organization,
      verified: req.user.verified,
    },
  });
});

module.exports = router;
