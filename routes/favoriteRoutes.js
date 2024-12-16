// routes/favoriteRoutes.js

const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const authController = require('../controllers/authController');  // Assuming you have an auth controller for JWT protection

const router = express.Router();

// 22. GET /favorites/:category - Retrieve Favorites
router.get('/favorite/:category', authController.protect, favoriteController.getFavorites);

// 23. POST /favorites/add-favorite - Add a Favorite
router.post(
  '/favorite/add-favorite',
  authController.protect,
  favoriteController.addFavorite
);

// 24. DELETE /favorites/remove-favorite/:id - Remove a Favorite
router.delete(
  '/favorite/remove-favorite/:favorite_id',
  authController.protect,
  favoriteController.removeFavorite
);

module.exports = router;
