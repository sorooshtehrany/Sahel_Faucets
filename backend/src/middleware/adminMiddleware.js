const pool = require("../db/database");


async function requireAdmin(req, res, next) {

    try {

        const result =
            await pool.query(
                `
                SELECT
                    role
                FROM customers
                WHERE id = $1
                `,
                [
                    req.customerId
                ]
            );


        // ---------------------------------------------
        // Customer not found
        // ---------------------------------------------

        if (result.rows.length === 0) {

            return res.status(401).json({
                message:
                    "کاربر پیدا نشد."
            });

        }


        const role =
            result.rows[0].role;


        // ---------------------------------------------
        // Admin check
        // ---------------------------------------------

        if (role !== "admin") {

            return res.status(403).json({
                message:
                    "دسترسی به این بخش مجاز نیست."
            });

        }


        // ---------------------------------------------
        // Store role
        // ---------------------------------------------

        req.role = role;


        next();

    }

    catch (error) {

        console.error(
            "Admin authorization error:",
            error
        );


        return res.status(500).json({
            message:
                "خطایی در بررسی سطح دسترسی رخ داد."
        });

    }

}


module.exports = requireAdmin;