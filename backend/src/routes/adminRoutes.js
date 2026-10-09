const express = require("express");

const {
    getAdminSeries,
    getAdminSeriesById,
    createAdminSeries,
    updateAdminSeries,
    deleteAdminSeries
} = require("../controllers/adminSeriesController");

const {
    getAdminOrders,
    getAdminOrderById,
    getAdminDashboard,
    updateAdminOrderDeliveryStatus
} = require("../controllers/adminOrderController");

const authenticateToken =
    require("../middleware/authMiddleware");

const requireAdmin =
    require("../middleware/adminMiddleware");

const {
    getAdminCustomers
} = require("../controllers/adminCustomerController");

const {
    getAdminProducts,
    getAdminProductById,
    createAdminProduct,
    updateAdminProduct,
    deleteAdminProduct
} = require("../controllers/adminProductController");



const router =
    express.Router();

    router.get(
        "/dashboard",
        authenticateToken,
        requireAdmin,
        getAdminDashboard
    );
    
    
    router.get(
        "/orders",
        authenticateToken,
        requireAdmin,
        getAdminOrders
    );
    
    
    router.get(
        "/orders/:orderId",
        authenticateToken,
        requireAdmin,
        getAdminOrderById
    );
    
    
    router.get(
        "/customers",
        authenticateToken,
        requireAdmin,
        getAdminCustomers
    );

    router.get(
        "/products",
        authenticateToken,
        requireAdmin,
        getAdminProducts
    );

    router.get(
        "/products/:id",
        authenticateToken,
        requireAdmin,
        getAdminProductById
    );

    router.post(
        "/series/:seriesId/products",
        authenticateToken,
        requireAdmin,
        createAdminProduct
    );

    router.patch(
        "/products/:id",
        authenticateToken,
        requireAdmin,
        updateAdminProduct
    );

    router.delete(
        "/products/:id",
        authenticateToken,
        requireAdmin,
        deleteAdminProduct
    );

    router.get(
        "/series",
        authenticateToken,
        requireAdmin,
        getAdminSeries
    );
    
    
    router.get(
        "/series/:id",
        authenticateToken,
        requireAdmin,
        getAdminSeriesById
    );
    
    
    router.post(
        "/series",
        authenticateToken,
        requireAdmin,
        createAdminSeries
    );
    
    
    router.patch(
        "/series/:id",
        authenticateToken,
        requireAdmin,
        updateAdminSeries
    );
    
    router.patch(
        "/orders/:orderId/delivery-status",
        authenticateToken,
        requireAdmin,
        updateAdminOrderDeliveryStatus
    );
    
    router.delete(
        "/series/:id",
        authenticateToken,
        requireAdmin,
        deleteAdminSeries
    );
module.exports = router;