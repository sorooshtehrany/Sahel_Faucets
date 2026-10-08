const express = require("express");

const {
    createOrder,
    getPendingOrder,
    cancelPendingOrder,
    startPayment,
    testPaymentSuccess,
    testPaymentFailed
} = require("../controllers/orderController");

const authenticateToken =
    require("../middleware/authMiddleware");

const router =
    express.Router();

    router.get(
        "/pending",
        authenticateToken,
        getPendingOrder
    );
    
    router.post(
        "/pending/cancel",
        authenticateToken,
        cancelPendingOrder
    );
    
    router.post(
        "/:orderId/payment/start",
        authenticateToken,
        startPayment
    );
    
    router.post(
        "/:orderId/payment/test-success",
        authenticateToken,
        testPaymentSuccess
    );
    
    router.post(
        "/:orderId/payment/test-failed",
        authenticateToken,
        testPaymentFailed
    );
    
    router.post(
        "/",
        authenticateToken,
        createOrder
    );


module.exports = router;