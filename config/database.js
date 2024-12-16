// config/database.js
const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.DB_URI);
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
}
module.exports = { connectDatabase };
