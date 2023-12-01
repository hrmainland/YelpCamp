const express = require("express");
const path = require("path");
const methodOverride = require('method-override')
const mongoose = require("mongoose");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const Joi = require("joi");
// this is a model (like a class)
const { campgroundSchema } = require("./schemas.js")
const Campground = require("./models/campground")
const Review = require("./models/review")
const ExpressError = require("./utils/ExpressError")
const catchAsync = require("./utils/catchAsync")

const app = express()

// fire up MONGOOSE
maingoose().catch(err => console.log(err));

// mongoose main function
async function maingoose() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log("Mongoose Connection Open")
}

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

const validateCampground = (req, res, next) => {
    /// TODO add schema
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine("ejs", ejsMate);

app.listen(3000, () => {
    console.log("Port open")
})

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/campgrounds", catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index", { campgrounds })
}))

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new")
})

app.get("/campgrounds/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", { campground });
}))

app.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`)
}))

app.get("/campgrounds/:id/edit", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground })
}))

app.put("/campgrounds/:id", validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${id}`)
}))

app.delete("/campgrounds/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}))

app.post("/campgrounds/:id/reviews", catchAsync(async (req, res) => {
    // const { id } = req.params
    console.log(req.params)
    const campground = await Campground.findById(req.params.id);
    // const campground = await new Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save()
    await review.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.all('*', (req, res) => {
    throw new ExpressError("Page Not Found", 404)
})

// this is the error handler
app.use((err, req, res, next) => {
    const { message = "Error" } = err;
    if (!err.statusCode) err.statusCode = 500;
    // res.status(statusCode).send(`<h1>${message}</h1>`)
    res.status(err.statusCode).render("error", { err })
})