const express = require("express");
const router = express.Router();
const { homeView } = require("../controllers/home_controller")


router.get("/", homeView);


module.exports = router;