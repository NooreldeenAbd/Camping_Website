const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground.js')

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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) =>{
    res.render('home');
})

app.get('/makecampground', async (req, res) =>{
    const camp = new Campground({title: 'My Backyeard', descreption: 'cheap camping !'});
    await camp.save();
    res.send(camp);
})

app.listen(3000, ()=>{
    console.log('Port 3000')
});