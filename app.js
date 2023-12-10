const express = require("express");
const path = require("path");
const methodOverride = require('method-override')
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
// this is a model (like a class)
const ExpressError = require("./utils/ExpressError")
const catchAsync = require("./utils/catchAsync")

const campgroundRouter = require("./routes/campground.js")
const reviewRouter = require("./routes/review.js")

const app = express()

// fire up MONGOOSE
maingoose().catch(err => console.log(err));

// mongoose main function
async function maingoose() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log("Mongoose Connection Open")
}

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

app.use(flash())
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    next();
})
app.use(session(sessionConfig))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use("/campgrounds", campgroundRouter)
app.use("/campgrounds/:id/reviews/", reviewRouter)
app.use(express.static(path.join(__dirname, 'public')))


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine("ejs", ejsMate);

app.listen(3000, () => {
    console.log("Port open")
})

app.get("/", (req, res) => {
    res.render("home");
})

app.all('*', (req, res) => {
    throw new ExpressError("Page Not Found", 404)
})

// this is the error handler
app.use((err, req, res, next) => {
    if (!err.statusCode) err.statusCode = 500;
    // res.status(statusCode).send(`<h1>${message}</h1>`)
    res.status(err.statusCode).render("error", { err })
})