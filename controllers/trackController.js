const Track = require('../models/Track');
const Album = require('../models/Album');
const Artist = require('../models/Artist');

// 17. GET /tracks - Retrieve All Tracks
const getTracks = async (req, res) => {
  const { limit = 5, offset = 0, artist_id, album_id, hidden } = req.query;

  try {
    const filter = {};

    if (artist_id) {
      filter.artist_id = artist_id;
    }
    if (album_id) {
      filter.album_id = album_id;
    }
    if (hidden !== undefined) {
      filter.hidden = hidden === 'true';
    }

    const tracks = await Track.find(filter)
      .skip(Number(offset))
      .limit(Number(limit));

    if (!tracks.length) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'No tracks found matching the criteria.',
        error: null,
      });
    }

    res.status(200).json({
      status: 200,
      data: tracks,
      message: 'Tracks retrieved successfully.',
      error: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      data: null,
      message: 'Bad request.',
      error: error.message,
    });
  }
};

// 18. GET /tracks/:id - Retrieve a Track by ID
const getTrack = async (req, res) => {
  const { id } = req.params;

  try {
    let track;

    // Check if the id is a valid MongoDB ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Try to find by ObjectId first
      track = await Track.findById(id);
    }

    // If not found by ObjectId, try to find by custom track_id
    if (!track) {
      track = await Track.findOne({ track_id: id });
    }

    // If track still not found, return 404
    if (!track) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Track not found.',
        error: null,
      });
    }

    // Respond with the track data
    res.status(200).json({
      status: 200,
      data: track,
      message: 'Track retrieved successfully.',
      error: null,
    });
  } catch (error) {
    // Handle any errors
    res.status(400).json({
      status: 400,
      data: null,
      message: 'Bad request.',
      error: error.message,
    });
  }
};

// 19. POST /tracks/add-track - Add a new Track
const addTrack = async (req, res) => {
  const { artist_id, album_id, name, duration, hidden } = req.body;

  try {
    const album = await Album.findOne({album_id});
    const artist = await Artist.findOne({artist_id});

    if (!album || !artist) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Invalid album or artist ID.',
        error: null,
      });
    }

    const newTrack = new Track({ artist_id, album_id, name, duration, hidden });
    await newTrack.save();

    res.status(201).json({
      status: 201,
      data: null,
      message: 'Track created successfully.',
      error: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      data: null,
      message: 'Bad request.',
      error: error.message,
    });
  }
};

// 20. PUT /tracks/:id - Update Track
const updateTrack = async (req, res) => {
  const { id } = req.params;
  const { name, duration, hidden } = req.body;

  try {
    let track;

    // Check if the id is a valid MongoDB ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Try to find by ObjectId first
      track = await Track.findById(id);
    }

    // If not found by ObjectId, try to find by custom track_id
    if (!track) {
      track = await Track.findOne({ track_id: id });
    }

    // If track still not found, return 404
    if (!track) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Track not found.',
        error: null,
      });
    }

    // Update the track fields if provided
    if (name) track.name = name;
    if (duration) track.duration = duration;
    if (hidden !== undefined) track.hidden = hidden;

    // Save the updated track
    await track.save();

    res.status(200).json({
      status: 200,
      data: track,
      message: 'Track updated successfully.',
      error: null,
    });
  } catch (error) {
    // Handle errors
    res.status(400).json({
      status: 400,
      data: null,
      message: 'Bad request.',
      error: error.message,
    });
  }
};

// 21. DELETE /tracks/:id - Delete Track
const deleteTrack = async (req, res) => {
  const { id } = req.params;

  try {
    let track;

    // Check if the id is a valid MongoDB ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Try to find by ObjectId first
      track = await Track.findByIdAndDelete(id);
    }

    // If not found by ObjectId, try to find by custom track_id
    if (!track) {
      track = await Track.findOneAndDelete({ track_id: id });
    }

    // If track still not found, return 404
    if (!track) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Track not found.',
        error: null,
      });
    }

    // Track deleted successfully
    res.status(200).json({
      status: 200,
      data: null,
      message: `Track ${track.name} deleted successfully.`,
      error: null,
    });
  } catch (error) {
    // Handle any errors
    res.status(400).json({
      status: 400,
      data: null,
      message: 'Bad request.',
      error: error.message,
    });
  }
};


module.exports = {
  getTracks,
  getTrack,
  addTrack,
  updateTrack,
  deleteTrack,
};
