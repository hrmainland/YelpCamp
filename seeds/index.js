if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const cities = require("./cities");
const axios = require("axios");
const Campground = require("../models/campground");
const { places, descriptors } = require("./seedHelpers");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

if (process.env.NODE_ENV === "development") {
}

const OpenAI = require("openai");
const openai = new OpenAI();

const dbUrl =
  process.env.NODE_ENV === "development"
    ? "mongodb://127.0.0.1:27017/yelp-camp"
    : process.env.DB_URL;

const seedUserID =
  process.env.NODE_ENV === "development"
    ? "657ab48a47b179396c4c1371"
    : "65d683006e15276c03bfc593";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function gptDescription(campName, location) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: `Give me an example description of about 50 words for a campground named ${campName} which is in ${location}.\
        Do not mention the name of the campground and write it in the tone of a real user on a website like Yelp.`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content;
}

// fire up MONGOOSE
maingoose().catch((err) => console.log(err));

// mongoose main function
async function maingoose() {
  await mongoose.connect(dbUrl);
  console.log("Mongo Connection Open");
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

// call unsplash and return small image
async function seedImg() {
  try {
    const resp = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        client_id: "MjCwvRK2bsm_4VULttuNhqMgw9WVYQuliZF_9XeIkgY",
        collections: 1114848,
      },
    });
    return resp.data.urls.regular;
  } catch (err) {
    console.error(err);
  }
}

const seedDB = async () => {
  await Campground.deleteMany({});

  const shuffledLocations = shuffleArray(cities);

  for (let i = 0; i < 3; i++) {
    const price = Math.floor(Math.random() * 20) + 10;

    const location = `${shuffledLocations[i].city}, ${shuffledLocations[i].state}`;

    const geoData = await geocoder
      .forwardGeocode({
        query: location + ", Australia",
        limit: 1,
      })
      .send();

    const campName = `${sample(descriptors)} ${sample(places)}`;

    // seed data into campground
    const camp = new Campground({
      location,
      title: campName,
      author: seedUserID,
      // imageUrl: await seedImg(),
      images: [
        {
          url: await seedImg(),
          filename: "YelpCamp/ahfnenvca4tha00h2ubt",
        },
        // {
        //   url: await seedImg(),
        //   filename: "YelpCamp/ruyoaxgf72nzpi4y6cdi",
        // },
      ],
      geometry: geoData.body.features[0].geometry,
      description: await gptDescription(campName, location),
      price,
    });

    await camp.save();
  }
};

// seed DB returns a promise because it's an async function
// this closes the connection after it's done
seedDB().then(() => {
  console.log("Camps Seeded, closing Mongo Connection");
  mongoose.connection.close();
});
