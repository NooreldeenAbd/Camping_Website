const Campground = require('../models/campground');
const Review = require('../models/review');


module.exports.post = async (req, res) =>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await Promise.all([ review.save(), campground.save()]);
    req.flash('success', 'Created New Review!');
    res.redirect(`/campgrounds/${campground._id}`);
}


module.exports.delete = async (req, res) =>{
    const{id, reviewId} = req.params;
    await Promise.all([
        Campground.findByIdAndUpdate(id, {$pull : {reviews: reviewId} }),
        Review.findByIdAndDelete(reviewId)
    ]);
    req.flash('success', 'Deleted a Review');
    res.redirect(`/campgrounds/${id}`);
}