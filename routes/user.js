const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();


// Passport login config object
logInConfig = {
    failureFlash: true,
    failureRedirect: '/login'
}


//Create a user form
router.get('/register', (req, res) =>{
    res.render('user/register');
});


//Create a user
router.post('/register', catchAsync(async (req, res, next) =>{
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err =>{
            if(err) return next(err);
            req.flash('success', 'Welcome to Camp!');
            res.redirect('/campgrounds');
        });

    }catch (e){
        req.flash('error', e.message);
        res.redirect('register');
    }
}));


//Login form
router.get('/login',  (req, res) =>{
    res.render('user/login');
});


//Login the user
router.post('/login', passport.authenticate('local', logInConfig), (req, res) =>{
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo ;
    res.redirect(redirectUrl);
});


//Logout the user
router.get('/logout', (req, res) =>{
    req.logout();
    req.flash('success', 'Logged Out!');
    res.redirect('/campgrounds');
});


module.exports = router;