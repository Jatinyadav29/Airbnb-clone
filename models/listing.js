const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let defaultlink =
  "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
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
  price: {
    type: Number,
    required: true,
    default: 1000,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: "India",
  },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
