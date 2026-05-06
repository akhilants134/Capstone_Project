const Listing = require('../models/listingModel');

exports.createListing = async (req, res) => {
    try {
        // Add user ID to listing
        if (!req.body.user) req.body.user = req.user.id;

        const newListing = await Listing.create(req.body);

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
        if (req.query.type) filter.type = req.query.type;
        if (req.query.category) filter.category = req.query.category;

        const listings = await Listing.find(filter).populate('user', 'name role');

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
        const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

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

exports.deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findByIdAndDelete(req.params.id);

        if (!listing) {
            return res.status(404).json({ status: 'fail', message: 'No listing found with that ID' });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
