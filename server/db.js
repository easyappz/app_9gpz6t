const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

// Configure mongoose connection with additional options to handle timeouts and reconnection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase server selection timeout to 30 seconds
  heartbeatFrequencyMS: 10000, // Heartbeat to check connection status every 10 seconds
  autoReconnect: true, // Enable auto-reconnection
  reconnectTries: Number.MAX_VALUE, // Retry connection indefinitely
  reconnectInterval: 1000, // Wait 1 second between reconnection attempts
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
  });
});

// Handle mongoose connection events for better error tracking
const db = mongoose.connection;

db.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

db.on('reconnected', () => {
  console.log('MongoDB reconnected successfully');
});

db.on('error', (err) => {
  console.error('MongoDB connection error event:', err);
});

module.exports = mongoose;
