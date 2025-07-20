const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

// Configure mongoose connection with supported options
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase server selection timeout to 30 seconds
  heartbeatFrequencyMS: 10000 // Heartbeat to check connection status every 10 seconds
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  // Log detailed error information for debugging
  console.error('Error details:', {
    message: err.message,
    code: err.code,
    name: err.name,
    stack: err.stack // Added stack trace for deeper debugging
  });
});

// Handle mongoose connection events for better error tracking
const db = mongoose.connection;

db.on('disconnected', () => {
  console.warn('MongoDB disconnected.');
});

db.on('error', (err) => {
  console.error('MongoDB connection error event:', err);
  // Additional logging for error details
  console.error('Detailed error info:', {
    message: err.message,
    name: err.name,
    code: err.code,
    stack: err.stack // Log full stack trace for diagnosing issues
  });
});

// Log when the connection is closed
db.on('close', () => {
  console.warn('MongoDB connection closed.');
});

module.exports = mongoose;
