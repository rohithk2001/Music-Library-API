// controllers/albumController.js

const Album = require('../models/Album');  // Assuming you have an Album model defined
const Artist = require('../models/Artist');  // Assuming you have an Artist model to associate with albums
const catchAsync = require('../utils/catchAsync');  // Helper for async error handling
const AppError = require('../utils/appError');  // Custom error handling
const handlerFactory = require('../utils/handlerFactory');
const mongoose = require('mongoose');
const { param } = require('../app');
// To create reusable controller functions

// 12. GET /albums - Retrieve All Albums
exports.getAlbums = catchAsync(async (req, res, next) => {
  const { limit = 5, offset = 0, artist_id, hidden } = req.query;
  
  // Prepare filter criteria based on query parameters
  let filter = {};
  if (artist_id) {
    const artist = await Artist.findById(artist_id);
    if (!artist) {
      return next(new AppError('Artist not found', 404));
    }
    filter.artist_id = artist_id;
  }
  if (hidden) filter.hidden = hidden;

  // Retrieve albums from the database
  const albums = await Album.find(filter)
    .limit(parseInt(limit))
    .skip(parseInt(offset));

  if (!albums || albums.length === 0) {
    return next(new AppError('No albums found with the given filters.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: albums,
  });
});

// 13. GET /albums/:id - Retrieve a Single Album
exports.getAlbum = catchAsync(async (req, res, next) => {



  const album = await Album.findOne({albumId : req.params.albumId});
  
  if (!album) {
    return next(new AppError('Album not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: album,
  });
});

// 14. POST /albums/add-album - Add a New Album
exports.addAlbum = catchAsync(async (req, res, next) => {
  // Check if user has the required role (Admin or Editor)
  if (!req.user || (req.user.role !== 'Admin' && req.user.role !== 'Editor')) {
    return next(new AppError('You do not have permission to add an album.', 403));
  }

  const { artist_id, name, year, hidden } = req.body;

  // Check if the required fields are present
  if (!name || year === undefined || hidden === undefined) {
    return next(new AppError('Missing required fields: name, year, or hidden', 400));
  }

  try {
    // Attempt to find the artist using custom artist_id format (e.g., UUID)
    let artist = await Artist.findOne({ artist_id });

    // If artist is not found, attempt to find by ObjectId
    if (!artist) {
      artist = await Artist.findById(artist_id);  // This will use Mongo's ObjectId lookup
    }

    // If artist is still not found, throw an error
    if (!artist) {
      return next(new AppError('Artist not found', 404));
    }

    // Create a new album and save to the database
    const newAlbum = await Album.create({ artist_id, name, year, hidden });

    res.status(201).json({
      status: 'success',
      data: newAlbum,
    });

  } catch (error) {
    // If any error occurs (e.g., invalid ObjectId format), handle here
    return next(new AppError('Error creating album: ' + error.message, 500));
  }
});

// 15. PUT /albums/:id - Update an Album
exports.updateAlbum = catchAsync(async (req, res, next) => {
  const { id } = req.params; // Album ID from params
  const { name, artist_id, year, hidden } = req.body; // Fields to be updated

  let album;

  // First try to find album by custom album_id (UUID, string format)
  try {
    album = await Album.findOneAndUpdate(
      { album_id: id },  // Search by custom album_id
      { name, artist_id, year, hidden },
      { new: true, runValidators: true }
    );
  } catch (error) {
    return next(new AppError('Error updating album by custom album_id: ' + error.message, 500));
  }

  // If album wasn't found with custom album_id, try using MongoDB ObjectId
  if (!album) {
    try {
      album = await Album.findByIdAndUpdate(
        id,  // This will try to find by MongoDB's ObjectId
        { name, artist_id, year, hidden },
        { new: true, runValidators: true }
      );
    } catch (error) {
      return next(new AppError('Error updating album by ObjectId: ' + error.message, 500));
    }
  }

  // If album is still not found
  if (!album) {
    return next(new AppError('Album not found', 404));
  }

  // Check if user has the required role (Admin or Editor)
  if (!req.user || (req.user.role !== 'Admin' && req.user.role !== 'Editor')) {
    return next(new AppError('You do not have permission to update an album.', 403));
  }

  res.status(200).json({
    status: 'success',
    data: album,
  });
});

// 16. DELETE /albums/:id - Delete an Album
exports.deleteAlbum = catchAsync(async (req, res, next) => {
  const { id } = req.params;  // Album ID from params

  let album;

  // First try to find and delete album by custom album_id (UUID, string format)
  try {
    album = await Album.findOneAndDelete({ album_id: id });  // Search by custom album_id
  } catch (error) {
    return next(new AppError('Error deleting album by custom album_id: ' + error.message, 500));
  }

  // If album wasn't found with custom album_id, try using MongoDB ObjectId
  if (!album) {
    try {
      album = await Album.findByIdAndDelete(id);  // This will try to find and delete by MongoDB's ObjectId
    } catch (error) {
      return next(new AppError('Error deleting album by ObjectId: ' + error.message, 500));
    }
  }

  // If album is still not found
  if (!album) {
    return next(new AppError('Album not found', 404));
  }

  // Check if user has the required role (Admin or Editor)
  if (!req.user || (req.user.role !== 'Admin' && req.user.role !== 'Editor')) {
    return next(new AppError('You do not have permission to delete an album.', 403));
  }

  res.status(200).json({
    status: 'success',
    message: `Album "${album.name}" deleted successfully.`,
  });
});
