const passport = require("passport");
const { Admin } = require("../models/Admin");
const bcrypt = require("bcrypt");
const saltRounds = 10;


const adminView = (req, res) => {
    if(req.isAuthenticated()) {
        res.redirect("/admin/dashboard");
    } else {
        res.redirect("/admin/login");
    }
}

const adminLoginView = (req, res) => {
    if(req.isAuthenticated()) {
        res.redirect("/admin/dashboard");
    } else {
        res.render("admin/admin_login");
    }
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
        res.render("admin/admin_dashboard", {user: req.user, pageName: "dashboard"});
    } else {
        res.redirect("/admin/login");
    }
    
}

const adminPost = (req, res) => {
    if(req.isAuthenticated()) {
        res.render("admin/admin_post", {user: req.user, pageName: "post"});
    } else {
        res.redirect("/admin/login");
    }
}

const adminAddPost = (req, res) => {
    if(req.isAuthenticated()) {
        res.render("admin/admin_add_post", {user: req.user, pageName: "post"});
    } else {
        res.redirect("/admin/login");
    } 
}

const adminAddedPost = (req, res) => {
    
    console.log(req.body.content);

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

const adminUsersView = (req, res) => {
    if(req.isAuthenticated()) {
        res.render("admin/admin_user", {pageName: "users"});
    } else {
        res.redirect("/admin/login");
    }
}



module.exports = {
    adminLoginView,
    adminLogin,
    adminDashboard,
    adminPost,
    adminLogout,
    adminView,
    adminUsersView,
    adminAddPost,
    adminAddedPost,
}