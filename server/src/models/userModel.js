const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
        enum: ['community', 'donor', 'recipient', 'admin'],
        default: 'community'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    twoFactorSecret: {
        type: String,
        select: false
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorBackupCodes: {
        type: [String],
        select: false
    },
    category: {
        type: String,
        enum: ['medical', 'education', 'food', 'shelter', 'financial', 'volunteering', 'tech'],
        default: undefined
    },
    bio: String,
    location: String,
    phone: String,
    points: {
        type: Number,
        default: 0
    },
    badges: [{
        name: String,
        icon: String,
        earnedAt: {
            type: Date,
            default: Date.now
        }
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    isBanned: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
