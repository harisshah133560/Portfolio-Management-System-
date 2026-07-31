var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');
var protect = require('../middleware/auth');
var upload = require('../middleware/upload');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/public-profile', authController.getPublicProfile);
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);
router.put('/password', protect, authController.changePassword);
router.post('/avatar', protect, upload.single('avatar'), authController.uploadAvatar);
router.post('/cv', protect, upload.single('cv'), authController.uploadCv);
router.delete('/account', protect, authController.deleteAccount);

module.exports = router;