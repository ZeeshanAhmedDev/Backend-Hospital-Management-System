
const express = require('express');
const { register, login, forgotPassword } = require('../controllers/authController');


const router = express.Router();

// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);



console.log(router.stack.map(layer => layer.route));

module.exports = router;