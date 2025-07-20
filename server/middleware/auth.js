const { verifyToken } = require('../utils/auth');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Отсутствует токен авторизации' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Неверный токен' });
  }

  req.user = decoded;
  next();
};

module.exports = authMiddleware;
