const express = require("express");
const router = express.Router()


const Campground = require("../models/campground")
const { campgroundSchema } = require("../schemas.js")
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")

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

router.get("/", catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index", { campgrounds })
}))

router.get("/new", (req, res) => {
    res.render("campgrounds/new")
})

router.get("/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    if (!campground) {
        req.flash("error", "Cant find that campground.")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show", { campground });
}))

router.post("/", validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', "Successfully added a new campground")
    res.redirect(`campgrounds/${campground.id}`)
}))

router.get("/:id/edit", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "Cant find that campground.")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", { campground })
}))

router.put("/:id", validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', `Successfully updated ${campground.title}`)
    res.redirect(`/campgrounds/${id}`)
}))

router.delete("/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', `Successfully deleted ${campground.title}`)
    res.redirect("/campgrounds");
}))

module.exports = router;