const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

const {campgroundSchema} = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground.js');


mongoose.connect('mongodb://127.0.0.1:27017/camp', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error: "));
db.once("open", ()=>{
    console.log("DB Ready!");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));


app.get('/', (req, res) =>{
    res.render('home');
});

// Validate incoming Campground data
const validateCampground = (req, res, next) =>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else{
        next();
    }
}


//Show all campgrounds
app.get('/campgrounds', async (req, res) =>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
});


//New campground form
app.get('/campgrounds/new', (req, res) =>{
    res.render('campgrounds/new');
});


//Add a new campground
app.post('/campgrounds/', validateCampground, catchAsync(async (req, res, next) =>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));


//Show one campground
app.get('/campgrounds/:id', async (req, res) =>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground});
});


//Edit an exsisting campground form
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) =>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground});
}));


//Edit an exsisting campground
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) =>{
    const{id} = req.params;
    await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${id}`);
}));


//Delete a campground
app.delete('/campgrounds/:id', catchAsync(async (req, res) =>{
    const{id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));


//Path not matched (404) 
app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found', 404));
});


//General Error Handler
app.use((err, req, res, next) =>{
    const {statusCode = 500} = err;

    if(!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', {err});
});



//Listen on port
app.listen(3000, ()=>{
    console.log('Port 3000')
});