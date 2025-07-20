const Photo = require('../models/Photo');
const User = require('../models/User');
const Rating = require('../models/Rating');

exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const photo = new Photo({
      userId: req.user.id,
      url: `/uploads/${req.file.filename}`,
    });

    await photo.save();
    res.status(201).json({ message: 'Photo uploaded successfully', photo });
  } catch (error) {
    res.status(500).json({ message: 'Photo upload failed', error: error.message });
  }
};

exports.getUserPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ userId: req.user.id });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user photos', error: error.message });
  }
};

exports.togglePhotoActive = async (req, res) => {
  try {
    const { photoId } = req.params;
    const user = await User.findById(req.user.id);
    const photo = await Photo.findOne({ _id: photoId, userId: req.user.id });

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    if (!photo.isActiveForRating && user.points <= 0) {
      return res.status(403).json({ message: 'Not enough points to activate photo for rating' });
    }

    photo.isActiveForRating = !photo.isActiveForRating;
    await photo.save();

    res.json({ message: 'Photo active status updated', photo });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle photo active status', error: error.message });
  }
};

exports.getPhotoForRating = async (req, res) => {
  try {
    const { gender, minAge, maxAge } = req.query;
    const userId = req.user.id;

    const query = {
      userId: { $ne: userId },
      isActiveForRating: true,
    };

    const userQuery = {};
    if (gender) {
      userQuery.gender = gender;
    }
    if (minAge && maxAge) {
      userQuery.age = { $gte: parseInt(minAge), $lte: parseInt(maxAge) };
    }

    const users = await User.find(userQuery).select('_id');
    const userIds = users.map(user => user._id);

    if (userIds.length > 0) {
      query.userId = { $in: userIds };
    }

    const ratedPhotoIds = await Rating.find({ userId }).distinct('photoId');
    if (ratedPhotoIds.length > 0) {
      query._id = { $nin: ratedPhotoIds };
    }

    const photo = await Photo.findOne(query);
    if (!photo) {
      return res.status(404).json({ message: 'No photos available for rating with the specified filters' });
    }

    res.json(photo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch photo for rating', error: error.message });
  }
};

exports.getPhotoStats = async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await Photo.findOne({ _id: photoId, userId: req.user.id }).populate('ratings');

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const ratings = await Rating.find({ photoId }).populate('userId');
    const stats = {
      totalRatings: ratings.length,
      averageScore: ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length : 0,
      byGender: {
        male: { count: 0, average: 0, sum: 0 },
        female: { count: 0, average: 0, sum: 0 },
        other: { count: 0, average: 0, sum: 0 },
      },
      byAgeGroup: {
        under20: { count: 0, average: 0, sum: 0 },
        '20-30': { count: 0, average: 0, sum: 0 },
        '30-40': { count: 0, average: 0, sum: 0 },
        over40: { count: 0, average: 0, sum: 0 },
      },
    };

    ratings.forEach(rating => {
      const user = rating.userId;
      const score = rating.score;

      if (user.gender === 'male') {
        stats.byGender.male.count++;
        stats.byGender.male.sum += score;
      } else if (user.gender === 'female') {
        stats.byGender.female.count++;
        stats.byGender.female.sum += score;
      } else {
        stats.byGender.other.count++;
        stats.byGender.other.sum += score;
      }

      if (user.age < 20) {
        stats.byAgeGroup.under20.count++;
        stats.byAgeGroup.under20.sum += score;
      } else if (user.age >= 20 && user.age < 30) {
        stats.byAgeGroup['20-30'].count++;
        stats.byAgeGroup['20-30'].sum += score;
      } else if (user.age >= 30 && user.age < 40) {
        stats.byAgeGroup['30-40'].count++;
        stats.byAgeGroup['30-40'].sum += score;
      } else {
        stats.byAgeGroup.over40.count++;
        stats.byAgeGroup.over40.sum += score;
      }
    });

    for (const gender in stats.byGender) {
      if (stats.byGender[gender].count > 0) {
        stats.byGender[gender].average = stats.byGender[gender].sum / stats.byGender[gender].count;
      }
    }

    for (const ageGroup in stats.byAgeGroup) {
      if (stats.byAgeGroup[ageGroup].count > 0) {
        stats.byAgeGroup[ageGroup].average = stats.byAgeGroup[ageGroup].sum / stats.byAgeGroup[ageGroup].count;
      }
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch photo stats', error: error.message });
  }
};
