const pool =
    require("../db/database");


async function getAdminCustomers(req, res) {

    try {

        // -------------------------------------------------
        // Pagination
        // -------------------------------------------------

        const page =
            Math.max(
                parseInt(req.query.page) || 1,
                1
            );

        const limit =
            Math.min(
                Math.max(
                    parseInt(req.query.limit) || 20,
                    1
                ),
                100
            );

        const offset =
            (page - 1) * limit;


        // -------------------------------------------------
        // Search
        // -------------------------------------------------

        const search =
            req.query.search
                ? req.query.search.trim()
                : "";


        const conditions = [
            "c.role = 'customer'"
        ];

        const values = [];

        let parameterIndex = 1;


        if (search) {

            conditions.push(
                `
                (
                    c.first_name ILIKE $${parameterIndex}
                    OR c.last_name ILIKE $${parameterIndex}
                    OR c.phone ILIKE $${parameterIndex}
                )
                `
            );

            values.push(
                `%${search}%`
            );

            parameterIndex++;
        }


        const whereClause =
            `WHERE ${conditions.join(" AND ")}`;


        // -------------------------------------------------
        // Count
        // -------------------------------------------------

        const countResult =
            await pool.query(
                `
                SELECT
                    COUNT(*) AS total

                FROM customers c

                ${whereClause}
                `,
                values
            );


        const total =
            parseInt(
                countResult.rows[0].total
            );


        // -------------------------------------------------
        // Customers
        // -------------------------------------------------

        const customersResult =
            await pool.query(
                `
                SELECT
                    c.id,
                    c.first_name,
                    c.last_name,
                    c.phone,
                    c.phone_verified,
                    c.created_at

                FROM customers c

                ${whereClause}

                ORDER BY
                    c.created_at DESC,
                    c.id DESC

                LIMIT $${parameterIndex}
                OFFSET $${parameterIndex + 1}
                `,
                [
                    ...values,
                    limit,
                    offset
                ]
            );


        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(200).json({

            data:
                customersResult.rows,

            pagination: {

                page,

                limit,

                total,

                totalPages:
                    Math.ceil(
                        total / limit
                    )
            }

        });

    }
    catch (error) {

        console.error(
            "Admin get customers error:",
            error
        );

        return res.status(500).json({
            message:
                "خطایی در دریافت مشتری‌ها رخ داد."
        });
    }
}


module.exports = {
    getAdminCustomers
};