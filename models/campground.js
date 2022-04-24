const { object } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review');
const { campgroundSchema } = require('../schemas');
const Schema = mongoose.Schema;


const opts = {toJSON: {virtuals: true}};


const ImageSchema = new Schema ({
    url: String,
    filename: String
});


ImageSchema.virtual('thumbnail').get(function (){
    return this.url.replace('/upload', '/upload/w_200');
})


const CampgroundSchema = new Schema({
    title: String, 
    images:[ ImageSchema ],
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            require: true
        },
        coordinates:{
            type: [Number],
            required: true
        }
    },
    price: Number, 
    description: String,
    location: String,
    author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.name').get(function (){
    return this.title;
})

CampgroundSchema.virtual('properties.link').get(function (){
    return `campgrounds/${this._id}`;
})

CampgroundSchema.virtual('properties.description').get(function (){
    return this.description;
})


// Delete associated Reviews when campground is deleted
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id:{ $in: doc.reviews}
        })
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);