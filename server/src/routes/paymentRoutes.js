const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { validate, paymentCheckoutSchema } = require('../middleware/validator');
const authController = require('../controllers/authController');

// Public checkout & analytics
router.post('/checkout', validate(paymentCheckoutSchema), paymentController.createDonationCheckout);
router.post('/record', paymentController.recordMonetaryDonation);
router.get('/analytics', paymentController.getFinancialAnalytics);
router.get('/orm', paymentController.getTransactionsViaOrm);

module.exports = router;

