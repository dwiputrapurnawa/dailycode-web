const express = require("express");
const router = express.Router();
const { adminLoginView, adminLogin, adminDashboard, adminPost, adminLogout } = require("../controllers/admin_controller");


router.get("/login", adminLoginView);
router.post("/login", adminLogin);
router.get("/dashboard", adminDashboard);
router.get("/dashboard/post", adminPost);
router.get("/logout", adminLogout);

module.exports = router;