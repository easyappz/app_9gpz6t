const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  photoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Rating', ratingSchema);
