const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const apiRoutes = require('./apiRoutes');
const mongoose = require('./db'); // Import mongoose to ensure connection is initialized

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files for photo uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api', apiRoutes);

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error occurred:', {
    message: err.message,
    stack: err.stack, // Log full stack trace for debugging
    method: req.method, // Log request method for context
    url: req.url // Log request URL for context
  });
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server only if MongoDB connection is established
const PORT = process.env.PORT || 3000;
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

// Check MongoDB connection state before starting server
if (mongoose.connection.readyState === 1) {
  console.log('MongoDB connection already established, starting server...');
  startServer();
} else {
  mongoose.connection.once('connected', () => {
    console.log('MongoDB connection established, starting server...');
    startServer();
  });

  // Handle case where connection fails
  mongoose.connection.on('error', (err) => {
    console.error('Failed to start server due to MongoDB connection error:', {
      message: err.message,
      stack: err.stack
    });
    process.exit(1); // Exit the process if connection fails to prevent server from running without DB
  });
}

module.exports = app;
