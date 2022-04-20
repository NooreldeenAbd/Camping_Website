const express = require('express');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');

const router = express.Router();


//Show all campgrounds
router.get('/', async (req, res) =>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
});


//New campground form
router.get('/new', isLoggedIn, (req, res) =>{
    res.render('campgrounds/new');
});


//Add a new campground
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) =>{
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Made a new Camp!');
    res.redirect(`/campgrounds/${campground._id}`);
}));


//Show one campground
router.get('/:id', async (req, res) =>{
    const campground = await Campground.findById(req.params.id)
        .populate({
            path:'reviews',
            populate: {
                path: 'author'
            }
        }).
        populate('author');

    if(!campground){
        req.flash('error', 'no camp found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
});


//Edit an exsisting campground form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) =>{
    const{id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'no camp found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}));


//Edit an exsisting campground
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) =>{
    const{id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Updated a Camp!');
    res.redirect(`/campgrounds/${camp._id}`);
}));


//Delete a campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) =>{
    const{id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Deleted a Camp');
    res.redirect('/campgrounds');
}));

module.exports = router;