const express = require('express');

const { protect, restrictTo } = require('../middlewares/authMiddleware');
const {
  getUsers,
  addUser,
  deleteUser,
  updatePassword,
  updateUserRole,
} = require('../controllers/userController');

const router = express.Router();

// Admins can view all users
router.get('/', protect, restrictTo('Admin'), getUsers);

// Admins can add users (but not Admins)
router.post('/add-user', protect,restrictTo('Admin'), addUser);

// Admins can delete users
router.delete('/:id', protect, restrictTo('Admin'), deleteUser);

// Any user can update their own password
router.put('/update-password', protect, updatePassword);

// Admins can update the role of a user (Editor to Viewer, etc.)
router.put('/:id/role', protect, restrictTo('Admin'), updateUserRole);

module.exports = router;
