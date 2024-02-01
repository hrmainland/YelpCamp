if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const path = require("path");
const methodOverride = require('method-override')
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
// this is a model (like a class)
const ExpressError = require("./utils/ExpressError")

const User = require("./models/user")

const passport = require("passport")
const localStrategy = require("passport-local")


const campgroundRouter = require("./routes/campground.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

const app = express()

// fire up MONGOOSE
maingoose().catch(err => console.log(err));

// mongoose main function
async function maingoose() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log("Mongoose Connection Open")
}

// to pass into express-session object
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

// express-session object
app.use(session(sessionConfig))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use("/campgrounds", campgroundRouter)
app.use("/campgrounds/:id/reviews/", reviewRouter)
app.use("/", userRouter)
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
    res.status(err.statusCode).render("error", { err })
})