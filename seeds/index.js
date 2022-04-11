const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");


mongoose.connect("mongodb://127.0.0.1:27017/camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 100) + 10;

    const camp = new Campground({
      location: `${cities[random].city}, ${cities[random].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      descreption:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo molestiae illo ducimus a cumque iusto nulla voluptates accusamus possimus soluta, libero tempora quidem? Voluptatem nisi est odit obcaecati totam! Doloribus.",
      price
    });

    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
