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
    if(req.isAuthenticated() && (req.user.role === "Admin" || req.user.role === "Super Admin")) {
        res.redirect("/admin/dashboard");
    } else {
        res.redirect("/admin/login");
    }
}

const adminLoginView = (req, res) => {
    if(req.isAuthenticated() && (req.user.role === "Admin" || req.user.role === "Super Admin")) {
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
    if(req.isAuthenticated() && (req.user.role === "Admin" || req.user.role === "Super Admin")) {

        let userCount = 0;
        let postCount = 0;

        Admin.findById(req.user.id, (err, foundUser) => {
            if(err) {
                console.log(err);
            } else {
                if(foundUser) {
                    User.countDocuments({}, (err, count) => {
                        if(err) {
                            console.log(err);
                        } else {
                            userCount = count;
            
                            Post.countDocuments({}, (err, count) => {
                                if(err) {
                                    console.log(err);
                                } else {
                                    postCount = count;
            
                                    res.render("admin/admin_dashboard", {user: foundUser, pageName: "dashboard", userCount: userCount, postCount: postCount});
                                }
                            })
            
                        }
                    })
                }
            }
        })

         

        
    } else {
        res.redirect("/admin/login");
    }
    
}

const adminPost = (req, res) => {
    if(req.isAuthenticated() && (req.user.role === "Admin" || req.user.role === "Super Admin")) {

            Post.find({}, (err, posts) => {
                if(err) {
                    console.log(err);
                } else {
                    res.render("admin/admin_post", {pageName: "post", posts: posts});
                }
            })

    } else {
        res.redirect("/admin/login");
    }
}

const adminAddPost = (req, res) => {
    if(req.isAuthenticated() && (req.user.role === "Admin" || req.user.role === "Super Admin")) {
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
    if(req.isAuthenticated() && (req.user.role === "Admin" || req.user.role === "Super Admin")) {

            User.find({}, (err, foundUsers) => {
                if(err) {
                    console.log(err);
                } else {
                    if(foundUsers) {
                        res.render("admin/admin_user", {pageName: "users", users: foundUsers});
                    }
                }
            })
        
    } else {
        res.redirect("/admin/login");
    }
}

const adminDeletePost = (req, res) => {
    if(req.isAuthenticated() && (req.user.role === "Admin" || req.user.role === "Super Admin")) {
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
    if(req.isAuthenticated() && (req.user.role === "Admin" || req.user.role === "Super Admin")) {
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
    if(req.isAuthenticated() && (req.user.role === "Admin" || req.user.role === "Super Admin")) {

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
    if(req.isAuthenticated() && req.user.role == "Admin") {
        res.render("admin/admin_add_user", {pageName: "users"});
    } else {
        res.redirect("/admin/login");
    }
    
}

const adminAddUser = (req, res) => {
    if(req.isAuthenticated() && (req.user.role === "Admin" || req.user.role === "Super Admin")) {
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
                    password: hash,
                    role: "User"
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
    if(req.isAuthenticated() && req.user.role == "Admin") {
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
    if(req.isAuthenticated() && req.user.role == "Admin") {
    
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
    if(req.isAuthenticated() && req.user.role == "Admin") {

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

const adminManagementView = (req, res) => {
    if(req.isAuthenticated() && (req.user.role === "Admin" || req.user.role === "Super Admin")) {

        Admin.findById(req.user.id, (err, foundUser) => {
            if(err) {
                console.log(err);
            } else {
                if(foundUser) {
                    Admin.find({}, (err, foundAdmins) => {
                        if(err) {
                            console.log(err);
                        } else {
                            if(foundAdmins) {
                                res.render("admin/admin_management", {pageName: "admin", admins: foundAdmins, user: foundUser});
                            }
                        }
                    })
                }
            }
        })

        

    } else {
        res.redirect("/admin/login");
    }
}

const adminManagementEditData = (req, res) => {
    if(req.isAuthenticated() && (req.user.role === "Admin" || req.user.role === "Super Admin")) {
        const email = req.body.email;
        const fullname = req.body.fullname;
        const role = req.body.role;
        const adminId = req.body.adminId;

        if(req.body.password) {
            const password = req.body.password;

            bcrypt.hash(password, saltRounds, (err, hash) => {
                const adminFields = {
                    email: email,
                    fullname: fullname,
                    password: hash,
                    role: role,
                };

                Admin.findByIdAndUpdate(adminId, adminFields, (err) => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Successfully updated admin with ID: " + adminId);
                        res.redirect("/admin/dashboard/admin-management")
                    }
                });
            });
        } else {
            const adminFields = {
                email: email,
                fullname: fullname,
                role: role,
            };

            Admin.findByIdAndUpdate(adminId, adminFields, (err) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Successfully updated admin with ID: " + adminId);
                    res.redirect("/admin/dashboard/admin-management")
                }
            })

        }
    }
}

const adminManagementAddNewAdmin = (req, res) => {
    if(req.isAuthenticated() && req.user.role === "Super Admin") {

        const email = req.body.email;
        const fullname = req.body.fullname;
        const role = req.body.role;
        const password = req.body.password;

        bcrypt.hash(password, saltRounds, (err, hash) => {
            const newAdmin = new Admin({
                email: email,
                fullname: fullname,
                password: hash,
                role: role,
            });

            newAdmin.save((err) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Successfully added new admin");
                    res.redirect("/admin/dashboard/admin-management");
                }
            })
        })

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
    adminDeletePost,
    adminEditPost,
    adminEditSave,
    adminAddUserView,
    adminAddUser,
    adminDeleteUser,
    adminEditUserView,
    adminEditUser,
    adminManagementView,
    adminManagementEditData,
    adminManagementAddNewAdmin,
}