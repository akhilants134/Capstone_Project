const express = require('express');
const messageController = require('../controllers/messageController');
const authController = require('../controllers/authController');

const router = express.Router();

// All routes are protected
router.use(authController.protect);

router.route('/')
    .get(messageController.getConversations)
    .post(messageController.sendMessage);

router.route('/:userId')
    .get(messageController.getMessages);

module.exports = router;
