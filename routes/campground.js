const express = require("express");
const router = express.Router();
const multer = require("multer")
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// const upload = multer({ dest: "uploads/" });

const catchAsync = require("../utils/catchAsync")
const campgrounds = require("../controllers/campgrounds")

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware")

router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
// .post(isLoggedIn, upload.single('image'), (req, res) => {
//     console.log(req.file);
//     console.log(req.body);
//     res.redirect("/")
// });

router.get("/new", isLoggedIn, campgrounds.renderNewCampground)

router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;