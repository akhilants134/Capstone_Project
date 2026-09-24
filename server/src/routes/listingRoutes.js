const express = require('express');
const listingController = require('../controllers/listingController');
const authController = require('../controllers/authController');
const { validate, createListingSchema } = require('../middleware/validator');

const router = express.Router();

// Public routes
router.get('/', listingController.getAllListings);
router.get('/stats', listingController.getStats);
router.get('/:id', listingController.getListing);

// Protected routes
router.use(authController.protect);

router.post('/', validate(createListingSchema), listingController.createListing);
router.patch('/:id', listingController.updateListing);
router.delete('/:id', listingController.deleteListing);

module.exports = router;

