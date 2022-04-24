if (process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const campgroundRoutes = require('./routes/campgrounds');
const userRoutes = require('./routes/user');
const reviewsRoutes = require('./routes/reviews');
const passport = require ('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanatize = require('express-mongo-sanitize');


mongoose.connect('mongodb://127.0.0.1:27017/camp', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
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
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanatize());


const sessionConfig = {
    name: 'session',
    secret: 'ThisShouldBeHidden?',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,  
        maxAge:  1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware globals gain access on templates
app.use((req, res, next) => {
    res.locals.currentUser= req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


//Use campground routes 
app.use('/campgrounds', campgroundRoutes);

//Use reviews routes 
app.use('/campgrounds/:id/reviews', reviewsRoutes);

//Use user routes 
app.use('/', userRoutes);


//Home
app.get('/', (req, res) =>{
    res.render('home');
});


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