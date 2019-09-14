const loginCtl = {
  getLogin: (req, res) => {
    res.status(200).render("login", {
      title: "Login"
    });
  },

  postLogin: (req, res) => {
    req.flash("info", "Logged in successfully");
    res.status(200).redirect("/dashboard");
  }
};

module.exports = loginCtl;
