const express = require("express");
const router = express.Router();
const { adminLoginView, adminLogin, adminDashboard, adminPost, adminLogout, adminView, adminUsersView, adminAddPost, adminAddNewPost, adminDeletePost, adminEditPost, adminEditSave, adminAddUserView, adminAddUser, adminDeleteUser, adminEditUserView, adminEditUser, adminManagementView, adminManagementEditData, adminManagementAddNewAdmin } = require("../controllers/admin_controller");


router.get("/", adminView);
router.get("/login", adminLoginView);
router.post("/login", adminLogin);
router.get("/dashboard", adminDashboard);
router.get("/dashboard/post", adminPost);
router.get("/dashboard/post/add-post", adminAddPost);
router.post("/dashboard/post/add-post", adminAddNewPost);
router.get("/logout", adminLogout);
router.get("/dashboard/users", adminUsersView);
router.post("/dashboard/post/delete/:postId", adminDeletePost);
router.get("/dashboard/post/edit/:postId", adminEditPost);
router.post("/dashboard/post/edit-post", adminEditSave);
router.get("/dashboard/users/add-user", adminAddUserView);
router.post("/dashboard/users/add-user", adminAddUser);
router.get("/dashboard/users/delete/:userId", adminDeleteUser);
router.get("/dashboard/users/edit/:userId", adminEditUserView);
router.post("/dashboard/users/edit/:userId", adminEditUser);
router.get("/dashboard/admin-management", adminManagementView);
router.post("/dashboard/admin-management/edit", adminManagementEditData);
router.post("/dashboard/admin-management/add-admin", adminManagementAddNewAdmin);

module.exports = router;