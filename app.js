const express = require("express");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
let port = 3006;

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Connected to port : ${port}`);
});

app.get("/", (req, res) => {
  res.send("welcome 😃");
});

main()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

app.get("/listings", async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.post("/listings/new", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let details = await Listing.findById(id);
  res.render("listings/view.ejs", { details });
});

app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let details = await Listing.findById(id);
  res.render("listings/edit.ejs", { details });
});

app.patch("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let {
    location: formLocation,
    country: formCountry,
    description: formDescription,
    price: fromPrice,
  } = req.body;
  let newDetails = await Listing.findByIdAndUpdate(
    id,
    {
      location: formLocation,
      country: formCountry,
      description: formDescription,
      price: fromPrice,
    },
    { runValidators: true, new: true }
  );
  res.redirect("/listings");
});

app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deleteListings = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});
