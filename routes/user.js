const express = require('express');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const userController = require ('../controllers/user');

const router = express.Router();


// Passport login config object
logInConfig = {
    failureFlash: true,
    failureRedirect: '/login'
}


router.route('/register')
    .get(userController.registerForm)
    .post(catchAsync(userController.register));


router.route('/login')
    .get(userController.loginForm)
    .post( passport.authenticate('local', logInConfig),userController.login);


router.get('/logout', userController.logout);


module.exports = router;