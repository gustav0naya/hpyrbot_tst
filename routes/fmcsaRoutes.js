// routes/fmcsaRoutes.js
const express = require('express');
const router = express.Router();
const fmcsaController = require('../controllers/fmcsaController');

// Route: GET /fmcsa/validate-carrier?mc_number=12345
router.get('/validate-carrier', fmcsaController.validateCarrier);

module.exports = router;
