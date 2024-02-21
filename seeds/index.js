const mongoose = require("mongoose");
const cities = require('./cities');
const axios = require("axios");
const Campground = require("../models/campground")
const { places, descriptors } = require('./seedHelpers');

require('dotenv').config();
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


// fire up MONGOOSE
maingoose().catch(err => console.log(err));

// mongoose main function
async function maingoose() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log("Mongo Connection Open")
}

const sample = array => array[Math.floor(Math.random() * array.length)];

// call unsplash and return small image
async function seedImg() {
    try {
        const resp = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: "MjCwvRK2bsm_4VULttuNhqMgw9WVYQuliZF_9XeIkgY",
                collections: 1114848,
            },
        })
        return resp.data.urls.regular
    } catch (err) {
        console.error(err)
    }
}

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 25; i++) {
        const price = Math.floor(Math.random() * 20) + 10

        const loco = `${sample(cities).city}, ${sample(cities).state}, Australia`

        const geoData = await geocoder.forwardGeocode({
            query: loco,
            limit: 1
        }).send();



        // seed data into campground
        const camp = new Campground({
            location: loco,
            title: `${sample(descriptors)} ${sample(places)}`,
            author: '657ab48a47b179396c4c1371',
            // imageUrl: await seedImg(),
            images: [
                {
                    url: await seedImg(),
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
                },
                {
                    url: await seedImg(),
                    filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
                }
            ],
            geometry: geoData.body.features[0].geometry,
            // imageUrl: "https://images.unsplash.com/photo-1468221296755-1c53a9dbcd54?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            description:
                'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!',
            price
        })

        await camp.save()
    }
}

// seed DB returns a promise because it's an async function
// this closes the connection after it's done
seedDB().then(() => {
    console.log("Camps Seeded, closing Mongo Connection")
    mongoose.connection.close()
});