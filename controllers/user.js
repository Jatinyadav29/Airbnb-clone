const User = require("../models/user.js");

// Render signup (registration) form
module.exports.renderRegisterForm = (req, res) => {
  res.render("users/signup.ejs");
};

// Handle new user registration
module.exports.registerUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });

    // Register user with hashed password (Passport-local-mongoose)
    const registeredUser = await User.register(newUser, password);

    // Automatically log in newly registered user
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Sign Up successful");
      res.redirect("/listings");
    });
  } catch (error) {
    // Handle registration errors (e.g., duplicate username/email)
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

// Render login form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// Handle user login
module.exports.loginUser = async (req, res) => {
  req.flash("success", "Login Successful");

  // Redirect to originally requested page or listings page
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// Handle user logout
module.exports.logoutUser = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out Successfully");
    res.redirect("/listings");
  });
};
