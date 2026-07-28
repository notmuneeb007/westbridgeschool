const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/auth/register', auth.register);
router.post('/auth/verify-otp', auth.verifyOtp);
router.post('/auth/login', auth.login);
router.post('/auth/resend-otp', auth.resendOtp);
router.post('/auth/update-avatar', auth.updateAvatar);

module.exports = router;
