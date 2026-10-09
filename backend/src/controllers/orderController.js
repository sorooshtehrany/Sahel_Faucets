const pool = require("../db/database");


// =====================================================
// Create / Update Pending Order From Cart
// =====================================================

async function createOrder(req, res) {

    const client =
        await pool.connect();

    let transactionStarted = false;

    try {

        const customerId =
            req.customerId;


        // -------------------------------------------------
        // Get delivery address
        // -------------------------------------------------

        const deliveryAddress =
            typeof req.body?.delivery_address === "string"
                ? req.body.delivery_address.trim()
                : "";


        // -------------------------------------------------
        // Validate delivery address
        // -------------------------------------------------

        if (!deliveryAddress) {

            return res.status(400).json({
                message:
                    "آدرس تحویل الزامی است."
            });
        }


        if (deliveryAddress.length > 1000) {

            return res.status(400).json({
                message:
                    "آدرس تحویل بیش از حد طولانی است."
            });
        }


        // -------------------------------------------------
        // BEGIN TRANSACTION
        // -------------------------------------------------

        await client.query("BEGIN");

        transactionStarted = true;


        // -------------------------------------------------
        // Get customer's cart
        // -------------------------------------------------

        const cartResult =
            await client.query(
                `
                SELECT
                    id

                FROM carts

                WHERE customer_id = $1

                FOR UPDATE
                `,
                [customerId]
            );


        if (
            cartResult.rows.length === 0
        ) {

            await client.query("ROLLBACK");

            transactionStarted = false;

            return res.status(404).json({
                message:
                    "سبد خرید شما پیدا نشد."
            });
        }


        const cartId =
            cartResult.rows[0].id;


        // -------------------------------------------------
        // Get cart items + lock products
        // -------------------------------------------------

        const itemsResult =
            await client.query(
                `
                SELECT

                    ci.product_id,
                    ci.quantity,

                    p.name_fa,
                    p.price,
                    p.stock,
                    p.is_active

                FROM cart_items ci

                INNER JOIN products p
                    ON p.id = ci.product_id

                WHERE ci.cart_id = $1

                FOR UPDATE OF p
                `,
                [cartId]
            );


        const items =
            itemsResult.rows;


        // -------------------------------------------------
        // Empty cart
        // -------------------------------------------------

        if (items.length === 0) {

            await client.query("ROLLBACK");

            transactionStarted = false;

            return res.status(400).json({
                message:
                    "سبد خرید شما خالی است."
            });
        }


        // -------------------------------------------------
        // Validate products + calculate total
        // -------------------------------------------------

        let totalAmount = 0;


        for (const item of items) {

            const stock =
                Number(item.stock);

            const quantity =
                Number(item.quantity);

            const price =
                Number(item.price);


            // ---------------------------------------------
            // Price check
            // ---------------------------------------------

            if (price <= 0) {

                await client.query("ROLLBACK");

                transactionStarted = false;

                return res.status(400).json({
                    message:
                        `قیمت محصول «${item.name_fa}» معتبر نیست.`
                });
            }


            // ---------------------------------------------
            // Product inactive
            // ---------------------------------------------

            if (!item.is_active) {

                await client.query("ROLLBACK");

                transactionStarted = false;

                return res.status(400).json({
                    message:
                        `محصول «${item.name_fa}» دیگر قابل سفارش نیست.`
                });
            }


            // ---------------------------------------------
            // Stock check
            // ---------------------------------------------

            if (stock <= 0) {

                await client.query("ROLLBACK");

                transactionStarted = false;

                return res.status(400).json({
                    message:
                        `محصول «${item.name_fa}» ناموجود است.`
                });
            }


            if (quantity > stock) {

                await client.query("ROLLBACK");

                transactionStarted = false;

                return res.status(400).json({
                    message:
                        `موجودی محصول «${item.name_fa}» کافی نیست. حداکثر ${stock} عدد موجود است.`
                });
            }


            // ---------------------------------------------
            // Calculate item total
            // ---------------------------------------------

            const itemTotal =
                price * quantity;


            totalAmount += itemTotal;
        }


        if (totalAmount <= 0) {

            await client.query("ROLLBACK");

            transactionStarted = false;

            return res.status(400).json({
                message:
                    "مبلغ سفارش باید بیشتر از صفر باشد."
            });
        }


        // -------------------------------------------------
        // Check existing pending order
        // -------------------------------------------------

        const pendingOrderResult =
            await client.query(
                `
                SELECT

                    id,
                    customer_id,
                    total_amount,
                    status,
                    delivery_address,
                    payment_status,
                    delivery_status,
                    created_at

                FROM orders

                WHERE customer_id = $1
                  AND status = 'pending'

                ORDER BY id DESC

                LIMIT 1

                FOR UPDATE
                `,
                [customerId]
            );


        // =================================================
        // EXISTING PENDING ORDER
        // =================================================

        if (
            pendingOrderResult.rows.length > 0
        ) {

            const existingOrder =
                pendingOrderResult.rows[0];


            // ---------------------------------------------
            // Check pending payment
            // ---------------------------------------------

            const pendingPaymentResult =
                await client.query(
                    `
                    SELECT
                        id

                    FROM payments

                    WHERE order_id = $1
                      AND status = 'pending'

                    LIMIT 1

                    FOR UPDATE
                    `,
                    [existingOrder.id]
                );


            if (
                pendingPaymentResult.rows.length > 0
            ) {

                await client.query("ROLLBACK");

                transactionStarted = false;

                return res.status(400).json({
                    message:
                        "پرداخت این سفارش قبلاً آغاز شده است و امکان ویرایش آن وجود ندارد."
                });
            }


            // ---------------------------------------------
            // Remove old order items
            // ---------------------------------------------

            await client.query(
                `
                DELETE FROM order_items

                WHERE order_id = $1
                `,
                [existingOrder.id]
            );


            // ---------------------------------------------
            // Create new order items from current cart
            // ---------------------------------------------

            for (const item of items) {

                const price =
                    Number(item.price);

                const quantity =
                    Number(item.quantity);

                const itemTotal =
                    price * quantity;


                await client.query(
                    `
                    INSERT INTO order_items (
                        order_id,
                        product_id,
                        product_name,
                        unit_price,
                        quantity,
                        total_price
                    )

                    VALUES (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6
                    )
                    `,
                    [
                        existingOrder.id,
                        item.product_id,
                        item.name_fa,
                        price,
                        quantity,
                        itemTotal
                    ]
                );
            }


            // ---------------------------------------------
            // Update order
            // ---------------------------------------------

            const updatedOrderResult =
                await client.query(
                    `
                    UPDATE orders

                    SET
                        total_amount = $1,
                        delivery_address = $2

                    WHERE id = $3

                    RETURNING
                        id,
                        customer_id,
                        total_amount,
                        status,
                        delivery_address,
                        payment_status,
                        delivery_status,
                        created_at
                    `,
                    [
                        totalAmount,
                        deliveryAddress,
                        existingOrder.id
                    ]
                );


            const updatedOrder =
                updatedOrderResult.rows[0];


            // ---------------------------------------------
            // COMMIT
            // ---------------------------------------------

            await client.query("COMMIT");

            transactionStarted = false;


            // ---------------------------------------------
            // Response
            // ---------------------------------------------

            return res.status(200).json({

                message:
                    "سفارش در حال پرداخت با موفقیت به‌روزرسانی شد.",

                existing: true,

                updated: true,

                order: {

                    id:
                        updatedOrder.id,

                    customer_id:
                        updatedOrder.customer_id,

                    total_amount:
                        Number(
                            updatedOrder.total_amount
                        ),

                    status:
                        updatedOrder.status,

                    delivery_address:
                        updatedOrder.delivery_address,

                    payment_status:
                        updatedOrder.payment_status,

                    delivery_status:
                        updatedOrder.delivery_status,

                    created_at:
                        updatedOrder.created_at
                }

            });
        }


        // =================================================
        // CREATE NEW ORDER
        // =================================================

        const orderResult =
            await client.query(
                `
                INSERT INTO orders (
                    customer_id,
                    total_amount,
                    status,
                    delivery_address,
                    payment_status,
                    delivery_status
                )

                VALUES (
                    $1,
                    $2,
                    'pending',
                    $3,
                    'pending',
                    'pending'
                )

                RETURNING
                    id,
                    customer_id,
                    total_amount,
                    status,
                    delivery_address,
                    payment_status,
                    delivery_status,
                    created_at
                `,
                [
                    customerId,
                    totalAmount,
                    deliveryAddress
                ]
            );


        const order =
            orderResult.rows[0];


        // -------------------------------------------------
        // Create order items
        // -------------------------------------------------

        for (const item of items) {

            const price =
                Number(item.price);

            const quantity =
                Number(item.quantity);

            const itemTotal =
                price * quantity;


            await client.query(
                `
                INSERT INTO order_items (
                    order_id,
                    product_id,
                    product_name,
                    unit_price,
                    quantity,
                    total_price
                )

                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                )
                `,
                [
                    order.id,
                    item.product_id,
                    item.name_fa,
                    price,
                    quantity,
                    itemTotal
                ]
            );
        }


        // -------------------------------------------------
        // COMMIT
        // -------------------------------------------------

        await client.query("COMMIT");

        transactionStarted = false;


        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(201).json({

            message:
                "سفارش با موفقیت ایجاد شد.",

            existing: false,

            updated: false,

            order: {

                id:
                    order.id,

                customer_id:
                    order.customer_id,

                total_amount:
                    Number(
                        order.total_amount
                    ),

                status:
                    order.status,

                delivery_address:
                    order.delivery_address,

                payment_status:
                    order.payment_status,

                delivery_status:
                    order.delivery_status,

                created_at:
                    order.created_at
            }

        });

    }
    catch (error) {

        if (transactionStarted) {

            try {

                await client.query("ROLLBACK");

            }
            catch (rollbackError) {

                console.error(
                    "Rollback error:",
                    rollbackError
                );
            }
        }


        console.error(
            "Create/update order error:",
            error
        );


        return res.status(500).json({
            message:
                "خطایی در ایجاد یا به‌روزرسانی سفارش رخ داد."
        });

    }
    finally {

        client.release();

    }
}


// =====================================================
// Get Pending Order
// =====================================================

async function getPendingOrder(req, res) {

    try {

        const customerId =
            req.customerId;


        // -------------------------------------------------
        // Get pending order
        // -------------------------------------------------

        const orderResult =
            await pool.query(
                `
                SELECT
                    id,
                    customer_id,
                    total_amount,
                    status,
                    delivery_address,
                    payment_status,
                    delivery_status,
                    created_at

                FROM orders

                WHERE customer_id = $1
                  AND status = 'pending'

                ORDER BY id DESC

                LIMIT 1
                `,
                [customerId]
            );


        // -------------------------------------------------
        // No pending order
        // -------------------------------------------------

        if (
            orderResult.rows.length === 0
        ) {

            return res.status(200).json({

                order: null,

                payment: null

            });

        }


        const order =
            orderResult.rows[0];


        // -------------------------------------------------
        // Get pending payment
        // -------------------------------------------------

        const paymentResult =
            await pool.query(
                `
                SELECT
                    id,
                    order_id,
                    amount,
                    status,
                    gateway,
                    authority,
                    reference_id,
                    created_at,
                    paid_at

                FROM payments

                WHERE order_id = $1
                  AND status = 'pending'

                ORDER BY id DESC

                LIMIT 1
                `,
                [
                    order.id
                ]
            );


        let payment = null;


        if (
            paymentResult.rows.length > 0
        ) {

            const paymentRow =
                paymentResult.rows[0];


            payment = {

                id:
                    paymentRow.id,

                order_id:
                    paymentRow.order_id,

                amount:
                    Number(
                        paymentRow.amount
                    ),

                status:
                    paymentRow.status,

                gateway:
                    paymentRow.gateway,

                authority:
                    paymentRow.authority,

                reference_id:
                    paymentRow.reference_id,

                created_at:
                    paymentRow.created_at,

                paid_at:
                    paymentRow.paid_at

            };

        }


        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(200).json({

            order: {

                id:
                    order.id,

                customer_id:
                    order.customer_id,

                total_amount:
                    Number(
                        order.total_amount
                    ),

                status:
                    order.status,

                delivery_address:
                    order.delivery_address,

                payment_status:
                    order.payment_status,

                delivery_status:
                    order.delivery_status,

                created_at:
                    order.created_at

            },

            payment

        });

    }
    catch (error) {

        console.error(
            "Get pending order error:",
            error
        );


        return res.status(500).json({

            message:
                "خطایی در دریافت سفارش در حال تکمیل رخ داد."

        });

    }
}


// =====================================================
// Cancel Pending Order
// =====================================================

async function cancelPendingOrder(req, res) {

    const client =
        await pool.connect();

    let transactionStarted = false;

    try {

        const customerId =
            req.customerId;


        // -------------------------------------------------
        // BEGIN TRANSACTION
        // -------------------------------------------------

        await client.query("BEGIN");

        transactionStarted = true;


        // -------------------------------------------------
        // Get and lock pending order
        // -------------------------------------------------

        const orderResult =
            await client.query(
                `
                SELECT
                    id,
                    customer_id,
                    total_amount,
                    status,
                    delivery_address,
                    payment_status,
                    delivery_status,
                    created_at,
                    paid_at

                FROM orders

                WHERE customer_id = $1
                  AND status = 'pending'

                FOR UPDATE
                `,
                [
                    customerId
                ]
            );


        if (orderResult.rows.length === 0) {

            await client.query("ROLLBACK");
            transactionStarted = false;

            return res.status(404).json({
                message:
                    "سفارش در انتظار پیدا نشد."
            });

        }


        const order =
            orderResult.rows[0];


        // -------------------------------------------------
        // Validate payment status
        // -------------------------------------------------

        if (order.payment_status !== "pending") {

            await client.query("ROLLBACK");
            transactionStarted = false;

            return res.status(409).json({
                message:
                    "وضعیت پرداخت این سفارش اجازه لغو آن را نمی‌دهد."
            });

        }


        // -------------------------------------------------
        // Cancel pending payments
        // -------------------------------------------------

        const paymentResult =
            await client.query(
                `
                UPDATE payments

                SET
                    status = 'cancelled'

                WHERE order_id = $1
                  AND status = 'pending'

                RETURNING
                    id,
                    order_id,
                    amount,
                    status,
                    gateway,
                    authority,
                    reference_id,
                    created_at,
                    paid_at
                `,
                [
                    order.id
                ]
            );


        // -------------------------------------------------
        // Cancel order
        // -------------------------------------------------

        const updateOrderResult =
            await client.query(
                `
                UPDATE orders

                SET
                    status = 'cancelled',
                    delivery_status = 'cancelled'

                WHERE id = $1
                  AND customer_id = $2
                  AND status = 'pending'
                  AND payment_status = 'pending'

                RETURNING
                    id,
                    customer_id,
                    total_amount,
                    status,
                    delivery_address,
                    payment_status,
                    delivery_status,
                    created_at,
                    paid_at
                `,
                [
                    order.id,
                    customerId
                ]
            );


        if (updateOrderResult.rows.length === 0) {

            await client.query("ROLLBACK");
            transactionStarted = false;

            return res.status(409).json({
                message:
                    "وضعیت سفارش دیگر قابل لغو نیست."
            });

        }


        const updatedOrder =
            updateOrderResult.rows[0];


        // -------------------------------------------------
        // COMMIT
        // -------------------------------------------------

        await client.query("COMMIT");

        transactionStarted = false;


        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(200).json({

            message:
                "سفارش با موفقیت لغو شد.",

            order:
                updatedOrder,

            payments:
                paymentResult.rows
        });


    } catch (error) {

        if (transactionStarted) {

            await client.query("ROLLBACK");
        }

        console.error(
            "cancelPendingOrder error:",
            error
        );

        return res.status(500).json({
            message:
                "خطا در لغو سفارش."
        });

    } finally {

        client.release();
    }
}


// =====================================================
// Start Payment
// =====================================================

async function startPayment(req, res) {

    const client =
        await pool.connect();

    let transactionStarted = false;


    try {

        const customerId =
            req.customerId;

        const orderId =
            Number(req.params.orderId);


        // -------------------------------------------------
        // Validate order ID
        // -------------------------------------------------

        if (
            !Number.isInteger(orderId) ||
            orderId <= 0
        ) {

            return res.status(400).json({

                message:
                    "شناسه سفارش نامعتبر است."

            });
        }


        // -------------------------------------------------
        // BEGIN TRANSACTION
        // -------------------------------------------------

        await client.query("BEGIN");

        transactionStarted = true;


        // -------------------------------------------------
        // Get and lock order
        // -------------------------------------------------

        const orderResult =
            await client.query(
                `
                SELECT
                    id,
                    customer_id,
                    total_amount,
                    status,
                    created_at

                FROM orders

                WHERE id = $1
                  AND customer_id = $2

                FOR UPDATE
                `,
                [
                    orderId,
                    customerId
                ]
            );


        if (
            orderResult.rows.length === 0
        ) {

            await client.query("ROLLBACK");

            transactionStarted = false;

            return res.status(404).json({

                message:
                    "سفارش پیدا نشد."

            });
        }


        const order =
            orderResult.rows[0];


        // -------------------------------------------------
        // Order must be pending
        // -------------------------------------------------

        if (
            order.status !== "pending"
        ) {

            await client.query("ROLLBACK");

            transactionStarted = false;

            return res.status(400).json({

                message:
                    "این سفارش دیگر در وضعیت قابل پرداخت نیست."

            });
        }


        // -------------------------------------------------
        // Check existing pending payment
        // -------------------------------------------------

        const paymentResult =
            await client.query(
                `
                SELECT
                    id,
                    amount,
                    status,
                    gateway,
                    created_at

                FROM payments

                WHERE order_id = $1
                  AND status = 'pending'

                LIMIT 1

                FOR UPDATE
                `,
                [orderId]
            );


        // -------------------------------------------------
        // Payment already started
        // -------------------------------------------------

        if (
            paymentResult.rows.length > 0
        ) {

            await client.query("ROLLBACK");

            transactionStarted = false;

            return res.status(400).json({

                message:
                    "پرداخت این سفارش قبلاً آغاز شده است و امکان ویرایش آن وجود ندارد."

            });
        }


        // -------------------------------------------------
        // Create pending payment
        // -------------------------------------------------

        const newPaymentResult =
            await client.query(
                `
                INSERT INTO payments (
                    order_id,
                    amount,
                    status,
                    gateway
                )

                VALUES (
                    $1,
                    $2,
                    'pending',
                    'test'
                )

                RETURNING
                    id,
                    order_id,
                    amount,
                    status,
                    gateway,
                    created_at
                `,
                [
                    order.id,
                    order.total_amount
                ]
            );


        const payment =
            newPaymentResult.rows[0];


        // -------------------------------------------------
        // COMMIT
        // -------------------------------------------------

        await client.query("COMMIT");

        transactionStarted = false;


        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(201).json({

            message:
                "پرداخت با موفقیت آغاز شد.",

            payment: {

                id:
                    payment.id,

                order_id:
                    payment.order_id,

                amount:
                    Number(
                        payment.amount
                    ),

                status:
                    payment.status,

                gateway:
                    payment.gateway,

                created_at:
                    payment.created_at

            }

        });

    }
    catch (error) {

        if (transactionStarted) {

            try {

                await client.query(
                    "ROLLBACK"
                );

            }
            catch (rollbackError) {

                console.error(
                    "Rollback error:",
                    rollbackError
                );

            }
        }


        console.error(
            "Start payment error:",
            error
        );


        return res.status(500).json({

            message:
                "خطایی در شروع پرداخت رخ داد."

        });

    }
    finally {

        client.release();

    }
}


// =====================================================
// Test Payment Success
// =====================================================

// =====================================================
// Test Payment Success
// =====================================================

async function testPaymentSuccess(req, res) {

    const client =
        await pool.connect();

    let transactionStarted = false;

    try {

        const customerId =
            req.customerId;

        const orderId =
            Number(req.params.orderId);


        // -------------------------------------------------
        // Validate order id
        // -------------------------------------------------

        if (
            !Number.isInteger(orderId) ||
            orderId <= 0
        ) {

            return res.status(400).json({
                message:
                    "شناسه سفارش نامعتبر است."
            });
        }


        // -------------------------------------------------
        // BEGIN TRANSACTION
        // -------------------------------------------------

        await client.query("BEGIN");

        transactionStarted = true;


        // -------------------------------------------------
        // Get and lock order
        // -------------------------------------------------

        const orderResult =
            await client.query(
                `
                SELECT
                    id,
                    customer_id,
                    total_amount,
                    status,
                    payment_status,
                    delivery_status,
                    created_at,
                    paid_at

                FROM orders

                WHERE id = $1
                  AND customer_id = $2

                FOR UPDATE
                `,
                [
                    orderId,
                    customerId
                ]
            );


        if (orderResult.rows.length === 0) {

            await client.query("ROLLBACK");

            transactionStarted = false;

            return res.status(404).json({
                message:
                    "سفارش پیدا نشد."
            });
        }


        const order =
            orderResult.rows[0];


        // -------------------------------------------------
        // Order must be pending
        // -------------------------------------------------

        if (order.status !== "pending") {

            await client.query("ROLLBACK");

            transactionStarted = false;

            return res.status(400).json({
                message:
                    "این سفارش دیگر در وضعیت قابل پرداخت نیست."
            });
        }


        // -------------------------------------------------
        // Payment status must be pending
        // -------------------------------------------------

        if (
            order.payment_status !== "pending"
        ) {

            await client.query("ROLLBACK");

            transactionStarted = false;

            return res.status(400).json({
                message:
                    "وضعیت پرداخت این سفارش قابل تکمیل نیست."
            });
        }


        // -------------------------------------------------
        // Get and lock pending payment
        // -------------------------------------------------

        const paymentResult =
            await client.query(
                `
                SELECT
                    id,
                    order_id,
                    amount,
                    status,
                    gateway,
                    authority,
                    reference_id,
                    paid_at

                FROM payments

                WHERE order_id = $1
                  AND status = 'pending'

                ORDER BY id DESC

                LIMIT 1

                FOR UPDATE
                `,
                [
                    orderId
                ]
            );


        if (paymentResult.rows.length === 0) {

            await client.query("ROLLBACK");

            transactionStarted = false;

            return res.status(400).json({
                message:
                    "برای این سفارش پرداخت در حال انجامی وجود ندارد."
            });
        }


        const payment =
            paymentResult.rows[0];


        // -------------------------------------------------
        // Validate payment amount
        // -------------------------------------------------

        if (
            Number(payment.amount) !==
            Number(order.total_amount)
        ) {

            await client.query("ROLLBACK");

            transactionStarted = false;

            return res.status(400).json({
                message:
                    "مبلغ پرداخت با مبلغ سفارش مطابقت ندارد."
            });
        }


        // -------------------------------------------------
        // Get order items
        // -------------------------------------------------

        const orderItemsResult =
            await client.query(
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

                FOR UPDATE
                `,
                [
                    orderId
                ]
            );


        if (orderItemsResult.rows.length === 0) {

            await client.query("ROLLBACK");

            transactionStarted = false;

            return res.status(400).json({
                message:
                    "سفارش هیچ آیتمی ندارد."
            });
        }


        // -------------------------------------------------
        // Decrease stock
        // -------------------------------------------------

        for (
            const item
            of orderItemsResult.rows
        ) {

            const stockResult =
                await client.query(
                    `
                    UPDATE products

                    SET stock =
                        stock - $1

                    WHERE id = $2
                      AND stock >= $1
                      AND is_active = true

                    RETURNING
                        id,
                        stock
                    `,
                    [
                        item.quantity,
                        item.product_id
                    ]
                );


            if (
                stockResult.rows.length === 0
            ) {

                await client.query("ROLLBACK");

                transactionStarted = false;

                return res.status(400).json({
                    message:
                        `موجودی محصول «${item.product_name}» کافی نیست.`
                });
            }
        }


        // -------------------------------------------------
        // Mark payment as paid
        // -------------------------------------------------

        const paidAt =
            new Date();


        const updatedPaymentResult =
            await client.query(
                `
                UPDATE payments

                SET
                    status = 'paid',
                    paid_at = $1

                WHERE id = $2

                RETURNING
                    id,
                    order_id,
                    amount,
                    status,
                    gateway,
                    authority,
                    reference_id,
                    created_at,
                    paid_at
                `,
                [
                    paidAt,
                    payment.id
                ]
            );


        // -------------------------------------------------
        // Mark order as paid
        // -------------------------------------------------

        const updatedOrderResult =
            await client.query(
                `
                UPDATE orders

                SET
                    status = 'paid',
                    payment_status = 'paid',
                    delivery_status = 'pending',
                    paid_at = $1

                WHERE id = $2
                  AND status = 'pending'
                  AND payment_status = 'pending'

                RETURNING
                    id,
                    customer_id,
                    total_amount,
                    status,
                    delivery_address,
                    payment_status,
                    delivery_status,
                    created_at,
                    paid_at
                `,
                [
                    paidAt,
                    orderId
                ]
            );


        // -------------------------------------------------
        // Safety check
        // -------------------------------------------------

        if (
            updatedOrderResult.rows.length === 0
        ) {

            await client.query("ROLLBACK");

            transactionStarted = false;

            return res.status(409).json({
                message:
                    "وضعیت سفارش هنگام تکمیل پرداخت تغییر کرده است."
            });
        }


        // -------------------------------------------------
        // Clear cart
        // -------------------------------------------------

        await client.query(
            `
            DELETE FROM cart_items

            WHERE cart_id = (
                SELECT id
                FROM carts
                WHERE customer_id = $1
            )
            `,
            [
                customerId
            ]
        );


        // -------------------------------------------------
        // COMMIT
        // -------------------------------------------------

        await client.query("COMMIT");

        transactionStarted = false;


        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(200).json({

            message:
                "پرداخت آزمایشی با موفقیت انجام شد.",

            order:
                updatedOrderResult.rows[0],

            payment:
                updatedPaymentResult.rows[0]

        });


    }
    catch (error) {

        console.error(
            "testPaymentSuccess error:",
            error
        );


        if (transactionStarted) {

            try {

                await client.query(
                    "ROLLBACK"
                );

            }
            catch (rollbackError) {

                console.error(
                    "Rollback error:",
                    rollbackError
                );

            }
        }


        return res.status(500).json({
            message:
                "خطایی در تکمیل پرداخت آزمایشی رخ داد."
        });

    }
    finally {

        client.release();

    }
}


// =====================================================
// Test Payment Failed
// =====================================================

async function testPaymentFailed(req, res) {

    const client =
        await pool.connect();

    let transactionStarted = false;

    try {

        const customerId =
            req.customerId;

        const orderId =
            parseInt(req.params.orderId, 10);


        // -------------------------------------------------
        // Validate orderId
        // -------------------------------------------------

        if (!Number.isInteger(orderId)) {

            return res.status(400).json({
                message: "شناسه سفارش نامعتبر است."
            });

        }


        // -------------------------------------------------
        // BEGIN TRANSACTION
        // -------------------------------------------------

        await client.query("BEGIN");

        transactionStarted = true;


        // -------------------------------------------------
        // Get and lock order
        // -------------------------------------------------

        const orderResult =
            await client.query(
                `
                SELECT
                    id,
                    customer_id,
                    total_amount,
                    status,
                    delivery_address,
                    payment_status,
                    delivery_status,
                    created_at,
                    paid_at

                FROM orders

                WHERE id = $1
                  AND customer_id = $2

                FOR UPDATE
                `,
                [
                    orderId,
                    customerId
                ]
            );


        if (orderResult.rows.length === 0) {

            await client.query("ROLLBACK");
            transactionStarted = false;

            return res.status(404).json({
                message: "سفارش پیدا نشد."
            });

        }


        const order =
            orderResult.rows[0];


        // -------------------------------------------------
        // Validate order status
        // -------------------------------------------------

        if (order.status !== "pending") {

            await client.query("ROLLBACK");
            transactionStarted = false;

            return res.status(409).json({
                message:
                    "این سفارش دیگر در وضعیت قابل پرداخت نیست."
            });

        }


        // -------------------------------------------------
        // Validate payment status
        // -------------------------------------------------

        if (order.payment_status !== "pending") {

            await client.query("ROLLBACK");
            transactionStarted = false;

            return res.status(409).json({
                message:
                    "وضعیت پرداخت این سفارش قبلاً تعیین شده است."
            });

        }


        // -------------------------------------------------
        // Get and lock pending payment
        // -------------------------------------------------

        const paymentResult =
            await client.query(
                `
                SELECT
                    id,
                    order_id,
                    amount,
                    status,
                    gateway,
                    authority,
                    reference_id,
                    created_at,
                    paid_at

                FROM payments

                WHERE order_id = $1
                  AND status = 'pending'

                ORDER BY id DESC

                LIMIT 1

                FOR UPDATE
                `,
                [
                    orderId
                ]
            );


        if (paymentResult.rows.length === 0) {

            await client.query("ROLLBACK");
            transactionStarted = false;

            return res.status(404).json({
                message:
                    "پرداخت در انتظار برای این سفارش پیدا نشد."
            });

        }


        const payment =
            paymentResult.rows[0];


        // -------------------------------------------------
        // Validate payment amount
        // -------------------------------------------------

        if (
            Number(payment.amount) !==
            Number(order.total_amount)
        ) {

            await client.query("ROLLBACK");
            transactionStarted = false;

            return res.status(409).json({
                message:
                    "مبلغ پرداخت با مبلغ سفارش مطابقت ندارد."
            });

        }


        // -------------------------------------------------
        // Mark payment as failed
        // -------------------------------------------------

        const failedAt =
            new Date();


        const updatePaymentResult =
            await client.query(
                `
                UPDATE payments

                SET
                    status = 'failed'

                WHERE id = $1
                  AND order_id = $2
                  AND status = 'pending'

                RETURNING
                    id,
                    order_id,
                    amount,
                    status,
                    gateway,
                    authority,
                    reference_id,
                    created_at,
                    paid_at
                `,
                [
                    payment.id,
                    orderId
                ]
            );


        if (updatePaymentResult.rows.length === 0) {

            await client.query("ROLLBACK");
            transactionStarted = false;

            return res.status(409).json({
                message:
                    "پرداخت دیگر در وضعیت قابل تغییر نیست."
            });

        }


        // -------------------------------------------------
        // Update order
        // -------------------------------------------------

        const updateOrderResult =
            await client.query(
                `
                UPDATE orders

                SET
                    status = 'failed',
                    payment_status = 'failed',
                    delivery_status = 'cancelled'

                WHERE id = $1
                  AND customer_id = $2
                  AND status = 'pending'
                  AND payment_status = 'pending'

                RETURNING
                    id,
                    customer_id,
                    total_amount,
                    status,
                    delivery_address,
                    payment_status,
                    delivery_status,
                    created_at,
                    paid_at
                `,
                [
                    orderId,
                    customerId
                ]
            );


        if (updateOrderResult.rows.length === 0) {

            await client.query("ROLLBACK");
            transactionStarted = false;

            return res.status(409).json({
                message:
                    "وضعیت سفارش دیگر قابل تغییر نیست."
            });

        }


        const updatedOrder =
            updateOrderResult.rows[0];


        // -------------------------------------------------
        // COMMIT
        // -------------------------------------------------

        await client.query("COMMIT");

        transactionStarted = false;


        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(200).json({

            message:
                "پرداخت آزمایشی ناموفق ثبت شد.",

            order:
                updatedOrder,

            payment:
                updatePaymentResult.rows[0]
        });


    } catch (error) {

        if (transactionStarted) {

            await client.query("ROLLBACK");
        }

        console.error(
            "testPaymentFailed error:",
            error
        );

        return res.status(500).json({
            message:
                "خطا در ثبت پرداخت ناموفق."
        });

    } finally {

        client.release();
    }
}
// =====================================================
// Customer Order History
// =====================================================

async function getMyOrders(req, res) {

    try {

        const customerId = req.customerId;

        if (!customerId) {

            return res.status(401).json({
                message: "احراز هویت مشتری انجام نشده است."
            });

        }


        // -------------------------------------------------
        // Pagination
        // -------------------------------------------------

        const page = Math.max(
            parseInt(req.query.page, 10) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                parseInt(req.query.limit, 10) || 20,
                1
            ),
            100
        );

        const offset = (page - 1) * limit;


        // -------------------------------------------------
        // Filters
        // -------------------------------------------------

        const {
            status,
            paymentStatus,
            deliveryStatus,
            search,
            dateFrom,
            dateTo,
            sortBy,
            sortOrder
        } = req.query;


        const conditions = [
            "o.customer_id = $1"
        ];

        const values = [
            customerId
        ];

        let parameterIndex = 2;


        // -------------------------------------------------
        // Order status
        // -------------------------------------------------

        if (status) {

            const allowedStatuses = [
                "pending",
                "paid",
                "failed",
                "cancelled"
            ];

            if (!allowedStatuses.includes(status)) {

                return res.status(400).json({
                    message: "وضعیت سفارش نامعتبر است."
                });

            }

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

            const allowedPaymentStatuses = [
                "pending",
                "paid",
                "failed"
            ];

            if (
                !allowedPaymentStatuses.includes(
                    paymentStatus
                )
            ) {

                return res.status(400).json({
                    message: "وضعیت پرداخت نامعتبر است."
                });

            }

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

            const allowedDeliveryStatuses = [
                "pending",
                "preparing",
                "shipped",
                "delivered",
                "cancelled"
            ];

            if (
                !allowedDeliveryStatuses.includes(
                    deliveryStatus
                )
            ) {

                return res.status(400).json({
                    message: "وضعیت ارسال نامعتبر است."
                });

            }

            conditions.push(
                `o.delivery_status = $${parameterIndex}`
            );

            values.push(deliveryStatus);

            parameterIndex++;

        }


        // -------------------------------------------------
        // Search by order ID
        // -------------------------------------------------

        if (search && search.trim()) {

            const searchValue = search.trim();

            if (!/^\d+$/.test(searchValue)) {

                return res.status(400).json({
                    message: "شماره سفارش نامعتبر است."
                });

            }

            conditions.push(
                `CAST(o.id AS TEXT) = $${parameterIndex}`
            );

            values.push(searchValue);

            parameterIndex++;

        }


        // -------------------------------------------------
        // Date From
        // -------------------------------------------------

        if (dateFrom) {

            const fromDate = new Date(dateFrom);

            if (
                Number.isNaN(fromDate.getTime())
            ) {

                return res.status(400).json({
                    message: "تاریخ شروع نامعتبر است."
                });

            }

            conditions.push(
                `o.created_at >= $${parameterIndex}::date`
            );

            values.push(dateFrom);

            parameterIndex++;

        }


        // -------------------------------------------------
        // Date To
        // -------------------------------------------------

        if (dateTo) {

            const toDate = new Date(dateTo);

            if (
                Number.isNaN(toDate.getTime())
            ) {

                return res.status(400).json({
                    message: "تاریخ پایان نامعتبر است."
                });

            }

            conditions.push(
                `o.created_at < ($${parameterIndex}::date + INTERVAL '1 day')`
            );

            values.push(dateTo);

            parameterIndex++;

        }


        // -------------------------------------------------
        // Where
        // -------------------------------------------------

        const whereClause =
            `WHERE ${conditions.join(" AND ")}`;


        // -------------------------------------------------
        // Count
        // -------------------------------------------------

        const countResult = await pool.query(
            `
            SELECT COUNT(*) AS total

            FROM orders o

            ${whereClause}
            `,
            values
        );

        const total = parseInt(
            countResult.rows[0].total,
            10
        );


        // -------------------------------------------------
        // Sorting
        // -------------------------------------------------

        const sortColumns = {
            date: "o.created_at",
            amount: "o.total_amount",
            status: "o.status",
            paymentStatus: "o.payment_status",
            deliveryStatus: "o.delivery_status"
        };

        const selectedSortColumn =
            sortColumns[sortBy] || "o.created_at";

        const selectedSortOrder =
            sortOrder === "asc" ? "ASC" : "DESC";


        // -------------------------------------------------
        // Orders
        // -------------------------------------------------

        const ordersResult = await pool.query(
            `
            SELECT
                o.id,
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

            ${whereClause}

            ORDER BY
                ${selectedSortColumn} ${selectedSortOrder},
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

            data: ordersResult.rows,

            pagination: {

                page,
                limit,
                total,

                totalPages: Math.ceil(
                    total / limit
                )

            }

        });

    }
    catch (error) {

        console.error(
            "Get customer order history error:",
            error
        );

        return res.status(500).json({
            message: "خطا در دریافت تاریخچه سفارش‌ها."
        });

    }

}

// =====================================================
// Customer Order Details
// =====================================================

async function getMyOrderById(req, res) {

    try {

        const customerId = req.customerId;

        const orderId = Number(req.params.orderId);


        // -------------------------------------------------
        // Validate
        // -------------------------------------------------

        if (!customerId) {

            return res.status(401).json({
                message: "احراز هویت مشتری انجام نشده است."
            });

        }

        if (
            !Number.isSafeInteger(orderId) ||
            orderId <= 0
        ) {

            return res.status(400).json({
                message: "شناسه سفارش نامعتبر است."
            });

        }


        // -------------------------------------------------
        // Get order owned by customer
        // -------------------------------------------------

        const orderResult = await pool.query(
            `
            SELECT
                o.id,
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

            WHERE
                o.id = $1
                AND o.customer_id = $2
            `,
            [
                orderId,
                customerId
            ]
        );


        if (orderResult.rows.length === 0) {

            return res.status(404).json({
                message: "سفارش پیدا نشد."
            });

        }


        const order = orderResult.rows[0];


        // -------------------------------------------------
        // Get order items
        // -------------------------------------------------

        const itemsResult = await pool.query(
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

        const paymentResult = await pool.query(
            `
            SELECT
                id,
                amount,
                status,
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

            order,

            items: itemsResult.rows,

            payment

        });

    }
    catch (error) {

        console.error(
            "Get customer order details error:",
            error
        );

        return res.status(500).json({
            message: "خطا در دریافت جزئیات سفارش."
        });

    }

}
// =====================================================
// Exports
// =====================================================

module.exports = {
    createOrder,
    getPendingOrder,
    cancelPendingOrder,
    startPayment,
    testPaymentSuccess,
    testPaymentFailed,
    getMyOrders,
    getMyOrderById
};