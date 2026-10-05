const express = require("express");

const {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
} = require("../controllers/cartController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authenticateToken,
    getCart
);

router.post(
    "/items",
    authenticateToken,
    addToCart
);

router.patch(
    "/items/:productId",
    authenticateToken,
    updateCartItem
);

router.delete(
    "/items/:productId",
    authenticateToken,
    removeCartItem
);

router.delete(
    "/",
    authenticateToken,
    clearCart
);

module.exports = router;