// routes/loadRoutes.js
const express = require('express');
const router = express.Router();
const loadController = require('../controllers/loadController');

// GET /loads?reference_number=123456
router.get('/', loadController.getLoadDetails);

module.exports = router;

