const Rating = require('../models/Rating');
const Photo = require('../models/Photo');
const User = require('../models/User');

// Rate a photo
const ratePhoto = async (req, res) => {
  try {
    const { photoId, score } = req.body;

    if (!photoId || !score) {
      return res.status(400).json({ message: 'Photo ID and score are required' });
    }

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    if (photo.userId.toString() === req.user.id.toString()) {
      return res.status(400).json({ message: 'You cannot rate your own photo' });
    }

    const existingRating = await Rating.findOne({ photoId, userId: req.user.id });
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this photo' });
    }

    const rating = new Rating({
      photoId,
      userId: req.user.id,
      score: parseInt(score),
    });
    await rating.save();

    // Update points: +1 for rater, -1 for photo owner
    const rater = await User.findById(req.user.id);
    rater.points += 1;
    await rater.save();

    const photoOwner = await User.findById(photo.userId);
    if (photoOwner) {
      photoOwner.points -= 1;
      if (photoOwner.points < 0) photoOwner.points = 0;
      await photoOwner.save();
    }

    res.status(201).json({ message: 'Photo rated successfully', rating, userPoints: rater.points });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Rating failed' });
  }
};

module.exports = {
  ratePhoto,
};
