const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listing.js");

router.route("/").get(wrapAsync(listingController.index));

router
  .route("/new")
  .get(isLoggedIn, listingController.renderNewForm)
  .post(
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createNewListing)
  );

router
  .route("/:id")
  .get(wrapAsync(listingController.viewListing))
  .delete(isLoggedIn, isOwner, listingController.deleteListing);

router
  .route("/:id/edit")
  .get(isLoggedIn, isOwner, wrapAsync(listingController.renderEditListing))
  .patch(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateEditListing)
  );

module.exports = router;
