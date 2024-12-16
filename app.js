const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDatabase } = require('./config/database');
const rateLimit = require('express-rate-limit'); // Rate limiting library

const app = express();

// Middleware for security headers and logging
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));



// Rate Limiting - Apply globally to all routes (configurable)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

// Connect to Database before starting the server
connectDatabase().then(() => {
  console.log('Database connected successfully!');
}).catch(err => {
  console.error('Error connecting to the database', err);
  process.exit(1); // Exit the process with failure if database connection fails
});

// API Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/albums', require('./routes/albumRoutes'));
app.use('/api/v1/tracks', require('./routes/trackRoutes'));
app.use('/api/v1/favorites', require('./routes/favoriteRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/artists', require('./routes/artistRoutes'));

// Health Check Endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Music Library API is running!' });
});




// // Example protected route
// app.get('/protected', verifyToken, (req, res) => {
//   res.status(200).send(`Hello, your role is: ${req.user.role}`);
// });

// 404 Error Handling for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Graceful shutdown on process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing gracefully...');
  // Close DB connection and other cleanup operations here
  process.exit(0); // Exit the process after cleanup
});

module.exports = app;
