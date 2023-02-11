const passport = require("passport");
const { Admin } = require("../models/Admin");
const Post = require("../models/Post");
const User = require("../models/User");
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

        if(req.query.search) {

            Post.find({title: {$regex: req.query.search, $options: "i"}}, (err, posts) => {
                if(err) {
                    console.log(err);
                } else {
                    res.render("admin/admin_post", {pageName: "post", posts: posts});
                }
            })

        } else {
            Post.find({}, (err, posts) => {
                if(err) {
                    console.log(err);
                } else {
                    res.render("admin/admin_post", {pageName: "post", posts: posts});
                }
            })
        }

        
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

        if(req.query.search) {
            
            User.find({username: {$regex: req.query.search, $options: 'i'}}, (err, foundUsers) => {
                if(err) {
                    console.log(err);
                } else {
                    if(foundUsers) {
                        res.render("admin/admin_user", {pageName: "users", users: foundUsers});
                    }
                }
            })

        } else {
            User.find({}, (err, foundUsers) => {
                if(err) {
                    console.log(err);
                } else {
                    if(foundUsers) {
                        res.render("admin/admin_user", {pageName: "users", users: foundUsers});
                    }
                }
            })
        }
        
    } else {
        res.redirect("/admin/login");
    }
}

const adminDeletePost = (req, res) => {
    if(req.isAuthenticated()) {
        const postId = req.params.postId;

        Post.findByIdAndDelete(postId, (err) => {
            if(err) {
                console.log(err);
            } else {
                console.log("Successfully deleted post with ID: " + postId);

                res.redirect("/admin/dashboard/post");
            }
        })

    } else {
        res.redirect("/admin/login");
    }
}

const adminEditPost = (req, res) => {
    if(req.isAuthenticated()) {
        const postId = req.params.postId;

        Post.findById(postId, (err, foundPost) => {
            if(err) {
                console.log(err);
            } else {
                if(foundPost) {
                    
                    res.render("admin/admin_edit_post", {pageName: "post", post: foundPost});
                }
            }
        })
    } else {
        res.redirect("/admin/login");
    }
}

const adminEditSave = (req, res) => {
    if(req.isAuthenticated()) {

        upload(req, res, (err) => {
            if(err) {
                console.log(err);
            } else {
                if(req.file) {

                    const thumbnailPath = req.file.path;
                    const title = req.body.title;
                    const tags = req.body.tag;
                    const tagsArr = tags.split(",");
                    const content = req.body.content;
                    const postId = req.body.postId;

                    const updateField = {
                        title: title,
                        tags: tagsArr,
                        content: content,
                        img: thumbnailPath,
                    }

                    Post.findByIdAndUpdate(postId, updateField, (err) => {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log("Successfully updated post with ID: " + postId);
                            res.redirect("/admin/dashboard/post");
                        }
                    })

                } else {
        
                    const title = req.body.title;
                    const tags = req.body.tag;
                    const tagsArr = tags.split(",");
                    const content = req.body.content;
                    const postId = req.body.postId;

                    const updateField = {
                        title: title,
                        tags: tagsArr,
                        content: content,
                    }

                    Post.findByIdAndUpdate(postId, updateField, (err) => {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log("Successfully updated post with ID: " + postId);
                            res.redirect("/admin/dashboard/post");
                        }
                    })
                }
            }
        })

    } else {
        res.redirect("/admin/login");
    }
}

const adminAddUserView = (req, res) => {
    res.render("admin/admin_add_user", {pageName: "users"});
}

const adminAddUser = (req, res) => {
    if(req.isAuthenticated()) {
        const username = req.body.username;
        const fullname = req.body.fullname;
        const email = req.body.email;
        const password = req.body.password;

        bcrypt.hash(password, saltRounds, (err, hash) => {
            if(err) {
                console.log(err);
            } else {
                const newUser = new User({
                    username: username,
                    fullname: fullname,
                    email: email,
                    password: hash
                });

                newUser.save((err) => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Successfully add new user");
                        res.redirect("/admin/dashboard/users/add-user");
                    }
                })
            }


        })
    } else {
        res.redirect("/admin/login");
    }
}

const adminDeleteUser = (req, res) => {
    if(req.isAuthenticated()) {
        const userId = req.params.userId;

        User.findByIdAndDelete(userId, (err) => {
            if(err) {
                console.log(err);
            } else {
                console.log("Successfully deleted user with ID: " + userId);
                res.redirect("/admin/dashboard/users");
            }
        })
    }else {
        res.redirect("/admin/login");
    }
}

const adminEditUserView = (req, res) => {
    if(req.isAuthenticated()) {
    
    const userId = req.params.userId;

    User.findById(userId, (err, foundUser) => {

        if(err) {
            console.log(err);
        } else {
            if(foundUser) {
                res.render("admin/admin_edit_user", {pageName: "users", user: foundUser})
            }
        }

        
    })
    

    } else {
        res.redirect("/admin/login");
    }
}

const adminEditUser = (req, res) => {
    if(req.isAuthenticated()) {

        const userId = req.params.userId;
        const username = req.body.username;
        const fullname = req.body.fullname;
        
        if(req.body.password) {
            const password = req.body.password;

            bcrypt.hash(password, saltRounds, (err, hash) => {

                const userField = {
                    username: username,
                    fullname: fullname,
                    password: hash,
                }

                User.findByIdAndUpdate(userId, userField, (err) => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Successfully updated user with ID: " + userId);
                        res.redirect("/admin/dashboard/users");
                    }
                })
            })
        } else {
            const userField = {
                username: username,
                fullname: fullname,
            }

            User.findByIdAndUpdate(userId, userField, (err) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Successfully updated user with ID: " + userId);
                    res.redirect("/admin/dashboard/users");
                }
            })

        }

    } else {
        res.redirect("/admin/login")
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
    adminDeletePost,
    adminEditPost,
    adminEditSave,
    adminAddUserView,
    adminAddUser,
    adminDeleteUser,
    adminEditUserView,
    adminEditUser,
}