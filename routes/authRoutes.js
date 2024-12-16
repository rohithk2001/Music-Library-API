const express = require('express');
const { signup, login, protect ,logout } = require('../controllers/authController');
const router = express.Router();

// Example routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', protect, logout);


module.exports = router;
