const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const handleValidation = require('../validators/handleValidation');
const {
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  changePasswordRules,
} = require('../validators/authValidators');

const router = express.Router();

// Stricter limiter for brute-force-sensitive auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later.', data: null, errors: null },
});

router.post('/register', authLimiter, registerRules, handleValidation, authController.register);
router.post('/login', authLimiter, loginRules, handleValidation, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.me);
router.post('/forgot-password', authLimiter, forgotPasswordRules, handleValidation, authController.forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordRules, handleValidation, authController.resetPassword);
router.post('/change-password', protect, changePasswordRules, handleValidation, authController.changePassword);

module.exports = router;
