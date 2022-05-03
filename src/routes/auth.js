//Node imports
const express = require('express');
const router = express.Router();

//Custom imports
const authController = require('../controllers/auth');
const User = require('../models/user');


router.post('/signup', authController.postSignUp);
router.post('/login', authController.postLogin);

module.exports = router;
