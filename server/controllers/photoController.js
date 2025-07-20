const Photo = require('../models/Photo');
const User = require('../models/User');
const Rating = require('../models/Rating');
const path = require('path');
const fs = require('fs');

// Upload a new photo
const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { gender, age } = req.body;
    if (!gender || !age) {
      return res.status(400).json({ message: 'Gender and age are required' });
    }

    const photo = new Photo({
      userId: req.user.id,
      filePath: req.file.path,
      gender,
      age: parseInt(age),
      isActive: false,
    });

    await photo.save();
    res.status(201).json({ message: 'Photo uploaded successfully', photo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Photo upload failed' });
  }
};

// Get user's photos
const getUserPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ userId: req.user.id });
    res.json(photos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch photos' });
  }
};

// Toggle photo active status for rating
const togglePhotoActive = async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await Photo.findOne({ _id: photoId, userId: req.user.id });

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const user = await User.findById(req.user.id);
    if (!photo.isActive && user.points < 1) {
      return res.status(400).json({ message: 'Not enough points to activate photo for rating' });
    }

    photo.isActive = !photo.isActive;
    await photo.save();

    if (photo.isActive) {
      user.points -= 1;
      await user.save();
    }

    res.json({ message: `Photo ${photo.isActive ? 'activated' : 'deactivated'} for rating`, photo, points: user.points });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to toggle photo status' });
  }
};

// Get photo for rating (random photo not owned by user and not rated by them)
const getPhotoForRating = async (req, res) => {
  try {
    const { gender, minAge, maxAge } = req.query;

    const filter = {
      userId: { $ne: req.user.id },
      isActive: true,
    };

    if (gender) {
      filter.gender = gender;
    }
    if (minAge && maxAge) {
      filter.age = { $gte: parseInt(minAge), $lte: parseInt(maxAge) };
    } else if (minAge) {
      filter.age = { $gte: parseInt(minAge) };
    } else if (maxAge) {
      filter.age = { $lte: parseInt(maxAge) };
    }

    const ratedPhotoIds = await Rating.find({ userId: req.user.id }).distinct('photoId');
    filter._id = { $nin: ratedPhotoIds };

    const photo = await Photo.aggregate([
      { $match: filter },
      { $sample: { size: 1 } },
    ]);

    if (photo.length === 0) {
      return res.status(404).json({ message: 'No photos available for rating with the specified filters' });
    }

    res.json(photo[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch photo for rating' });
  }
};

// Get photo statistics
const getPhotoStats = async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await Photo.findOne({ _id: photoId, userId: req.user.id });

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const ratings = await Rating.find({ photoId });
    const totalRatings = ratings.length;
    const averageScore = totalRatings > 0 ? ratings.reduce((sum, rating) => sum + rating.score, 0) / totalRatings : 0;

    res.json({
      photo,
      stats: {
        totalRatings,
        averageScore,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch photo statistics' });
  }
};

module.exports = {
  uploadPhoto,
  getUserPhotos,
  togglePhotoActive,
  getPhotoForRating,
  getPhotoStats,
};
