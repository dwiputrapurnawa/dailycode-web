const express = require("express");
const router = express.Router();
const { homeView, postView } = require("../controllers/home_controller")


router.get("/", homeView);
router.get("/post/:postId", postView);


module.exports = router;