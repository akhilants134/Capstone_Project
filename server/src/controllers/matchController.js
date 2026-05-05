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
        
        // If accepted, mark listing as matched (optional logic)
        if (status === 'accepted') {
            listing.status = 'matched';
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
