const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

// Validate Listing Middleware
const validateListing = (req, res, next) => {
  let validate = listingSchema.validate(req.body);
  if (validate.error) {
    let errMsg = validate.error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// All listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// Creating new Listings
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

router.post(
  "/new",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  })
);

// Detailed View of listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let details = await Listing.findById(id).populate("review");
    if (!details) {
      req.flash("error", "Listing does not exists");
      return res.redirect("/listings");
    }
    res.render("listings/view.ejs", { details });
  })
);

// Edit Listing
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let details = await Listing.findById(id);
    res.render("listings/edit.ejs", { details });
  })
);

router.patch(
  "/:id/edit",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    if (!req.body.listing.image) {
      delete req.body.listing.image;
    }

    let updatedListing = await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { runValidators: true, new: true }
    );
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  })
);

// delete listing
router.delete("/:id", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  let deleteListings = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
});

module.exports = router;
