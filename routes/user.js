const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRediredtUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

router
  .route("/signup")
  .get(userController.renderRegisterForm)
  .post(wrapAsync(userController.registerUser));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRediredtUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.loginUser)
  );

router.route("/logout").get(userController.logoutUser);

module.exports = router;
