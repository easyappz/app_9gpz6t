const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const user = await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { username, email } = req.body;

    if (!username && !email) {
      return res.status(400).json({ message: 'At least one field must be provided for update' });
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if new email or username is already taken by another user
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      select: '-password -resetPasswordToken -resetPasswordExpires',
    });

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        username: updatedUser.username,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
