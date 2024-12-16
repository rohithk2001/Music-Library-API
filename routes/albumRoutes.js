// routes/albumRoutes.js

const express = require('express');
const albumController = require('../controllers/albumController');
const authController = require('../controllers/authController');  // Assuming you have an auth controller to handle authentication

const router = express.Router();

// 12. GET /albums - Retrieve All Albums
router.get('/album', authController.protect, albumController.getAlbums);

// 13. GET /albums/:id - Retrieve an Album by ID
router.get('/album/:id', authController.protect, albumController.getAlbum);

// 14. POST /albums/add-album - Add a new Album
router.post(
  '/album/add-album',
  authController.protect,
  authController.restrictTo('Admin', 'Editor'),  // Only admins and editors can add albums
  albumController.addAlbum
);

// 15. PUT /albums/:id - Update an Album
router.put(
  '/album/:id',
  authController.protect,
  authController.restrictTo('Admin', 'Editor'),  // Only admins and editors can update albums
  albumController.updateAlbum
);

// 16. DELETE /albums/:id - Delete an Album
router.delete(
  '/album/:id',
  authController.protect,
  authController.restrictTo('Admin', 'Editor'),  // Only admins and editors can delete albums
  albumController.deleteAlbum
);

module.exports = router;
