const express = require('express');

const Campground = require('../models/campground');
const Review = require('../models/review');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const catchAsync = require('../utils/catchAsync');

const router = express.Router({mergeParams:true});


//Leave a review 
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) =>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await Promise.all([ review.save(), campground.save()]);
    req.flash('success', 'Created New Review!');
    res.redirect(`/campgrounds/${campground._id}`);
}));


//Delete a review 
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) =>{
    const{id, reviewId} = req.params;
    await Promise.all([
        Campground.findByIdAndUpdate(id, {$pull : {reviews: reviewId} }),
        Review.findByIdAndDelete(reviewId)
    ]);
    req.flash('success', 'Deleted a Review');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;