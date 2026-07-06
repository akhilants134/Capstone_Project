const User = require('../models/userModel');
const Listing = require('../models/listingModel');

// Get all users for admin dashboard
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -twoFactorSecret -twoFactorBackupCodes');
        res.status(200).json({
            status: 'success',
            data: { users }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

// Ban/Unban user
exports.toggleBanUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        if (user.role === 'admin') {
            return res.status(400).json({
                status: 'error',
                message: 'Cannot ban admin users'
            });
        }

        user.isBanned = !user.isBanned;
        await user.save();

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

// Get all listings/donations for admin dashboard
exports.getAllListings = async (req, res) => {
    try {
        const listings = await Listing.find().populate('user', 'name email role');
        res.status(200).json({
            status: 'success',
            data: { listings }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

// Get platform statistics
exports.getPlatformStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalListings = await Listing.countDocuments();
        const activeListings = await Listing.countDocuments({ status: 'active' });
        const matchedListings = await Listing.countDocuments({ status: 'matched' });
        const completedListings = await Listing.countDocuments({ status: 'completed' });
        
        const listingsByCategory = await Listing.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        const listingsByType = await Listing.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);

        const totalEstimatedValue = await Listing.aggregate([
            { $match: { estimatedValue: { $ne: null } } },
            { $group: { _id: null, total: { $sum: { $toDouble: '$estimatedValue' } } } }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                totalUsers,
                totalListings,
                activeListings,
                matchedListings,
                completedListings,
                listingsByCategory,
                listingsByType,
                totalEstimatedValue: totalEstimatedValue[0]?.total || 0
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

// Get unverified users for verification tab
exports.getUnverifiedUsers = async (req, res) => {
    try {
        const users = await User.find({ isVerified: false })
            .select('-password -twoFactorSecret -twoFactorBackupCodes');
        res.status(200).json({
            status: 'success',
            data: { users }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

// Approve/Reject user verification
exports.toggleUserVerification = async (req, res) => {
    try {
        const { userId } = req.params;
        const { action } = req.body; // 'approve' or 'reject'

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        if (action === 'approve') {
            user.isVerified = true;
        } else if (action === 'reject') {
            // Mark user as rejected by keeping isVerified false
            // Could add a rejection reason field in the future
            user.isVerified = false;
        }

        await user.save();

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

// Get top donors
exports.getTopDonors = async (req, res) => {
    try {
        const donors = await User.find({ role: 'donor' })
            .select('-password -twoFactorSecret -twoFactorBackupCodes')
            .sort({ points: -1 })
            .limit(10);

        // Calculate donation value for each donor
        const donorsWithValue = await Promise.all(donors.map(async (donor) => {
            const listings = await Listing.find({ 
                user: donor._id, 
                type: 'donation',
                status: { $in: ['matched', 'completed'] }
            });
            
            const totalValue = listings.reduce((sum, listing) => {
                return sum + (listing.estimatedValue ? parseFloat(listing.estimatedValue) : 0);
            }, 0);

            return {
                ...donor.toObject(),
                totalDonationValue: totalValue,
                donationCount: listings.length
            };
        }));

        res.status(200).json({
            status: 'success',
            data: { donors: donorsWithValue.sort((a, b) => b.totalDonationValue - a.totalDonationValue) }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};
