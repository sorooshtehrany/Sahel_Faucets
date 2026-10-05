const express = require("express");

const {
    getAbout
} = require("../controllers/aboutController.js");

const router = express.Router();

router.get("/", getAbout);

module.exports = router;