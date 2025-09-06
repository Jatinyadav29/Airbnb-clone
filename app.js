const express = require("express");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const expressLayouts = require("express-ejs-layouts");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");

let port = 3006;

app.use(expressLayouts);
app.set("layout", "layouts/boilerplate"); // default layout
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));

// Listning to port
app.listen(port, () => {
  console.log(`Connected to port : ${port}`);
});

// default route
app.get("/", (req, res) => {
  res.send("welcome 😃");
});

// connecting to mongoose
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

// All listings
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// Creating new Listings
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.post(
  "/listings/new",
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// Detailed View of listing
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let details = await Listing.findById(id);
    res.render("listings/view.ejs", { details });
  })
);

// Edit Listing
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let details = await Listing.findById(id);
    res.render("listings/edit.ejs", { details });
  })
);

app.patch(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
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
  })
);

app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deleteListings = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

//page not found
app.use((req, res, next) => {
  next(new expressError(404, "Page not found"));
});

// Global error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

// error Handeling
app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  res.statusCode(statusCode).send(message);
});
