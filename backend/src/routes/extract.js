const express = require('express');
const router = express.Router();
const { extractDataFromImage } = require('../controllers/pdfController');

router.post('/', extractDataFromImage);

module.exports = router;