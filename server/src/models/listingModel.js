const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A listing must have a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'A listing must have a description']
    },
    category: {
        type: String,
        required: [true, 'A listing must have a category'],
        enum: ['tech', 'medical', 'education', 'food', 'shelter', 'financial']
    },
    type: {
        type: String,
        required: [true, 'A listing must have a type'],
        enum: ['request', 'donation']
    },
    status: {
        type: String,
        enum: ['active', 'matched', 'completed', 'cancelled'],
        default: 'active'
    },
    urgency: {
        type: String,
        enum: ['low', 'high', 'urgent'],
        default: 'low'
    },
    quantity: {
        type: Number,
        default: 1
    },
    estimatedValue: String,
    location: String,
    tags: [String],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Listing must belong to a user']
    },
    matches: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        score: Number,
        status: {
            type: String,
            enum: ['pending', 'accepted', 'declined'],
            default: 'pending'
        }
    }]
}, {
    timestamps: true
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
