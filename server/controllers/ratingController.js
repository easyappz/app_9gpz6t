const Rating = require('../models/Rating');
const Photo = require('../models/Photo');
const User = require('../models/User');

exports.ratePhoto = async (req, res) => {
  try {
    const { photoId, score } = req.body;
    const userId = req.user.id;

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    if (photo.userId.toString() === userId.toString()) {
      return res.status(403).json({ message: 'You cannot rate your own photo' });
    }

    const existingRating = await Rating.findOne({ photoId, userId });
    if (existingRating) {
      return res.status(403).json({ message: 'You have already rated this photo' });
    }

    const rating = new Rating({
      photoId,
      userId,
      score,
    });
    await rating.save();

    photo.ratings.push(rating._id);
    await photo.save();

    const rater = await User.findById(userId);
    rater.points += 1;
    await rater.save();

    const photoOwner = await User.findById(photo.userId);
    photoOwner.points -= 1;
    await photoOwner.save();

    res.status(201).json({ message: 'Photo rated successfully', rating });
  } catch (error) {
    res.status(500).json({ message: 'Failed to rate photo', error: error.message });
  }
};
