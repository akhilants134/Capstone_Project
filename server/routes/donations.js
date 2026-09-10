const express = require('express');
const Donation = require('../models/Donation');
const { protect, adminOnly } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(apiLimiter);

router.get('/', apiLimiter, protect, adminOnly, async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/top-donors', apiLimiter, protect, adminOnly, async (req, res) => {
  try {
    const topDonors = await Donation.aggregate([
      {
        $group: {
          _id: '$donorName',
          totalValue: { $sum: '$value' },
          donationCount: { $sum: 1 },
          categories: { $addToSet: '$category' },
        },
      },
      { $sort: { totalValue: -1 } },
      { $limit: 10 },
    ]);
    res.json(topDonors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
