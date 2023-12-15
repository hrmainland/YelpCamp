const express = require("express");
const router = express.Router({ mergeParams: true })
const catchAsync = require("../utils/catchAsync")
const { validateReview } = require("../middleware")

const Campground = require("../models/campground")
const Review = require("../models/review")


router.post("/", validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    req.flash('success', `Successfully added review`)
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