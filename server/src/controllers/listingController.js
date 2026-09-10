const Listing = require('../models/listingModel');

exports.createListing = async (req, res) => {
    try {
        const { title, description, category, type, urgency, quantity, estimatedValue, location, tags } = req.body;
        const newListing = await Listing.create({
            title, description, category, type, urgency, quantity, estimatedValue, location, tags,
            user: req.user.id
        });

        // Gamification: Award points and badge
        const User = require('../models/userModel');
        const user = await User.findById(req.user.id);
        if (user) {
            user.points += 10;
            const hasFirstShare = user.badges.some(b => b.name === 'First Share');
            if (!hasFirstShare) {
                user.badges.push({ name: 'First Share', icon: '⭐' });
            }
            await user.save();
        }

        // Intelligent Auto-Matching logic
        try {
            const SystemConfig = require('../models/systemConfigModel');
            const config = await SystemConfig.findOne();
            if (config && config.autoMatchEnabled) {
                const oppositeType = type === 'donation' ? 'request' : 'donation';
                
                // Find potential matches
                const potentialMatches = await Listing.find({
                    type: oppositeType,
                    category: category,
                    status: 'active',
                    user: { $ne: req.user.id }
                });

                if (potentialMatches.length > 0) {
                    const notificationController = require('./notificationController');
                    
                    for (const otherListing of potentialMatches) {
                        // Calculate match score
                        let score = 85;
                        if (location && otherListing.location && location.toLowerCase() === otherListing.location.toLowerCase()) {
                            score += 10;
                        }
                        
                        // Tag intersection
                        if (tags && otherListing.tags && Array.isArray(tags) && Array.isArray(otherListing.tags)) {
                            const intersection = tags.filter(t => otherListing.tags.includes(t));
                            if (intersection.length > 0) {
                                score += 5;
                            }
                        }
                        score = Math.min(100, score);

                        // Add match to new listing
                        newListing.matches.push({
                            user: otherListing.user,
                            score,
                            status: 'pending'
                        });

                        // Add match to the other listing
                        otherListing.matches.push({
                            user: req.user.id,
                            score,
                            status: 'pending'
                        });
                        await otherListing.save();

                        // Notify other user
                        await notificationController.createNotification(
                            otherListing.user,
                            'match',
                            'Instant Match Found! ⚡',
                            `A new matching listing "${title}" has been posted in "${category}"!`,
                            '/matches'
                        );

                        // Notify current user
                        await notificationController.createNotification(
                            req.user.id,
                            'match',
                            'Instant Match Found! ⚡',
                            `We automatically found a match with "${otherListing.title}" (Score: ${score}%)!`,
                            '/matches'
                        );
                    }
                    
                    // Save newListing with all added matches
                    await newListing.save();
                }
            }
        } catch (matchErr) {
            console.error('Auto-matching error:', matchErr);
        }

        res.status(201).json({
            status: 'success',
            data: { listing: newListing }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getAllListings = async (req, res) => {
    try {
        const filter = {};
        if (typeof req.query.type === 'string' && req.query.type.trim()) {
            filter.type = { $eq: req.query.type.trim() };
        }
        if (typeof req.query.category === 'string' && req.query.category.trim()) {
            filter.category = { $eq: req.query.category.trim() };
        }
        if (typeof req.query.urgency === 'string' && req.query.urgency.trim()) {
            filter.urgency = { $eq: req.query.urgency.trim() };
        }
        
        // Search functionality (escape regex special chars to prevent ReDoS)
        if (typeof req.query.search === 'string' && req.query.search.trim()) {
            const escaped = req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filter.$or = [
                { title: { $regex: escaped, $options: 'i' } },
                { description: { $regex: escaped, $options: 'i' } }
            ];
        }

        const listings = await Listing.find(filter)
            .populate('user', 'name role')
            .sort('-createdAt');

        res.status(200).json({
            status: 'success',
            results: listings.length,
            data: { listings }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('user', 'name role bio');

        if (!listing) {
            return res.status(404).json({ status: 'fail', message: 'No listing found with that ID' });
        }

        res.status(200).json({
            status: 'success',
            data: { listing }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.updateListing = async (req, res) => {
    try {
        const existing = await Listing.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({ status: 'fail', message: 'No listing found with that ID' });
        }
        if (existing.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ status: 'fail', message: 'You do not own this listing' });
        }

        const toSafeString = (value) => {
            if (value === undefined || value === null) return undefined;
            return typeof value === 'string' ? value : String(value);
        };
        const safeTags = Array.isArray(req.body.tags)
            ? req.body.tags.filter((tag) => typeof tag === 'string')
            : undefined;

        const updates = {
            title: toSafeString(req.body.title),
            description: toSafeString(req.body.description),
            category: toSafeString(req.body.category),
            type: toSafeString(req.body.type),
            urgency: toSafeString(req.body.urgency),
            quantity: Number.isFinite(Number(req.body.quantity)) ? Number(req.body.quantity) : undefined,
            estimatedValue: Number.isFinite(Number(req.body.estimatedValue)) ? Number(req.body.estimatedValue) : undefined,
            location: toSafeString(req.body.location),
            tags: safeTags,
            status: toSafeString(req.body.status)
        };

        Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

        const listing = await Listing.findByIdAndUpdate(req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: 'success',
            data: { listing }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.deleteListing = async (req, res) => {
    try {
        const existing = await Listing.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({ status: 'fail', message: 'No listing found with that ID' });
        }
        if (existing.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ status: 'fail', message: 'You do not own this listing' });
        }

        await Listing.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const User = require('../models/userModel');

        const totalListings = await Listing.countDocuments();
        const totalDonations = await Listing.countDocuments({ type: 'donation' });
        const totalRequests = await Listing.countDocuments({ type: 'request' });
        const activeMatches = await Listing.countDocuments({ status: 'matched' });
        const totalUsers = await User.countDocuments();

        res.status(200).json({
            status: 'success',
            data: {
                totalListings,
                totalDonations,
                totalRequests,
                activeMatches,
                totalUsers,
                successRate: totalListings > 0 ? Math.round(activeMatches / totalListings * 100) : 0,
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
