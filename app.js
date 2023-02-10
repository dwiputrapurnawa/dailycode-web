require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Admin } = require("../dailycode-web/models/Admin");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const cookieParser = require("cookie-parser");

const homeRoute = require("../dailycode-web/routes/home");
const adminRoute = require("../dailycode-web/routes/admin");

const app = express();



// Database Connect
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URI).then(() => {
    console.log("Database Connected");
});

// Server Config
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(cookieParser());

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        email: user.email,
        fullname: user.fullname
      });
    });
  });
  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
});

passport.use("admin-login", new LocalStrategy({usernameField: "email", passwordField: "password"},(email, password, cb) => {
    Admin.findOne({email: email}, (err, foundUser) => {
        if(err) {
            console.log(err);
            return cb(err);
        } else {
            if(foundUser) {
                    bcrypt.compare(password, foundUser.password, (err, result) => {
                        if(err) {
                            console.log(err);
                            return cb(err);
                        } else {
                            if(result === true) {
                                return cb(null, foundUser);
                            } else {
                                console.log("Incorrect username or password.");
                                return cb(null, false, { message: 'Incorrect username or password.' });
                            }
                        }
                    });
            } else {
                console.log("User not found");
                return cb(null, false, { message: 'User not found' });
            }
        }
    });
}));

app.use("/", homeRoute);
app.use("/admin", adminRoute);



app.listen(process.env.SERVER_PORT, () => {
    console.log("Server running on port " + process.env.SERVER_PORT);
})