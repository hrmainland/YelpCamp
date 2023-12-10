const express = require("express");
const router = express.Router({ mergeParams: true })
const ExpressError = require("../utils/ExpressError")
const catchAsync = require("../utils/catchAsync")

const { reviewSchema } = require("../schemas.js")

const Campground = require("../models/campground")
const Review = require("../models/review")

const validateReview = (req, res, next) => {
    /// TODO add schema
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

router.post("/", validateReview, catchAsync(async (req, res) => {
    // const { id } = req.params
    const campground = await Campground.findById(req.params.id);
    // const campground = await new Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save()
    await review.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;