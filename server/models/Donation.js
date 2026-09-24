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

// Indexes for query performance (Mongo)
donationSchema.index({ category: 1, status: 1 });
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ recipient: 1, status: 1 });
donationSchema.index({ status: 1, createdAt: -1 });
donationSchema.index({ itemName: 'text', description: 'text' });

module.exports = mongoose.model('Donation', donationSchema);

