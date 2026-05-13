const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: ['client', 'donor', 'admin'],
        default: 'client'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8
    },
    category: {
        type: String,
        enum: ['tech', 'medical', 'education', 'food', 'shelter', 'financial', ''],
        default: ''
    },
    bio: String,
    location: String,
    phone: String
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
