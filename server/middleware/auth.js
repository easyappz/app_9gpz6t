const jwt = require('jsonwebtoken');

// JWT secret key (hardcoded as per instructions)
const JWT_SECRET = 'my-secret-key-1234567890';

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
