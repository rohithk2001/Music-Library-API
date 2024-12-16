// routes/trackRoutes.js

const express = require('express');
const trackController = require('../controllers/trackController');
const authController = require('../controllers/authController');  // Assuming you have an auth controller to handle authentication

const router = express.Router();

// 17. GET /tracks - Retrieve All Tracks
router.get('/track', authController.protect, trackController.getTracks);

// 18. GET /tracks/:id - Retrieve a Track by ID
router.get('/track/:id', authController.protect, trackController.getTrack);

// 19. POST /tracks/add-track - Add a new Track
router.post(
  '/track/add-track',
  authController.protect,
  authController.restrictTo('Admin', 'Editor'),  // Only admins and editors can add tracks
  trackController.addTrack
);

// 20. PUT /tracks/:id - Update a Track
router.put(
  '/track/:id',
  authController.protect,
  authController.restrictTo('Admin', 'Editor'),  // Only admins and editors can update tracks
  trackController.updateTrack
);

// 21. DELETE /tracks/:id - Delete a Track
router.delete(
  '/track/:id',
  authController.protect,
  authController.restrictTo('Admin', 'Editor'),  // Only admins and editors can delete tracks
  trackController.deleteTrack
);

module.exports = router;
