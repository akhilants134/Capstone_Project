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
            token: newUser._id,
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
            token: user._id,
            data: { user }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.logout = (req, res) => {
    res.status(200).json({ status: 'success' });
};

exports.getMe = async (req, res) => {
    res.status(200).json({
        status: 'success',
        data: { user: req.user }
    });
};

exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token || token === 'undefined' || token === 'null') {
            return res.status(401).json({ status: 'fail', message: 'You are not logged in!' });
        }
        const user = await User.findById(token);
        if (!user) return res.status(401).json({ status: 'fail', message: 'User no longer exists' });
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ status: 'fail', message: 'Invalid session' });
    }
};
