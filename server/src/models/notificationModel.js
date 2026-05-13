const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Notification must have a recipient']
    },
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['match', 'message', 'system', 'badge'],
        required: [true, 'Notification must have a type']
    },
    title: {
        type: String,
        required: [true, 'Notification must have a title']
    },
    text: {
        type: String,
        required: [true, 'Notification must have text content']
    },
    link: String, // Page to navigate to
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
