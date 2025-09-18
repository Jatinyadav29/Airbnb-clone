const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRediredtUrl } = require("../middleware.js");

//Register / SignUp
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

//Registering the user
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Sign Up successful");
        res.redirect("/listings");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  })
);

//Login / SignIn
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

//SignIn with user
router.post(
  "/login",
  saveRediredtUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
    req.flash("success", "Login Successful");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  })
);

router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out Successfuly");
    res.redirect("/listings");
  });
});

module.exports = router;
