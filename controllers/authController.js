const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // User model

// User Signup
const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine the role (first user becomes Admin)
    const isFirstUser = (await User.countDocuments()) === 0;
    const role = isFirstUser ? 'Admin' : 'Viewer';

    // Create a new user
    const user = await User.create({ email, password: hashedPassword, role });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// User Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }


   
    const token = jwt.sign(
      { user_id: user._id, role: user.role },  // Include user id and role in the token payload
      process.env.JWT_SECRET,                  // Secret key for signing the token
      { expiresIn: '1h' }                      // Set token expiry time (e.g., 1 hour)
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Token Blacklist for Logout (optional)
const tokenBlacklist = new Set();

// Logout Controller
const logout = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract the token
  if (!token) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: 'Bad Request',
      error: null,
    });
  }

  // Add token to blacklist (optional, if stored)
  tokenBlacklist.add(token);

  res.status(200).json({
    status: 200,
    data: null,
    message: 'User logged out successfully.',
    error: null,
  });
};

// Middleware to Check Token
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'You are not logged in! Please log in to get access.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user data to the request object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token. Please log in again.' });
  }
};

// Middleware to restrict access to certain roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action.' });
    }
    next();
  };
};

// Optional middleware to check if token is blacklisted (if you're using token blacklist for logout)
const isTokenBlacklisted = (token) => tokenBlacklist.has(token);

module.exports = { signup, login, logout, protect, restrictTo, isTokenBlacklisted };
