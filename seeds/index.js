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
  for (let i = 0; i < 100; i++) {
    const random = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;

    const camp = new Campground({
      author: '625f69744d89f77c16edce04',
      location: `${cities[random].city}, ${cities[random].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo molestiae illo ducimus a cumque iusto nulla voluptates accusamus possimus soluta, libero tempora quidem? Voluptatem nisi est odit obcaecati totam! Doloribus.",
      price,
      geometry: {
        type: "Point",
        coordinates: [
            cities[random].longitude,
            cities[random].latitude,
        ]
      },
      images: [
        {
            url:'https://res.cloudinary.com/di0kx3vu9/image/upload/v1650588209/CampingWebsite/cqvzi9rlcu7x5a46w0hf.jpg',
            filename : "CampingWebsite/cqvzi9rlcu7x5a46w0hf"
        }
      ]
    });
  

    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
