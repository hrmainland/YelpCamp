const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Review = require("./review")

const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
    url: String,
    filename: String,
})

ImageSchema.virtual('thumbnail').get(function () {

    const re = /w=\d*/i;
    const modifiedUrl = this.url.replace(re, "w=200");
    return modifiedUrl.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
}, opts)

const bla = "bla"

CampgroundSchema.virtual('properties.id').get(function () {
    return `${this.id}`;
});
CampgroundSchema.virtual('properties.title').get(function () {
    return `${this.title}`;
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
})

module.exports = mongoose.model("Campground", CampgroundSchema);