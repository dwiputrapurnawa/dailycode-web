const passport = require("passport");
const { Admin } = require("../models/Admin");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const adminLoginView = (req, res) => {
    res.render("admin/admin_login");
}

const adminLogin = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const admin = new Admin({
        email: email,
        password: password,
    });

    req.login(admin, (err) => {
        if(err) {
            console.log(err);
        } else {
            passport.authenticate("admin-login", {failureRedirect: "/admin/login"})(req, res, () => {
                res.redirect("/admin/dashboard");
            });
        }
    });
}

const adminDashboard = (req, res) => {
    if(req.isAuthenticated()) {
        res.render("admin/admin_dashboard", {user: req.user});
    } else {
        res.redirect("/admin/login");
    }
    
}

const adminPost = (req, res) => {
    res.render("admin/admin_post");
}

const adminLogout = (req, res) => {
    req.logout((err) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/admin/login");
        }
    })
}

module.exports = {
    adminLoginView,
    adminLogin,
    adminDashboard,
    adminPost,
    adminLogout,
}