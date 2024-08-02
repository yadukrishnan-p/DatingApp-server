const express = require('express');
const { register, login, verifyEmail } = require('../controller/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail); // Use GET for this route

module.exports = router;








