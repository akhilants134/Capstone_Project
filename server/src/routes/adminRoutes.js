const express = require('express');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all admin routes
router.use(authController.protect);

// Restrict to admin only
router.use(authController.restrictTo('admin'));

// User management
router.get('/users', adminController.getAllUsers);
router.patch('/users/:userId/ban', adminController.toggleBanUser);

// Listings/Donations
router.get('/listings', adminController.getAllListings);

// Statistics
router.get('/stats', adminController.getPlatformStats);

// Verifications
router.get('/verifications', adminController.getUnverifiedUsers);
router.patch('/verifications/:userId/verify', adminController.toggleUserVerification);

// Top donors
router.get('/top-donors', adminController.getTopDonors);

// System Configuration
router.route('/config')
    .get(adminController.getSystemConfig)
    .patch(adminController.updateSystemConfig);

module.exports = router;
