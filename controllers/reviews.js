const Review = require("../models/reviews");
const Listing = require("../models/listing");

// Create a new review for a specific listing
module.exports.creatingReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  // Associate review with the currently logged-in user
  newReview.author = req.user._id;

  // Push review into the listing's review array
  listing.review.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "New Review Created");
  res.redirect(`/listings/${listing._id}`);
};

// Delete a specific review from a listing
module.exports.deletingReview = async (req, res) => {
  let { id, reviewId } = req.params;

  // Remove review reference from the listing
  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });

  // Delete the review document itself
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};
