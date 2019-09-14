const bcrypt = require("bcryptjs");
const User = require("../model/user.model");

const registerCtl = {
  getRegister: (req, res) => {
    res.status(200).render("register", {
      title: "Register"
    });
  },

  postRegister: (req, res) => {
    const { email, password } = req.body;
    const newUser = new User({ email, password });
    if (!email || !password) {
      req.flash("info", "All fields are neccessary");
      res.redirect("/register");
      return;
    }
    User.findOne({ email }, (err, user) => {
      if (err) {
        req.flash("info", err);
        res.redirect(req.headers.referer);
        return;
      }
      if (user) {
        req.flash("info", "User already exists");
        res.status(409).redirect("/register");
        return;
      }
      if (!user) {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            req.flash("info", err);
            res.redirect("/register");
            return;
          } else {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) {
                req.flash("info", err);
                res.redirect("/register");
                return;
              }
              newUser.password = hash;
              newUser.save(err => {
                if (err) {
                  throw err;
                }
                req.flash(
                  "info",
                  "Registered successfully, log in to continue"
                );
                res.redirect("/");
              });
            });
          }
        });
      }
    });
  }
};

module.exports = registerCtl;
