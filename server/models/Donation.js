const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    description: { type: String, default: '' },
    quantity: { type: String, default: '' },
    category: { type: String, required: true },
    value: { type: Number, required: true },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    donorName: { type: String, required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    recipientName: { type: String, default: null },
    status: {
      type: String,
      enum: ['listed', 'in_transit', 'completed', 'cancelled'],
      default: 'listed',
    },
    matchedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
