const Listing = require("../models/listing");

// Display all listings (Index route)
module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// Render form to create a new listing
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Handle creation of a new listing
module.exports.createNewListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // Attach current user as owner
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

// Show detailed view of a specific listing
module.exports.viewListing = async (req, res) => {
  let { id } = req.params;
  let details = await Listing.findById(id)
    .populate({
      path: "review",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!details) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/view.ejs", { details });
};

// Render form to edit an existing listing
module.exports.renderEditListing = async (req, res) => {
  let { id } = req.params;
  let details = await Listing.findById(id);
  res.render("listings/edit.ejs", { details });
};

// Handle update of an existing listing
module.exports.updateEditListing = async (req, res) => {
  let { id } = req.params;

  // If no new image is provided, retain the existing one
  if (!req.body.listing.image) {
    delete req.body.listing.image;
  }

  await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { runValidators: true, new: true }
  );

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

// Delete a listing
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
