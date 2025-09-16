const express = require("express");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const flash = require("connect-flash");

const sessionOptions = {
  secret: "mysecretsessioncode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

//page not found
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Global error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("includes/error.ejs", { err });
});

// error handling
app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  res.status(statusCode).send(message);
});
