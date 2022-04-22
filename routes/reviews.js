const express = require('express');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const reviewController = require ('../controllers/reviews');

const router = express.Router({mergeParams:true});


router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.post));


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.delete));


module.exports = router;