const { object } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review');
const { campgroundSchema } = require('../schemas');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String, 
    image:String,
    price: Number, 
    descreption: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// Delete associated Reviews when campground is deleted
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id:{ $in: doc.reviews}
        })
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);