const express = require("express");

const {

    register,
    verifyRegistrationCode,

    login,
    getMe,

    forgotPassword,
    verifyResetCode,
    resetPassword

} = require("../controllers/authController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register",register);
router.post("/verify-register-code", verifyRegistrationCode);
router.post("/login",login);
router.get("/me",authenticateToken,getMe);
router.post("/forgot-password",forgotPassword);
router.post( "/verify-reset-code", verifyResetCode );
router.post("/reset-password",resetPassword);


module.exports = router;