const User = require('../models/userModel');

exports.signup = async (req, res) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
            category: req.body.category,
            bio: req.body.bio,
            location: req.body.location
        });

        res.status(201).json({
            status: 'success',
            token: 'dummy-token-lite',
            data: { user: newUser }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide email and password!' });
        }

        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
        }

        res.status(200).json({
            status: 'success',
            token: 'dummy-token-lite',
            data: { user }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.logout = (req, res) => {
    res.status(200).json({ status: 'success' });
};

exports.protect = async (req, res, next) => {
    try {
        // Simplified protection for Lite version
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ status: 'fail', message: 'You are not logged in!' });
        }

        // In Lite mode, we assume any user exists or just get the first one for testing
        const user = await User.findOne();
        if (!user) return res.status(401).json({ status: 'fail', message: 'No users found' });
        
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ status: 'fail', message: 'Protection error' });
    }
};
