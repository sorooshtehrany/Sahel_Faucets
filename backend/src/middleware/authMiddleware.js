const jwt = require("jsonwebtoken");

require("dotenv").config();


function authenticateToken(req, res, next) {

    try {

        const authHeader = req.headers.authorization;

        // --------------------------------
        // Authorization header not found
        // --------------------------------

        if (!authHeader) {

            return res.status(401).json({
                message: "توکن احراز هویت ارسال نشده است."
            });

        }


        // --------------------------------
        // Expected format:
        //
        // Authorization: Bearer TOKEN
        // --------------------------------

        const parts = authHeader.split(" ");

        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer"
        ) {

            return res.status(401).json({
                message: "فرمت توکن نامعتبر است."
            });

        }


        const token = parts[1];


        // --------------------------------
        // Verify JWT
        // --------------------------------

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // --------------------------------
        // Store customer information
        // --------------------------------

        req.customerId = decoded.customerId;
        req.customerPhone = decoded.phone;


        // --------------------------------
        // Continue request
        // --------------------------------

        next();

    }

    catch (error) {

        console.error(
            "Authentication error:",
            error.message
        );

        return res.status(401).json({
            message: "توکن نامعتبر یا منقضی شده است."
        });

    }
}


module.exports = authenticateToken;