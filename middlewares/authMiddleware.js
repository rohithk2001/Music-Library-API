const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path to your User model
const { isTokenBlacklisted } = require('../controllers/authController');

// Middleware to Protect Routes
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  // Check if the token is blacklisted
  if (isTokenBlacklisted(token)) {
    return res.status(401).json({ message: 'Unauthorized: Token is blacklisted' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info
    console.log('User Role:', req.user.role);  // Log the user role for debugging
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// Middleware to Restrict Access by Role
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
  };
};
module.exports = { protect, restrictTo };
