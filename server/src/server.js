const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRouter = require('./routes/userRoutes');
const listingRouter = require('./routes/listingRoutes');
const matchRouter = require('./routes/matchRoutes');

const app = express();

// Basic Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/listings', listingRouter);
app.use('/api/v1/matches', matchRouter);

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Resource & Donation Matcher API (Lite) is running...' });
});

// Database Connection
const DB = process.env.DATABASE_URL || 'mongodb://localhost:27017/resourcematcher';
mongoose.connect(DB)
    .then(() => console.log('✅ MongoDB connection successful'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});