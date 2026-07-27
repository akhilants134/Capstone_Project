const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, required: true },
    urgency: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    requesterName: { type: String, required: true },
    status: {
      type: String,
      enum: ['open', 'matched', 'fulfilled', 'cancelled'],
      default: 'open',
    },
    matchedDonation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);
