const express = require('express');
const { sendContactEmail } = require('../controllers/contactController');

const router = express.Router();

// Define POST route for contact form
router.post('/contact', sendContactEmail);

module.exports = router;
