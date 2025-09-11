const mongoose = require("mongoose");
const { type } = require("../schema");
const Review = require("./reviews.js");
const Schema = mongoose.Schema;

let defaultlink =
  "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const listingSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
    minLength: 10,
  },
  image: {
    filename: { type: String, default: "listingimage" },
    url: {
      type: String,
      default: defaultlink,
      set: (v) => (v === "" ? defaultlink : v),
    },
  },
  price: Number,
  location: String,
  country: String,
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.review } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
