// controllers/artistController.js

const Artist = require('../models/Artist');  // Assuming you have an Artist model defined
const catchAsync = require('../utils/catchAsync'); // Helper for async error handling
const AppError = require('../utils/appError');  // Custom error handling
const handlerFactory = require('../utils/handlerFactory'); // To create reusable controller functions

// 7. GET /artists - Retrieve All Artists
exports.getArtists = catchAsync(async (req, res, next) => {
  const { limit = 5, offset = 0, grammy, hidden } = req.query;
  
  // Prepare filter criteria based on query parameters
  let filter = {};
  if (grammy) filter.grammy = grammy;
  if (hidden) filter.hidden = hidden;

  // Retrieve artists from the database
  const artists = await Artist.find(filter)
    .limit(parseInt(limit))
    .skip(parseInt(offset));

  if (!artists || artists.length === 0) {
    return next(new AppError('No artists found with the given filters.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: artists,
  });
});

// 8. GET /artists/:id - Retrieve a Single Artist
exports.getArtist = catchAsync(async (req, res, next) => {
  const artist = await Artist.findOne({ artistId: req.params.artistId });
  
  if (!artist) {
    return next(new AppError('Artist not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: artist,
  });
});

// 9. POST /artists/add-artist - Add a New Artist
exports.addArtist = catchAsync(async (req, res, next) => {
  // Check if user has the required role (Admin or Editor)
  if (!req.user || (req.user.role !== 'Admin' && req.user.role !== 'Editor')) {
    return next(new AppError('You do not have permission to add an artist.', 403));
  }

  const { name, grammy, hidden } = req.body;

  // Check if the required fields are present
  if (!name || grammy === undefined || hidden === undefined) {
    return next(new AppError('Missing required fields: name, grammy, or hidden', 400));
  }

  // Create a new artist and save to the database
  const newArtist = await Artist.create({ name, grammy, hidden });

  res.status(201).json({
    status: '201',
    data: null,
    message:'Artist created successfully.',
    error:null,
  });
});

// 10. PUT /artists/:id - Update an Artist
exports.updateArtist = catchAsync(async (req, res, next) => {
  const artist = await Artist.findOneAndUpdate(
    { artistId: req.params.artistId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!artist) {
    return next(new AppError('Artist not found', 404));
  }

  // Check if user has the required role (Admin or Editor)
  if (!req.user || (req.user.role !== 'Admin' && req.user.role !== 'Editor')) {
    return next(new AppError('You do not have permission to update an artist.', 403));
  }

  res.status(200).json({
    status: 'success',
    message:'updated'
  });
});

// 11. DELETE /artists/:id - Delete an Artist
exports.deleteArtist = catchAsync(async (req, res, next) => {
  // Assuming 'artistId' is the unique field you want to use for deleting an artist
  const artist = await Artist.findOneAndDelete({ artistId: req.params.artistId });

  if (!artist) {
    return next(new AppError('Artist not found', 404));
  }

  // Check if user has the required role (Admin or Editor)
  if (!req.user || (req.user.role !== 'Admin' && req.user.role !== 'Editor')) {
    return next(new AppError('You do not have permission to delete an artist.', 403));
  }

  res.status(200).json({
    status: '200',
    message: `Artist with ID ${req.params.artistId} deleted successfully.`,
  });
});
