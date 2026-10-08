const express = require("express");

const {
    getAllProducts,
    getProductById,
    searchProducts
} = require("../controllers/productController.js");

const router = express.Router();

router.get("/search", searchProducts);

router.get("/", getAllProducts);

router.get("/:id", getProductById);

module.exports = router;