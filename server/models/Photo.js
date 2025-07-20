const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  isActiveForRating: {
    type: Boolean,
    default: false,
  },
  ratings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating',
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Photo', photoSchema);
