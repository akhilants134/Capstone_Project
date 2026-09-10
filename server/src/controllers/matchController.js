const Listing = require('../models/listingModel');
const mongoose = require('mongoose');

exports.createMatch = async (req, res) => {
    try {
        const { listingId, score } = req.body;
        const userId = req.user.id;
        const normalizedListingId = String(listingId || '');
        if (!mongoose.Types.ObjectId.isValid(normalizedListingId)) {
            return res.status(400).json({ status: 'fail', message: 'Invalid listing ID' });
        }

        const listing = await Listing.findOne({ _id: { $eq: normalizedListingId } });
        if (!listing) {
            return res.status(404).json({ status: 'fail', message: 'Listing not found' });
        }

        // Check if already matched
        const isAlreadyMatched = listing.matches.some(m => m.user.toString() === userId);
        if (isAlreadyMatched) {
            return res.status(400).json({ status: 'fail', message: 'You have already applied/matched with this listing' });
        }

        // Add match
        listing.matches.push({
            user: userId,
            score: score || 90, // Default score for now
            status: 'pending'
        });

        await listing.save();

        res.status(200).json({
            status: 'success',
            message: 'Match request sent successfully',
            data: { listing }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.updateMatchStatus = async (req, res) => {
    try {
        const { listingId, matchUserId, status } = req.body;
        const currentUserId = req.user.id;
        const normalizedListingId = String(listingId || '');
        const normalizedMatchUserId = String(matchUserId || '');
        if (!mongoose.Types.ObjectId.isValid(normalizedListingId) || !mongoose.Types.ObjectId.isValid(normalizedMatchUserId)) {
            return res.status(400).json({ status: 'fail', message: 'Invalid match identifiers' });
        }

        const listing = await Listing.findOne({ _id: { $eq: normalizedListingId } });
        if (!listing) {
            return res.status(404).json({ status: 'fail', message: 'Listing not found' });
        }

        // Only owner of the listing can update match status
        if (listing.user.toString() !== currentUserId) {
            return res.status(403).json({ status: 'fail', message: 'Only the owner can update match status' });
        }

        const match = listing.matches.find(m => m.user.toString() === normalizedMatchUserId);
        if (!match) {
            return res.status(404).json({ status: 'fail', message: 'Match not found for this user' });
        }

        match.status = status;
        
        // If accepted, mark listing as matched and award points
        if (status === 'accepted') {
            listing.status = 'matched';
            
            const User = require('../models/userModel');
            const notificationController = require('./notificationController');
            
            // Award owner
            const owner = await User.findById(currentUserId);
            if (owner) {
                owner.points += 50;
                await owner.save();
                await notificationController.createNotification(
                    currentUserId, 'match', 'Match Accepted!', 
                    `You have successfully matched your resource: ${listing.title}`, '/matches'
                );
            }
            
            // Award matched user
            const matchedUser = await User.findOne({ _id: { $eq: normalizedMatchUserId } });
            if (matchedUser) {
                matchedUser.points += 30;
                await matchedUser.save();
                await notificationController.createNotification(
                    normalizedMatchUserId, 'match', 'Resource Match Found!', 
                    `Your application for ${listing.title} has been accepted!`, '/matches'
                );
            }
        }

        await listing.save();

        res.status(200).json({
            status: 'success',
            data: { listing }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getMyMatches = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Find listings where user is owner OR where user is in matches array
        const listings = await Listing.find({
            $or: [
                { user: userId },
                { 'matches.user': userId }
            ]
        }).populate('user', 'name').populate('matches.user', 'name');

        // Format for frontend
        const matches = [];
        listings.forEach(listing => {
            listing.matches.forEach(m => {
                const matchUserObj = m.user;
                if (!matchUserObj) return;
                
                const matchUserIdStr = matchUserObj._id ? matchUserObj._id.toString() : matchUserObj.toString();
                const isOwner = listing.user._id.toString() === userId;
                
                // If I am owner, I see matches from others
                // If I am applicant, I see my match on this listing
                if (isOwner || matchUserIdStr === userId) {
                    const partnerName = isOwner ? (matchUserObj.name || 'Community Member') : listing.user.name;
                    const partnerId = isOwner ? matchUserIdStr : listing.user._id.toString();

                    matches.push({
                        id: m._id,
                        listingId: listing._id,
                        matchUserId: matchUserIdStr,
                        donorId: partnerId,
                        donor: partnerName,
                        resource: listing.title,
                        status: m.status,
                        matchScore: m.score,
                        date: listing.createdAt,
                        desc: listing.description,
                        category: listing.category
                    });
                }
            });
        });

        res.status(200).json({
            status: 'success',
            results: matches.length,
            data: { matches }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
