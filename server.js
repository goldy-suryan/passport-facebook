const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectMongo = require("connect-mongo")(session);
const flash = require("express-flash");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const path = require("path");
const port = process.env.PORT || 8000;
const app = express();
const loginRoute = require("./routes/login.route");
const registerRoute = require("./routes/register.route");

// DB Connection
mongoose.connect(
  "mongodb://goldy:goldy@test-shard-00-00-ifhka.mongodb.net:27017,test-shard-00-01-ifhka.mongodb.net:27017,test-shard-00-02-ifhka.mongodb.net:27017/test?ssl=true&replicaSet=test-shard-0&authSource=admin&retryWrites=true",
  { useNewUrlParser: true }
);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    store: new connectMongo({
      mongooseConnection: mongoose.connection
    })
  })
);
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
require("./auth/login");

// Routes
app.use("/", loginRoute);
app.use("/register", registerRoute);
app.get("/dashboard", isLoggedIn, (req, res) => {
  res.status(200).render("dashboard", {
    title: "Dashboard",
    user: req.user.email
  });
});
app.get("/auth/facebook", passport.authenticate("facebook"));

app.get("/auth/facebook/callback", (req, res) => {
  res.redirect("/dashboard");
});

app.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.redirect(req.headers.referer);
      } else {
        req.logOut();
        req.clearCookie("connect.sid");
        res.redirect("/");
      }
    });
  }
});

// Check for authentication
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

// Error handeling
app.use((req, res, next) => {
  const error = new Error("not Found");
  error.status = 404;
  next(error);
});
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message
    }
  });
});

app.listen(port, err => {
  if (err) {
    console.log("Error", err);
  }
  console.log(`http://localhost:${port}`);
});

// 617600772023070
// 20d494e69d42e75e57ff9db6170e9050
