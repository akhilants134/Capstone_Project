const express = require('express');
const matchController = require('../controllers/matchController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.post('/apply', matchController.createMatch);
router.patch('/update-status', matchController.updateMatchStatus);

module.exports = router;
