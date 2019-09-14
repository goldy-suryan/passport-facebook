const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../model/user.model");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, username, pass, done) => {
      const { email, password } = req.body;
      User.findOne({ email }, (err, user) => {
        if (err) {
          req.flash("info", err);
          return done(err, false);
        }
        if (!user) {
          req.flash("info", "User doesn't exists");
          return done(null, false);
        }
        if (user) {
          // console.log("pass of callback", pass); req.body.password
          // console.log("user.password", user.password); bcrypted password from database
          bcrypt.compare(pass, user.password, (err, success) => {
            if (err) {
              req.flash("info", err);
              done(err, false);
            }
            if (success) {
              done(null, user);
            }
            if (!success) {
              req.flash("info", "password doesn't match");
              return done(null, false);
            }
          });
        }
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: "617600772023070",
      clientSecret: "20d494e69d42e75e57ff9db6170e9050",
      callbackURL: "http://localhost:8000/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"]
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({ facebookId: profile.id }, function (err, user) {
        if (err) {
          return cb(err);
        } else {
          console.log(profile, "user");
          return cb(null, user);
        }
      });
    }
  )
);
