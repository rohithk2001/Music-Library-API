// routes/artistRoutes.js

const express = require('express');
const artistController = require('../controllers/artistController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');  // Assuming we have auth middleware

const router = express.Router();

// 7. GET /artists - Retrieve All Artists
router.get('/artist', protect, artistController.getArtists);

// 8. GET /artists/:id - Retrieve a Single Artist
router.get('/artist/:id', protect, artistController.getArtist);

// 9. POST /artists/add-artist - Add a New Artist
router.post('/artist/add-artist', protect, restrictTo('Admin', 'Editor'), artistController.addArtist);

// 10. PUT /artists/:id - Update an Artist
router.put('/artist/:id', protect, restrictTo('Admin', 'Editor'), artistController.updateArtist);

// 11. DELETE /artists/:id - Delete an Artist
router.delete('/artist/:id', protect, restrictTo('Admin', 'Editor'), artistController.deleteArtist);

module.exports = router;
