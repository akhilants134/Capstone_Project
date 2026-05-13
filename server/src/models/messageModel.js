const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Message must have a sender']
    },
    receiver: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Message must have a receiver']
    },
    match: {
        type: mongoose.Schema.ObjectId,
        ref: 'Match',
    },
    text: {
        type: String,
        required: [true, 'Message cannot be empty']
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
