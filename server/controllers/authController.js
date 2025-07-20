const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateToken } = require('../utils/auth');

exports.register = async (req, res) => {
  try {
    const { email, password, username, gender, age } = req.body;

    // Валидация входных данных
    if (!email || !password || !username || !gender || age === undefined) {
      return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 150) {
      return res.status(400).json({ message: 'Некорректный возраст' });
    }

    if (!['male', 'female', 'other'].includes(gender)) {
      return res.status(400).json({ message: 'Некорректное значение пола. Допустимые значения: male, female, other' });
    }

    // Проверка на существование пользователя
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email уже зарегистрирован' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      username,
      gender,
      age: parsedAge,
    });

    // Сохранение пользователя в базе данных
    await user.save();

    // Генерация токена
    const token = generateToken(user);
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        email, 
        username, 
        gender, 
        age: parsedAge 
      } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Ошибка при регистрации', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Валидация входных данных
    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Неверные учетные данные' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверные учетные данные' });
    }

    const token = generateToken(user);
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email, 
        username: user.username, 
        gender: user.gender, 
        age: user.age 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Ошибка при входе', error: error.message });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email обязателен' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const resetToken = Math.random().toString(36).substring(2, 15);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    res.json({ message: 'Токен для сброса пароля сгенерирован', token: resetToken });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Ошибка при запросе сброса пароля', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Токен и новый пароль обязательны' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Неверный или истекший токен сброса' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Сброс пароля успешен' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Ошибка при сбросе пароля', error: error.message });
  }
};
