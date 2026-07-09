const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');

const router = express.Router();

// Stricter rate limiter for 2FA verification — 10 attempts per 15 minutes
const twoFARateLimit = rateLimit({
  max: 10,
  windowMs: 15 * 60 * 1000,
  message: { status: 'fail', message: 'Too many verification attempts. Please wait 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Standard auth routes ───────────────────────────────────────────────────
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/admin-login', authController.adminLogin);
router.get('/logout', authController.logout);
router.get('/me', authController.protect, authController.getMe);

// ── 2FA routes ────────────────────────────────────────────────────────────
// Called with pre-auth token (no session yet) — rate limited
router.post('/2fa/verify', twoFARateLimit, authController.verify2FA);

// Protected routes — full session required
router.post('/2fa/setup',         authController.protect, authController.setup2FA);
router.post('/2fa/enable',        authController.protect, authController.enable2FA);
router.post('/2fa/disable',       authController.protect, authController.disable2FA);
router.post('/2fa/backup-codes',  authController.protect, authController.regenerateBackupCodes);
router.patch('/updateMe',         authController.protect, authController.updateMe);
router.patch('/updatePassword',   authController.protect, authController.updatePassword);

module.exports = router;
