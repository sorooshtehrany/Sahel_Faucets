const express = require("express");

const {
    getAllSeries,
    getSeriesById
} = require("../controllers/seriesController.js");

const router = express.Router();


/* =========================
   All Series
========================= */

router.get(
    "/",
    getAllSeries
);


/* =========================
   One Series
========================= */

router.get(
    "/:id",
    getSeriesById
);


module.exports = router;