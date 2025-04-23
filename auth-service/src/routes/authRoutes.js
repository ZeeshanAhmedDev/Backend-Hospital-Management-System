
const express = require('express');
const { register, login, forgotPassword,resetPassword   } = require('../controllers/authController');


const router = express.Router();

// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/reset-password/:token', resetPassword);  // For link validation
router.post('/reset-password/:token', resetPassword); // For password submission



console.log(router.stack.map(layer => layer.route));

module.exports = router;