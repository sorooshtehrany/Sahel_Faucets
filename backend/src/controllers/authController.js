const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const pool = require("../db/database");


// =====================================================
// Register
// =====================================================

async function register(req, res) {

    try {

        const {
            first_name,
            last_name,
            phone,
            password
        } = req.body;


        // -------------------------
        // Validate required fields
        // -------------------------

        if (
            !first_name ||
            !last_name ||
            !phone ||
            !password
        ) {

            return res.status(400).json({
                message: "تمام فیلدها الزامی هستند."
            });

        }


        // -------------------------
        // Validate password
        // -------------------------

        if (password.length < 6) {

            return res.status(400).json({
                message:
                    "رمز عبور باید حداقل ۶ کاراکتر باشد."
            });

        }



        // -------------------------
        // Check existing customer
        // -------------------------

        const existingCustomer =
            await pool.query(
                `
        SELECT
            id,
            first_name,
            last_name,
            phone,
            phone_verified
        FROM customers
        WHERE phone = $1
        `,
                [phone]
            );


        if (existingCustomer.rows.length > 0) {

            const customer =
                existingCustomer.rows[0];


            // -------------------------
            // Already verified
            // -------------------------

            if (customer.phone_verified) {

                return res.status(409).json({
                    message:
                        "این شماره موبایل قبلاً ثبت شده است."
                });

            }


            // -------------------------
            // Existing but not verified
            // -------------------------
            // Generate a new registration OTP

            const code =
                Math.floor(
                    100000 +
                    Math.random() * 900000
                ).toString();


            const expiresAt =
                new Date(
                    Date.now() + 5 * 60 * 1000
                );


            // -------------------------
            // Invalidate previous
            // registration codes
            // -------------------------

            await pool.query(
                `
        UPDATE password_reset_codes
        SET used = TRUE
        WHERE customer_id = $1
          AND purpose = 'registration'
          AND used = FALSE
        `,
                [customer.id]
            );


            // -------------------------
            // Save new registration OTP
            // -------------------------

            await pool.query(
                `
        INSERT INTO password_reset_codes
        (
            customer_id,
            code,
            expires_at,
            purpose
        )
        VALUES ($1, $2, $3, 'registration')
        `,
                [
                    customer.id,
                    code,
                    expiresAt
                ]
            );


            // -------------------------
            // Development only
            // -------------------------

            console.log(
                "================================="
            );

            console.log(
                "REGISTRATION OTP - EXISTING UNVERIFIED USER"
            );

            console.log(
                `Phone: ${customer.phone}`
            );

            console.log(
                `OTP: ${code}`
            );

            console.log(
                `Expires: ${expiresAt.toLocaleString()}`
            );

            console.log(
                "================================="
            );


            // -------------------------
            // Response
            // -------------------------

            return res.status(200).json({

                message:
                    "کد تأیید جدید به شماره موبایل شما ارسال شد.",

                customer: {
                    id: customer.id,
                    first_name: customer.first_name,
                    last_name: customer.last_name,
                    phone: customer.phone,
                    phone_verified: false
                }

            });

        }




        // -------------------------
        // Hash password
        // -------------------------

        const passwordHash =
            await bcrypt.hash(
                password,
                10
            );


        // -------------------------
        // Create customer
        // -------------------------

        const result =
            await pool.query(
                `
                INSERT INTO customers
                (
                    first_name,
                    last_name,
                    phone,
                    password_hash,
                    phone_verified
                )
                VALUES ($1, $2, $3, $4, FALSE)
                RETURNING
                    id,
                    first_name,
                    last_name,
                    phone,
                    phone_verified,
                    created_at
                `,
                [
                    first_name,
                    last_name,
                    phone,
                    passwordHash
                ]
            );


        const customer =
            result.rows[0];


        const customerId =
            customer.id;


        // -------------------------
        // Generate 6 digit OTP
        // -------------------------

        const code =
            Math.floor(
                100000 +
                Math.random() * 900000
            ).toString();


        // -------------------------
        // OTP expiration
        // -------------------------

        const expiresAt =
            new Date(
                Date.now() + 5 * 60 * 1000
            );


        // -------------------------
        // Invalidate previous
        // registration codes
        // -------------------------

        await pool.query(
            `
            UPDATE password_reset_codes
            SET used = TRUE
            WHERE customer_id = $1
              AND purpose = 'registration'
              AND used = FALSE
            `,
            [customerId]
        );


        // -------------------------
        // Save registration OTP
        // -------------------------

        await pool.query(
            `
            INSERT INTO password_reset_codes
            (
                customer_id,
                code,
                expires_at,
                purpose
            )
            VALUES ($1, $2, $3, 'registration')
            `,
            [
                customerId,
                code,
                expiresAt
            ]
        );


        // -------------------------
        // Development only
        // -------------------------

        console.log(
            "================================="
        );

        console.log(
            "REGISTRATION OTP"
        );

        console.log(
            `Phone: ${phone}`
        );

        console.log(
            `OTP: ${code}`
        );

        console.log(
            `Expires: ${expiresAt.toLocaleString()}`
        );

        console.log(
            "================================="
        );


        // -------------------------
        // Response
        // -------------------------

        return res.status(201).json({

            message:
                "کد تأیید به شماره موبایل شما ارسال شد.",

            customer: {
                id: customer.id,
                first_name: customer.first_name,
                last_name: customer.last_name,
                phone: customer.phone,
                phone_verified: customer.phone_verified
            }

        });

    }

    catch (error) {

        console.error(
            "Register error:",
            error
        );

        return res.status(500).json({
            message:
                "خطایی در ثبت‌نام رخ داد."
        });

    }
}

// =====================================================
// Verify Registration Code
// =====================================================

async function verifyRegistrationCode(req, res) {

    try {

        const {
            phone,
            code
        } = req.body;


        // -------------------------
        // Validate input
        // -------------------------

        if (!phone || !code) {

            return res.status(400).json({
                message:
                    "شماره موبایل و کد تأیید الزامی هستند."
            });

        }


        // -------------------------
        // Find customer
        // -------------------------

        const customerResult =
            await pool.query(
                `
                SELECT
                    id,
                    first_name,
                    last_name,
                    phone,
                    phone_verified,
                    role
                FROM customers
                WHERE phone = $1
                `,
                [phone]
            );


        if (customerResult.rows.length === 0) {

            return res.status(400).json({
                message:
                    "اطلاعات ثبت‌نام نامعتبر است."
            });

        }


        const customer =
            customerResult.rows[0];


        // -------------------------
        // Already verified
        // -------------------------

        if (customer.phone_verified) {

            return res.status(400).json({
                message:
                    "این شماره موبایل قبلاً تأیید شده است."
            });

        }


        // -------------------------
        // Find valid registration OTP
        // -------------------------

        const codeResult =
            await pool.query(
                `
                SELECT
                    id,
                    code,
                    expires_at,
                    used
                FROM password_reset_codes
                WHERE customer_id = $1
                  AND code = $2
                  AND purpose = 'registration'
                  AND used = FALSE
                ORDER BY created_at DESC
                LIMIT 1
                `,
                [
                    customer.id,
                    code
                ]
            );


        if (codeResult.rows.length === 0) {

            return res.status(400).json({
                message:
                    "کد تأیید نادرست یا استفاده‌شده است."
            });

        }


        const registrationCode =
            codeResult.rows[0];


        // -------------------------
        // Check expiration
        // -------------------------

        if (
            new Date(registrationCode.expires_at)
            <= new Date()
        ) {

            return res.status(400).json({
                message:
                    "کد تأیید منقضی شده است."
            });

        }


        // -------------------------
        // Verify phone
        // -------------------------

        await pool.query(
            `
            UPDATE customers
            SET phone_verified = TRUE
            WHERE id = $1
            `,
            [customer.id]
        );


        // -------------------------
        // Mark OTP as used
        // -------------------------

        await pool.query(
            `
            UPDATE password_reset_codes
            SET used = TRUE
            WHERE id = $1
            `,
            [registrationCode.id]
        );


        // -------------------------
        // Success
        // -------------------------

        return res.status(200).json({

            message:
                "شماره موبایل با موفقیت تأیید شد.",

            customer: {
                id: customer.id,
                first_name: customer.first_name,
                last_name: customer.last_name,
                phone: customer.phone,
                phone_verified: true,
                role: customer.role
            }

        });

    }

    catch (error) {

        console.error(
            "Verify registration code error:",
            error
        );

        return res.status(500).json({
            message:
                "خطایی در تأیید شماره موبایل رخ داد."
        });

    }
}

// =====================================================
// Login
// =====================================================

async function login(req, res) {

    try {

        const {
            phone,
            password
        } = req.body;


        // -------------------------
        // Validate input
        // -------------------------

        if (!phone || !password) {

            return res.status(400).json({
                message: "شماره موبایل و رمز عبور الزامی هستند."
            });

        }


        // -------------------------
        // Find customer
        // -------------------------

        const result = await pool.query(
            `
            SELECT
                id,
                first_name,
                last_name,
                phone,
                password_hash,
                phone_verified,
                role
            FROM customers
            WHERE phone = $1
            `,
            [phone]
        );


        // -------------------------
        // Customer not found
        // -------------------------

        if (result.rows.length === 0) {

            return res.status(401).json({
                message: "شماره موبایل یا رمز عبور اشتباه است."
            });

        }


        const customer = result.rows[0];


        // -------------------------
        // Compare password
        // -------------------------

        const passwordValid = await bcrypt.compare(
            password,
            customer.password_hash
        );


        if (!passwordValid) {

            return res.status(401).json({
                message: "شماره موبایل یا رمز عبور اشتباه است."
            });

        }


        // -------------------------
        // Check phone verification
        // -------------------------

        if (!customer.phone_verified) {

            return res.status(403).json({
                message:
                    "شماره موبایل شما هنوز تأیید نشده است."
            });

        }



        // -------------------------
        // Create JWT
        // -------------------------

        const token = jwt.sign(

            {
                customerId: customer.id,
                phone: customer.phone
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );


        // -------------------------
        // Response
        // -------------------------

        return res.status(200).json({

            message: "ورود با موفقیت انجام شد.",

            token,

            customer: {
                id: customer.id,
                first_name: customer.first_name,
                last_name: customer.last_name,
                phone: customer.phone,
                phone_verified: customer.phone_verified,
                role: customer.role
            }

        });

    }

    catch (error) {

        console.error(
            "Login error:",
            error
        );

        return res.status(500).json({
            message: "خطایی در ورود رخ داد."
        });

    }
}

async function getMe(req, res) {

    try {

        const result = await pool.query(
            `
            SELECT
                id,
                first_name,
                last_name,
                phone,
                phone_verified,
                created_at,
                role
            FROM customers
            WHERE id = $1
            `,
            [req.customerId]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "کاربر پیدا نشد."
            });

        }


        return res.status(200).json({
            customer: result.rows[0]
        });

    }

    catch (error) {

        console.error(
            "Get customer error:",
            error
        );

        return res.status(500).json({
            message: "خطایی در دریافت اطلاعات کاربر رخ داد."
        });

    }
}


// =====================================================
// Forgot Password
// =====================================================

async function forgotPassword(req, res) {

    try {

        const {
            phone
        } = req.body;


        // -------------------------
        // Validate phone
        // -------------------------

        if (!phone) {

            return res.status(400).json({
                message: "شماره موبایل الزامی است."
            });

        }


        // -------------------------
        // Find customer
        // -------------------------

        const customerResult = await pool.query(
            `
            SELECT
                id
            FROM customers
            WHERE phone = $1
            `,
            [phone]
        );


        /*
         * برای جلوگیری از مشخص شدن وجود یا عدم وجود
         * شماره موبایل، در هر دو حالت پیام یکسان می‌دهیم.
         */

        if (customerResult.rows.length === 0) {

            return res.status(200).json({
                message:
                    "اگر این شماره موبایل ثبت شده باشد، کد بازیابی ارسال خواهد شد."
            });

        }


        const customerId =
            customerResult.rows[0].id;


        // -------------------------
        // Generate 6 digit OTP
        // -------------------------

        const code =
            Math.floor(
                100000 +
                Math.random() * 900000
            ).toString();


        // -------------------------
        // OTP expiration
        // -------------------------

        const expiresAt =
            new Date(
                Date.now() + 5 * 60 * 1000
            );


        // -------------------------
        // Invalidate previous codes
        // -------------------------

        await pool.query(
            `
            UPDATE password_reset_codes
            SET used = TRUE
            WHERE customer_id = $1
            AND purpose = 'password_reset'
            AND used = FALSE
            `,
            [customerId]
        );


        // -------------------------
        // Save new OTP
        // -------------------------

        await pool.query(
            `
            INSERT INTO password_reset_codes
            (
                customer_id,
                code,
                expires_at,
                purpose
            )
            VALUES ($1, $2, $3, 'password_reset')
            `,
            [
                customerId,
                code,
                expiresAt
            ]
        );


        // -------------------------
        // Development only
        // -------------------------

        console.log(
            "================================="
        );

        console.log(
            "PASSWORD RESET OTP"
        );

        console.log(
            `Phone: ${phone}`
        );

        console.log(
            `OTP: ${code}`
        );

        console.log(
            `Expires: ${expiresAt.toLocaleString()}`
        );

        console.log(
            "================================="
        );


        // -------------------------
        // Response
        // -------------------------

        return res.status(200).json({

            message:
                "اگر این شماره موبایل ثبت شده باشد، کد بازیابی ارسال خواهد شد."

        });

    }

    catch (error) {

        console.error(
            "Forgot password error:",
            error
        );

        return res.status(500).json({
            message:
                "خطایی در درخواست بازیابی رمز عبور رخ داد."
        });

    }
}


// =====================================================
// Verify Reset Code
// =====================================================

async function verifyResetCode(req, res) {

    try {

        const {
            phone,
            code
        } = req.body;


        // -------------------------
        // Validate input
        // -------------------------

        if (!phone || !code) {

            return res.status(400).json({
                message:
                    "شماره موبایل و کد بازیابی الزامی هستند."
            });

        }


        // -------------------------
        // Find customer
        // -------------------------

        const customerResult = await pool.query(
            `
            SELECT
                id
            FROM customers
            WHERE phone = $1
            `,
            [phone]
        );


        if (customerResult.rows.length === 0) {

            return res.status(400).json({
                message:
                    "کد بازیابی نامعتبر است."
            });

        }


        const customerId =
            customerResult.rows[0].id;


        // -------------------------
        // Find valid OTP
        // -------------------------

        const codeResult = await pool.query(
            `
            SELECT
                id,
                code,
                expires_at,
                used
            FROM password_reset_codes
            WHERE customer_id = $1
                AND code = $2
                AND purpose = 'password_reset'
                AND used = FALSE
            ORDER BY created_at DESC
            LIMIT 1
            `,
            [
                customerId,
                code
            ]
        );


        if (codeResult.rows.length === 0) {

            return res.status(400).json({
                message:
                    "کد بازیابی نادرست است."
            });

        }


        const resetCode =
            codeResult.rows[0];


        // -------------------------
        // Check expiration
        // -------------------------

        if (
            new Date(resetCode.expires_at)
            <= new Date()
        ) {

            return res.status(400).json({
                message:
                    "کد بازیابی منقضی شده است."
            });

        }


        // -------------------------
        // Success
        // -------------------------

        return res.status(200).json({

            message:
                "کد بازیابی صحیح است."

        });

    }

    catch (error) {

        console.error(
            "Verify reset code error:",
            error
        );

        return res.status(500).json({
            message:
                "خطایی در بررسی کد بازیابی رخ داد."
        });

    }
}

// =====================================================
// Reset Password
// =====================================================

async function resetPassword(req, res) {

    try {

        const {
            phone,
            code,
            new_password
        } = req.body;


        // -------------------------
        // Validate input
        // -------------------------

        if (
            !phone ||
            !code ||
            !new_password
        ) {

            return res.status(400).json({
                message:
                    "شماره موبایل، کد بازیابی و رمز عبور جدید الزامی هستند."
            });

        }


        // -------------------------
        // Validate password
        // -------------------------

        if (new_password.length < 6) {

            return res.status(400).json({
                message:
                    "رمز عبور باید حداقل ۶ کاراکتر باشد."
            });

        }


        // -------------------------
        // Find customer
        // -------------------------

        const customerResult = await pool.query(
            `
            SELECT
                id
            FROM customers
            WHERE phone = $1
            `,
            [phone]
        );


        if (customerResult.rows.length === 0) {

            return res.status(400).json({
                message:
                    "اطلاعات بازیابی نامعتبر است."
            });

        }


        const customerId =
            customerResult.rows[0].id;


        // -------------------------
        // Find valid OTP
        // -------------------------

        const codeResult = await pool.query(
            `
            SELECT
                id,
                code,
                expires_at,
                used
            FROM password_reset_codes
            WHERE customer_id = $1
              AND code = $2
              AND purpose = 'password_reset'
              AND used = FALSE
            ORDER BY created_at DESC
            LIMIT 1
            `,
            [
                customerId,
                code
            ]
        );


        if (codeResult.rows.length === 0) {

            return res.status(400).json({
                message:
                    "کد بازیابی نادرست یا استفاده‌شده است."
            });

        }


        const resetCode =
            codeResult.rows[0];


        // -------------------------
        // Check expiration
        // -------------------------

        if (
            new Date(resetCode.expires_at)
            <= new Date()
        ) {

            return res.status(400).json({
                message:
                    "کد بازیابی منقضی شده است."
            });

        }


        // -------------------------
        // Hash new password
        // -------------------------

        const passwordHash =
            await bcrypt.hash(
                new_password,
                10
            );


        // -------------------------
        // Update password
        // -------------------------

        await pool.query(
            `
            UPDATE customers
            SET password_hash = $1
            WHERE id = $2
            `,
            [
                passwordHash,
                customerId
            ]
        );


        // -------------------------
        // Mark OTP as used
        // -------------------------

        await pool.query(
            `
            UPDATE password_reset_codes
            SET used = TRUE
            WHERE id = $1
            `,
            [
                resetCode.id
            ]
        );


        // -------------------------
        // Success
        // -------------------------

        return res.status(200).json({

            message:
                "رمز عبور با موفقیت تغییر کرد."

        });

    }

    catch (error) {

        console.error(
            "Reset password error:",
            error
        );

        return res.status(500).json({
            message:
                "خطایی در تغییر رمز عبور رخ داد."
        });

    }
}


module.exports = {
    register,
    verifyRegistrationCode,
    login,
    getMe,
    forgotPassword,
    verifyResetCode,
    resetPassword
};

