const Listing = require('../models/listingModel');

exports.createMatch = async (req, res) => {
    try {
        const { listingId, score } = req.body;
        const userId = req.user.id;

        const listing = await Listing.findById(listingId);
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

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ status: 'fail', message: 'Listing not found' });
        }

        // Only owner of the listing can update match status
        if (listing.user.toString() !== currentUserId) {
            return res.status(403).json({ status: 'fail', message: 'Only the owner can update match status' });
        }

        const match = listing.matches.find(m => m.user.toString() === matchUserId);
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
            const matchedUser = await User.findById(matchUserId);
            if (matchedUser) {
                matchedUser.points += 30;
                await matchedUser.save();
                await notificationController.createNotification(
                    matchUserId, 'match', 'Resource Match Found!', 
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
        }).populate('user', 'name');

        // Format for frontend
        const matches = [];
        listings.forEach(listing => {
            listing.matches.forEach(m => {
                // If I am owner, I see matches from others
                // If I am applicant, I see my match on this listing
                if (listing.user._id.toString() === userId || m.user.toString() === userId) {
                    matches.push({
                        id: m._id,
                        listingId: listing._id,
                        resource: listing.title,
                        donor: listing.user.name,
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
