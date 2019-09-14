const express = require("express");
const loginRoute = express.Router();
const passport = require("passport");
const loginCtl = require("../controllers/login.ctl");

// Getting login page
loginRoute.get("/", loginCtl.getLogin);

// Posting login credentials
loginRoute.post(
  "/",
  (req, res, next) => {
    if (!req.body.email || !req.body.password) {
      req.flash("info", "please fill in all fields");
      res.redirect("/");
    } else {
      next();
    }
  },
  passport.authenticate("local-login", {
    failureFlash: true,
    passReqToCallback: true
  }),
  loginCtl.postLogin
);

module.exports = loginRoute;
