const User = require('../models/User'); // Assuming you have a User model defined
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// GET /users - Retrieve all users
const getUsers = async (req, res) => {
  const { limit = 5, offset = 0, role } = req.query;
  try {
    const query = {};
    if (role) query.role = role.toLowerCase();

    const users = await User.find(query)
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    res.status(200).json({
      status: 200,
      data: users,
      message: 'Users retrieved successfully.',
      error: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      data: null,
      message: 'Bad Request',
      error: null,
    });
  }
};

// POST /users/add-user - Add a new user
const addUser = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({
      status: 403,
      data: null,
      message: 'Forbidden Access/Operation not allowed.',
      error: null,
    });
  }

  const { email, password, role } = req.body;

  if (role && role === 'Admin') {
    return res.status(403).json({
      status: 403,
      data: null,
      message: 'Cannot create an admin user.',
      error: null,
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: 409,
        data: null,
        message: 'Email already exists.',
        error: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword, role }); // No variable assignment

    res.status(201).json({
      status: 201,
      data: null,
      message: 'User created successfully.',
      error: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      data: null,
      message: 'Bad Request',
      error: error.message, // Include error message for debugging
    });
  }
};
// DELETE /users/:id - Delete a user
const deleteUser = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({
      status: 403,
      data: null,
      message: 'Forbidden Access/Operation not allowed.',
      error: null,
    });
  }

  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'User not found.',
        error: null,
      });
    }

    res.status(200).json({
      status: 200,
      data: null,
      message: 'User deleted successfully.',
      error: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      data: null,
      message: 'Bad Request',
      error: null,
    });
  }
};

// PUT /users/update-password - Update user password
const updatePassword = async (req, res) => {
  const { old_password, new_password } = req.body;

  try {
    const user = await User.findById(req.user.user_id);
    if (!user) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'User not found.',
        error: null,
      });
    }

    const passwordMatch = await bcrypt.compare(old_password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: 'Unauthorized Access',
        error: null,
      });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      status: 204,
      data: null,
      message: 'Password updated successfully.',
      error: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      data: null,
      message: 'Bad Request',
      error: null,
    });
  }
};

// PUT /users/:id/role - Update user role
const updateUserRole = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({
      status: 403,
      data: null,
      message: 'Forbidden Access/Operation not allowed.',
      error: null,
    });
  }

  const { role } = req.body;
  const validRoles = ['Editor', 'Viewer'];  // You can define allowed roles

  if (!validRoles.includes(role)) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: 'Invalid role specified.',
      error: null,
    });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'User not found.',
        error: null,
      });
    }

    res.status(200).json({
      status: 200,
      data: user,
      message: 'User role updated successfully.',
      error: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      data: null,
      message: 'Bad Request',
      error: null,
    });
  }
};


module.exports = { getUsers, addUser, deleteUser, updatePassword, updateUserRole };
