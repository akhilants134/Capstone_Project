const express = require('express');
const User = require('../models/User');
const Donation = require('../models/Donation');
const Request = require('../models/Request');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(apiLimiter);

router.post('/', apiLimiter, async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      return res.json({ message: 'Data already seeded' });
    }

    const admin = await User.create({
      username: 'admin',
      email: 'admin@platform.com',
      password: 'admin123',
      role: 'admin',
      fullName: 'Admin User',
      verified: true,
      status: 'active',
    });

    const donors = await User.insertMany([
      {
        username: 'techsolutions',
        email: 'info@techsolutions.com',
        password: '$2a$12$dummyhash1234567890123456789012345678901234567890',
        role: 'donor',
        fullName: 'Tech Solutions Inc',
        organization: 'Tech Solutions Inc',
        verified: true,
        status: 'active',
      },
      {
        username: 'abcmfg',
        email: 'info@abcmfg.com',
        password: '$2a$12$dummyhash1234567890123456789012345678901234567891',
        role: 'donor',
        fullName: 'ABC Manufacturing Ltd',
        organization: 'ABC Manufacturing Ltd',
        verified: true,
        status: 'active',
      },
      {
        username: 'freshfoods',
        email: 'info@freshfoods.com',
        password: '$2a$12$dummyhash1234567890123456789012345678901234567892',
        role: 'donor',
        fullName: 'Fresh Foods Factory',
        organization: 'Fresh Foods Factory',
        verified: true,
        status: 'active',
      },
      {
        username: 'greenvalley',
        email: 'info@greenvalley.com',
        password: '$2a$12$dummyhash1234567890123456789012345678901234567893',
        role: 'donor',
        fullName: 'Green Valley Community',
        organization: 'Green Valley Community',
        verified: true,
        status: 'active',
      },
    ]);

    const recipients = await User.insertMany([
      {
        username: 'hopechildren',
        email: 'info@hopechildren.org',
        password: '$2a$12$dummyhash1234567890123456789012345678901234567894',
        role: 'recipient',
        fullName: 'Hope Children\'s Home',
        organization: 'Hope Children\'s Home',
        verified: true,
        status: 'active',
      },
      {
        username: 'helpinghands',
        email: 'info@helpinghands.org',
        password: '$2a$12$dummyhash1234567890123456789012345678901234567895',
        role: 'recipient',
        fullName: 'Helping Hands NGO',
        organization: 'Helping Hands NGO',
        verified: false,
        status: 'pending',
      },
    ]);

    await Donation.insertMany([
      {
        itemName: 'School Supplies',
        description: 'Educational materials for children',
        quantity: '500 units',
        category: 'Education',
        value: 2500,
        donor: donors[1]._id,
        donorName: 'ABC Manufacturing Ltd',
        recipient: recipients[0]._id,
        recipientName: "Hope Children's Home",
        status: 'completed',
        matchedAt: new Date(),
      },
      {
        itemName: 'Office Furniture',
        description: 'Desks and chairs',
        quantity: '25 pieces',
        category: 'Furniture',
        value: 3200,
        donor: donors[1]._id,
        donorName: 'ABC Manufacturing Ltd',
        status: 'listed',
      },
      {
        itemName: 'Canned Food',
        description: 'Non-perishable food items',
        quantity: '1000 units',
        category: 'Food',
        value: 4200,
        donor: donors[2]._id,
        donorName: 'Fresh Foods Factory',
        status: 'listed',
      },
      {
        itemName: 'Winter Clothing',
        description: 'Warm clothes for winter',
        quantity: '200 kg',
        category: 'Clothing',
        value: 3000,
        donor: donors[3]._id,
        donorName: 'Green Valley Community',
        recipient: recipients[1]._id,
        recipientName: 'Helping Hands NGO',
        status: 'in_transit',
        matchedAt: new Date(),
      },
      {
        itemName: 'Laptops',
        description: 'Refurbished business laptops',
        quantity: '10 units',
        category: 'Electronics',
        value: 8000,
        donor: donors[0]._id,
        donorName: 'Tech Solutions Inc',
        status: 'listed',
      },
    ]);

    await Request.insertMany([
      {
        itemName: 'Computers for Lab',
        category: 'Electronics',
        urgency: 'high',
        requester: recipients[0]._id,
        requesterName: "Hope Children's Home",
        status: 'open',
      },
      {
        itemName: 'Food Supplies',
        category: 'Food',
        urgency: 'high',
        requester: recipients[1]._id,
        requesterName: 'Helping Hands NGO',
        status: 'open',
      },
      {
        itemName: 'Blankets',
        category: 'Clothing',
        urgency: 'medium',
        requester: recipients[0]._id,
        requesterName: "Hope Children's Home",
        status: 'open',
      },
    ]);

    res.json({ message: 'Seed data created successfully' });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ message: 'Seeding failed', error: err.message });
  }
});

module.exports = router;
