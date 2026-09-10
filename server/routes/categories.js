const express = require('express');
const Donation = require('../models/Donation');
const { protect, adminOnly } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(apiLimiter);

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const categories = await Donation.aggregate([
      {
        $group: {
          _id: '$category',
          donationCount: { $sum: 1 },
          totalValue: { $sum: '$value' },
        },
      },
      { $sort: { totalValue: -1 } },
    ]);

    const totalDonations = categories.reduce((sum, c) => sum + c.donationCount, 0);
    const result = categories.map((c) => ({
      name: c._id,
      donationCount: c.donationCount,
      totalValue: c.totalValue,
      percentage: totalDonations > 0 ? Math.round((c.donationCount / totalDonations) * 100) : 0,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
