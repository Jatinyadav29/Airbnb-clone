const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

router
  .route("/")
  .post(isLoggedIn, validateReview, wrapAsync(reviewController.creatingReview));

router
  .route("/:reviewId")
  .delete(
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deletingReview)
  );

module.exports = router;
