const Favorite = require('../models/Favorite');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const jwt = require('jsonwebtoken');
const Track = require('../models/Track');


// 22. GET /favorites/:category - Retrieve Favorites
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.user_id })
      // .populate('user') // Populate the user field
      .populate('artists') // Populate the artists field if necessary
      .populate('albums') // Populate the albums field if necessary
      .populate('tracks'); // Populate the tracks field if necessary

    if (!favorites) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'No favorites found.',
        error: null,
      });
    }

    res.status(200).json({
      status: 200,
      data: favorites,
      message: 'Favorites retrieved successfully.',
      error: null,
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({
      status: 500,
      data: null,
      message: 'Internal Server Error.',
      error: error.message,
    });
  }
};


// 23. POST /favorites/add-favorite - Add a Favorite
const addFavorite = async (req, res) => {
  const { category, item_id } = req.body;

  // Validate category type
  const validCategories = ['artist', 'album', 'track'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: 'Invalid category type. Valid categories are artist, album, track.',
      error: null,
    });
  }

  try {
    let item;

    console.log('Incoming Item ID:', item_id); // Debugging
    console.log('Category:', category); // Debugging

    // Query only by custom IDs
    if (category === 'artist') {
      item = await Artist.findOne({ artist_id: item_id });
    } else if (category === 'album') {
      item = await Album.findOne({ album_id: item_id });
    } else if (category === 'track') {
      item = await Track.findOne({ track_id: item_id });
    }

    console.log('Query Result:', item); // Debugging

    // If item is not found, return 404
    if (!item) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Resource does not exist.',
        error: null,
      });
    }

    // Find the existing favorite document for the user
    let favorite = await Favorite.findOne({ user: req.user.user_id });

    // If the favorite document doesn't exist, create one
    if (!favorite) {
      favorite = new Favorite({
        user: req.user.user_id,
      });
    }

    // Add the item to the corresponding category field if it's not already there
    if (category === 'artist' && !favorite.artists.includes(item.artistId)) {
      favorite.artists.push(item.artist_id);  // Add artistId to favorites
    } else if (category === 'album' && !favorite.albums.includes(item.album_id)) {
      favorite.albums.push(item.album_id);  // Add albumId to favorites
    } else if (category === 'track' && !favorite.tracks.includes(item.trackId)) {
      favorite.tracks.push(item.track_id);  // Add trackId to favorites
    }

    // Save the favorite to the database
    await favorite.save();

    res.status(201).json({
      status: 201,
      data: null,
      message: 'Favorite added successfully.',
      error: null,
    });

  } catch (error) {
    console.error('Error saving favorite:', error);
    res.status(400).json({
      status: 400,
      data: null,
      message: 'Bad request.',
      error: error.message,
    });
  }
};

// 24. DELETE /favorites/remove-favorite/:favorite_id - Remove a Favorite
const removeFavorite = async (req, res) => {
  const { favorite_id } = req.params;

  try {
    // Log user ID for debugging
    console.log('User ID from request:', req.user.user_id);

    // Find the user's favorite document
    const favorite = await Favorite.findOne({ user: req.user.user_id });

    // Log the favorite document to ensure it contains data
    console.log('Favorite document for user:', favorite);

    if (!favorite) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'No favorites found for the user.',
        error: null,
      });
    }

    // Log the favorite ID being passed
    console.log('Favorite ID to remove:', favorite_id);

    // Check for favorite removal in all fields (artists, albums, tracks)
    const updatedFields = ['artists', 'albums', 'tracks'];
    let removed = false;

    // Log the current arrays
    console.log('Artists:', favorite.artists);
    console.log('Albums:', favorite.albums);
    console.log('Tracks:', favorite.tracks);

    // Iterate over each field and remove the favorite_id if present
    for (const field of updatedFields) {
      const index = favorite[field].indexOf(favorite_id);
      console.log(`Checking ${field}:`, favorite[field]);  // Log the field's array
      if (index !== -1) {
        favorite[field].splice(index, 1); // Remove the favorite_id
        removed = true;
        break; // Exit the loop once found
      }
    }

    // If no favorite was removed, return an error
    if (!removed) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Favorite not found.',
        error: null,
      });
    }

    // Save the updated favorite
    await favorite.save();

    res.status(200).json({
      status: 200,
      data: null,
      message: 'Favorite removed successfully.',
      error: null,
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(400).json({
      status: 400,
      data: null,
      message: 'Bad request.',
      error: error.message,
    });
  }
};


module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
