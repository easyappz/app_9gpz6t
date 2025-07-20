const express = require('express');
const authMiddleware = require('./middleware/auth');
const upload = require('./config/multer');

const authController = require('./controllers/authController');
const photoController = require('./controllers/photoController');
const ratingController = require('./controllers/ratingController');
const userController = require('./controllers/userController');

const router = express.Router();

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

// User routes
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.put('/profile/password', authMiddleware, userController.updatePassword);

// Photo routes
router.post('/photos/upload', authMiddleware, upload.single('photo'), photoController.uploadPhoto);
router.get('/photos', authMiddleware, photoController.getUserPhotos);
router.put('/photos/:photoId/toggle-active', authMiddleware, photoController.togglePhotoActive);
router.get('/photos/rate', authMiddleware, photoController.getPhotoForRating);
router.get('/photos/:photoId/stats', authMiddleware, photoController.getPhotoStats);

// Rating routes
router.post('/ratings', authMiddleware, ratingController.ratePhoto);

module.exports = router;
