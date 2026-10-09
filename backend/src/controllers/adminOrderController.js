const pool =
    require("../db/database");


    async function getAdminOrders(req, res) {

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
            // Filters
            // -------------------------------------------------
    
            const {
                status,
                paymentStatus,
                deliveryStatus,
                customerId,
                search,
                dateFrom,
                dateTo
            } = req.query;
    
    
            const conditions = [];
            const values = [];
    
            let parameterIndex = 1;
    
    
            // -------------------------------------------------
            // Legacy order status
            // -------------------------------------------------
    
            if (status) {
    
                conditions.push(
                    `o.status = $${parameterIndex}`
                );
    
                values.push(status);
    
                parameterIndex++;
            }
    
    
            // -------------------------------------------------
            // Payment status
            // -------------------------------------------------
    
            if (paymentStatus) {
    
                conditions.push(
                    `o.payment_status = $${parameterIndex}`
                );
    
                values.push(paymentStatus);
    
                parameterIndex++;
            }
    
    
            // -------------------------------------------------
            // Delivery status
            // -------------------------------------------------
    
            if (deliveryStatus) {
    
                conditions.push(
                    `o.delivery_status = $${parameterIndex}`
                );
    
                values.push(deliveryStatus);
    
                parameterIndex++;
            }
    
    
            // -------------------------------------------------
            // Customer ID
            // -------------------------------------------------
    
            if (customerId) {
    
                const parsedCustomerId =
                    parseInt(customerId);
    
                if (
                    Number.isNaN(
                        parsedCustomerId
                    )
                ) {
    
                    return res.status(400).json({
                        message:
                            "شناسه مشتری نامعتبر است."
                    });
                }
    
                conditions.push(
                    `o.customer_id = $${parameterIndex}`
                );
    
                values.push(
                    parsedCustomerId
                );
    
                parameterIndex++;
            }
    
    
            // -------------------------------------------------
            // Search
            // -------------------------------------------------
    
            if (search && search.trim()) {
    
                const searchValue =
                    search.trim();
    
                conditions.push(
                    `(
                        c.first_name ILIKE $${parameterIndex}
                        OR
                        c.last_name ILIKE $${parameterIndex}
                        OR
                        c.phone ILIKE $${parameterIndex}
                        OR
                        CAST(o.id AS TEXT) ILIKE $${parameterIndex}
                    )`
                );
    
                values.push(
                    `%${searchValue}%`
                );
    
                parameterIndex++;
            }
    
    
            // -------------------------------------------------
            // Date From
            // -------------------------------------------------
    
            if (dateFrom) {
    
                const fromDate =
                    new Date(dateFrom);
    
                if (
                    Number.isNaN(
                        fromDate.getTime()
                    )
                ) {
    
                    return res.status(400).json({
                        message:
                            "تاریخ شروع نامعتبر است."
                    });
                }
    
                conditions.push(
                    `o.created_at >= $${parameterIndex}`
                );
    
                values.push(
                    dateFrom
                );
    
                parameterIndex++;
            }
    
    
            // -------------------------------------------------
            // Date To
            // -------------------------------------------------
    
            if (dateTo) {
    
                const toDate =
                    new Date(dateTo);
    
                if (
                    Number.isNaN(
                        toDate.getTime()
                    )
                ) {
    
                    return res.status(400).json({
                        message:
                            "تاریخ پایان نامعتبر است."
                    });
                }
    
                conditions.push(
                    `o.created_at < ($${parameterIndex}::date + INTERVAL '1 day')`
                );
    
                values.push(
                    dateTo
                );
    
                parameterIndex++;
            }
    
    
            // -------------------------------------------------
            // Where
            // -------------------------------------------------
    
            const whereClause =
                conditions.length > 0
                    ? `WHERE ${conditions.join(" AND ")}`
                    : "";
    
    
            // -------------------------------------------------
            // Count
            // -------------------------------------------------
    
            const countResult =
                await pool.query(
                    `
                    SELECT
                        COUNT(*) AS total
    
                    FROM orders o
    
                    INNER JOIN customers c
                        ON c.id = o.customer_id
    
                    ${whereClause}
                    `,
                    values
                );
    
    
            const total =
                parseInt(
                    countResult.rows[0].total
                );
    
    
            // -------------------------------------------------
            // Orders
            // -------------------------------------------------
    
            const ordersResult =
                await pool.query(
                    `
                    SELECT
                        o.id,
                        o.customer_id,
    
                        c.first_name,
                        c.last_name,
                        c.phone,
    
                        o.total_amount,
    
                        o.status,
                        o.payment_status,
                        o.delivery_status,
    
                        o.delivery_address,
    
                        TO_CHAR(
                            o.created_at,
                            'YYYY-MM-DD HH24:MI:SS.MS'
                        ) AS created_at,
                        
                        TO_CHAR(
                            o.paid_at,
                            'YYYY-MM-DD HH24:MI:SS.MS'
                        ) AS paid_at
    
                    FROM orders o
    
                    INNER JOIN customers c
                        ON c.id = o.customer_id
    
                    ${whereClause}
    
                    ORDER BY
                        o.created_at DESC,
                        o.id DESC
    
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
                    ordersResult.rows,
    
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
                "Admin get orders error:",
                error
            );
    
            return res.status(500).json({
                message:
                    "خطایی در دریافت سفارش‌ها رخ داد."
            });
        }
    }

async function getAdminOrderById(req, res) {

    try {

        const orderId =
            parseInt(req.params.orderId);


        // -------------------------------------------------
        // Validate order id
        // -------------------------------------------------

        if (Number.isNaN(orderId)) {

            return res.status(400).json({
                message:
                    "شناسه سفارش نامعتبر است."
            });
        }


        // -------------------------------------------------
        // Get order + customer
        // -------------------------------------------------

        const orderResult =
            await pool.query(
                `
                SELECT
                    o.id,
                    o.customer_id,
                    o.total_amount,
            
                    o.status,
                    o.payment_status,
                    o.delivery_status,
            
                    o.delivery_address,
            
                    TO_CHAR(
                        o.created_at,
                        'YYYY-MM-DD HH24:MI:SS.MS'
                    ) AS created_at,

                    TO_CHAR(
                        o.paid_at,
                        'YYYY-MM-DD HH24:MI:SS.MS'
                    ) AS paid_at,

                    c.first_name,
                    c.last_name,
                    c.phone

                FROM orders o

                INNER JOIN customers c
                    ON c.id = o.customer_id

                WHERE o.id = $1
                `,
                [orderId]
            );


        if (orderResult.rows.length === 0) {

            return res.status(404).json({
                message:
                    "سفارش پیدا نشد."
            });
        }


        const order =
            orderResult.rows[0];


        // -------------------------------------------------
        // Get order items
        // -------------------------------------------------

        const itemsResult =
            await pool.query(
                `
                SELECT
                    id,
                    product_id,
                    product_name,
                    unit_price,
                    quantity,
                    total_price

                FROM order_items

                WHERE order_id = $1

                ORDER BY id ASC
                `,
                [orderId]
            );


        // -------------------------------------------------
        // Get latest payment
        // -------------------------------------------------

        const paymentResult =
            await pool.query(
                `
                SELECT
                    id,
                    amount,
                    status,
                    authority,
                    reference_id,
                    gateway,
                    created_at,
                    paid_at

                FROM payments

                WHERE order_id = $1

                ORDER BY id DESC

                LIMIT 1
                `,
                [orderId]
            );


        const payment =
            paymentResult.rows.length > 0
                ? paymentResult.rows[0]
                : null;


        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(200).json({

            order: {

                id:
                    order.id,
            
                status:
                    order.status,
            
                payment_status:
                    order.payment_status,
            
                delivery_status:
                    order.delivery_status,
            
                delivery_address:
                    order.delivery_address,
            
                total_amount:
                    order.total_amount,
            
                created_at:
                    order.created_at,
            
                paid_at:
                    order.paid_at
            },


            customer: {

                id:
                    order.customer_id,

                first_name:
                    order.first_name,

                last_name:
                    order.last_name,

                phone:
                    order.phone
            },


            items:
                itemsResult.rows,


            payment

        });

    }
    catch (error) {

        console.error(
            "Admin get order details error:",
            error
        );

        return res.status(500).json({
            message:
                "خطایی در دریافت جزئیات سفارش رخ داد."
        });
    }
}

async function updateAdminOrderDeliveryStatus(req, res) {
    const client = await pool.connect();

    try {
        const orderId = Number(req.params.orderId);
        const { delivery_status } = req.body;

        // Validate order ID
        if (
            !Number.isInteger(orderId) ||
            orderId <= 0
        ) {
            return res.status(400).json({
                message: "شناسه سفارش نامعتبر است."
            });
        }

        // Validate delivery status
        const allowedStatuses = [
            "pending",
            "preparing",
            "shipped",
            "delivered",
            "cancelled"
        ];

        if (!allowedStatuses.includes(delivery_status)) {
            return res.status(400).json({
                message: "وضعیت تحویل نامعتبر است."
            });
        }

        await client.query("BEGIN");

        // Lock the order while updating its delivery status
        const orderResult = await client.query(
            `
            SELECT
                id,
                status,
                payment_status,
                delivery_status
            FROM orders
            WHERE id = $1
            FOR UPDATE
            `,
            [orderId]
        );

        if (orderResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "سفارش پیدا نشد."
            });
        }

        const order = orderResult.rows[0];

        // Only successfully paid orders can be processed for delivery
        if (order.payment_status !== "paid") {
            await client.query("ROLLBACK");

            return res.status(409).json({
                message:
                    "وضعیت تحویل فقط برای سفارش پرداخت‌شده قابل تغییر است."
            });
        }

        // Do not change a terminal delivery status
        if (
            order.delivery_status === "delivered" ||
            order.delivery_status === "cancelled"
        ) {
            await client.query("ROLLBACK");

            return res.status(409).json({
                message:
                    "وضعیت تحویل این سفارش نهایی شده و قابل تغییر نیست."
            });
        }

        // Enforce the delivery workflow
        const allowedTransitions = {
            pending: ["preparing", "cancelled"],
            preparing: ["shipped", "cancelled"],
            shipped: ["delivered"]
        };

        const currentStatus = order.delivery_status;
        const nextStatuses =
            allowedTransitions[currentStatus] || [];

        if (!nextStatuses.includes(delivery_status)) {
            await client.query("ROLLBACK");

            return res.status(409).json({
                message:
                    "تغییر وضعیت تحویل به این مرحله مجاز نیست."
            });
        }

        const updateResult = await client.query(
            `
            UPDATE orders
            SET delivery_status = $1
            WHERE id = $2
            RETURNING
                id,
                status,
                payment_status,
                delivery_status
            `,
            [delivery_status, orderId]
        );

        await client.query("COMMIT");

        return res.status(200).json({
            message: "وضعیت تحویل سفارش با موفقیت تغییر کرد.",
            order: updateResult.rows[0]
        });
    }
    catch (error) {
        await client.query("ROLLBACK");

        console.error(
            "Admin update delivery status error:",
            error
        );

        return res.status(500).json({
            message:
                "خطایی هنگام تغییر وضعیت تحویل رخ داد."
        });
    }
    finally {
        client.release();
    }
}

async function getAdminDashboard(req, res) {

    try {

        // -------------------------------------------------
        // Order statistics
        // -------------------------------------------------

        const orderStatsResult =
            await pool.query(
                `
                SELECT

                    COUNT(*) AS total_orders,

                    COUNT(*) FILTER (
                        WHERE status = 'paid'
                    ) AS paid_orders,

                    COUNT(*) FILTER (
                        WHERE status = 'pending'
                    ) AS pending_orders,

                    COUNT(*) FILTER (
                        WHERE status = 'failed'
                    ) AS failed_orders,

                    COUNT(*) FILTER (
                        WHERE status = 'cancelled'
                    ) AS cancelled_orders,

                    COALESCE(
                        SUM(total_amount)
                        FILTER (
                            WHERE status = 'paid'
                        ),
                        0
                    ) AS total_sales

                FROM orders
                `
            );


        // -------------------------------------------------
        // Customer count
        // -------------------------------------------------

        const customerResult =
            await pool.query(
                `
                SELECT
                    COUNT(*) AS total_customers

                FROM customers

                WHERE role = 'customer'
                `
            );


        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        const orderStats =
            orderStatsResult.rows[0];

        const totalCustomers =
            customerResult.rows[0].total_customers;


        return res.status(200).json({

            orders: {

                total:
                    parseInt(
                        orderStats.total_orders
                    ),

                paid:
                    parseInt(
                        orderStats.paid_orders
                    ),

                pending:
                    parseInt(
                        orderStats.pending_orders
                    ),

                failed:
                    parseInt(
                        orderStats.failed_orders
                    ),

                cancelled:
                    parseInt(
                        orderStats.cancelled_orders
                    )
            },


            sales: {

                total:
                    orderStats.total_sales
            },


            customers: {

                total:
                    parseInt(
                        totalCustomers
                    )
            }

        });

    }
    catch (error) {

        console.error(
            "Admin dashboard error:",
            error
        );

        return res.status(500).json({
            message:
                "خطایی در دریافت اطلاعات داشبورد رخ داد."
        });
    }
}

module.exports = {
    getAdminOrders,
    getAdminOrderById,
    getAdminDashboard,
    updateAdminOrderDeliveryStatus
};