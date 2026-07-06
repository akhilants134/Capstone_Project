const express = require('express');
const Donation = require('../models/Donation');
const Request = require('../models/Request');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments();
    const activeRequests = await Request.countDocuments({ status: 'open' });
    const totalMatched = await Donation.countDocuments({
      status: { $in: ['completed', 'in_transit'] },
    });
    const valueResult = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: '$value' } } },
    ]);
    const totalValue = valueResult.length > 0 ? valueResult[0].total : 0;
    const totalUsers = await User.countDocuments();
    const pendingVerifications = await User.countDocuments({ verified: false, role: { $ne: 'admin' } });

    res.json({
      totalDonations,
      activeRequests,
      totalMatched,
      totalValue,
      totalUsers,
      pendingVerifications,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
