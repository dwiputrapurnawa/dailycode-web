const express = require("express");
const router = express.Router();
const { adminLoginView, adminLogin, adminDashboard, adminPost, adminLogout, adminView, adminUsersView, adminAddPost, adminAddNewPost } = require("../controllers/admin_controller");


router.get("/", adminView);
router.get("/login", adminLoginView);
router.post("/login", adminLogin);
router.get("/dashboard", adminDashboard);
router.get("/dashboard/post", adminPost);
router.get("/dashboard/post/add-post", adminAddPost);
router.post("/dashboard/post/add-post", adminAddNewPost);
router.get("/logout", adminLogout);
router.get("/dashboard/users", adminUsersView);

module.exports = router;