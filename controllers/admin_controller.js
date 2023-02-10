const passport = require("passport");
const { Admin } = require("../models/Admin");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const multer = require("multer");

const thumbnailStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/thumbnails');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: thumbnailStorage }).single("thumbnail");


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
        Post.find({}, (err, posts) => {
            if(err) {
                console.log(err);
            } else {
                res.render("admin/admin_post", {user: req.user, pageName: "post", posts: posts});
            }
        })
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

const adminAddNewPost = (req, res) => {
    
    upload(req, res, (err) => {
        if(err) {
            console.log(err);
        } else {
            
            const title = req.body.title;
            const thumbnailPath = req.file.path;
            const content = req.body.content;
            const tagsRaw = req.body.tag;
            const tagsArr = tagsRaw.split(",");

            const newPost = new Post({
                title: title,
                content: content,
                img: thumbnailPath,
                author: req.user.fullname,
                tags: tagsArr,
            });

            newPost.save((err) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Successfully added new post");
                    res.redirect("/admin/dashboard/post/add-post");
                }
            });

        }
    })

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
    adminAddNewPost,
}