const pool = require("../db/database");


// =====================================================
// Cart Helpers
// =====================================================

async function getOrCreateCart(
    customerId,
    client = pool
) {

    const result =
        await client.query(
            `
            INSERT INTO carts (
                customer_id
            )

            VALUES ($1)

            ON CONFLICT (customer_id)
            DO UPDATE
            SET customer_id = EXCLUDED.customer_id

            RETURNING id
            `,
            [customerId]
        );


    return result.rows[0].id;
}



// =====================================================
// Cart Payment Lock Helper
// =====================================================

async function hasActivePayment(
    customerId,
    client = pool
) {

    const result =
        await client.query(
            `
            SELECT 1

            FROM orders o

            INNER JOIN payments p
                ON p.order_id = o.id

            WHERE o.customer_id = $1
            AND o.status = 'pending'
            AND p.status = 'pending'

            LIMIT 1
            `,
            [customerId]
        );


    return result.rows.length > 0;
}


// =====================================================
// Get Full Cart
// =====================================================

async function getFullCart(
    customerId,
    cartId,
    client = pool
) {

    const itemsResult = await client.query(
        `
        SELECT
            ci.id,
            ci.product_id,
            ci.quantity,

            p.name_fa,
            p.price,

            CONCAT(
                '/images/',
                s.folder_name,
                '/',
                p.image_path
            ) AS image_url,

            s.name_fa AS series_name,
            s.finish_fa AS series_finish

        FROM cart_items ci

        INNER JOIN products p
            ON p.id = ci.product_id

        INNER JOIN series s
            ON s.id = p.series_id

        WHERE ci.cart_id = $1

        ORDER BY ci.id
        `,
        [cartId]
    );


    const items =
        itemsResult.rows;


    const total =
        items.reduce(
            (sum, item) => {

                return sum +
                    Number(item.price) *
                    Number(item.quantity);

            },
            0
        );


    return {
        id: cartId,
        customer_id: customerId,
        items: items,
        total: total
    };
}


// =====================================================
// Get Cart
// =====================================================

async function getCart(req, res) {

    try {

        const customerId =
            req.customerId;


        const cartId =
            await getOrCreateCart(
                customerId
            );


        const cart =
            await getFullCart(
                customerId,
                cartId
            );


        return res.status(200).json({
            cart: cart
        });

    }
    catch (error) {

        console.error(
            "Get cart error:",
            error
        );


        return res.status(500).json({
            message:
                "خطایی در دریافت سبد خرید رخ داد."
        });
    }
}


// =====================================================
// Add To Cart
// =====================================================

async function addToCart(req, res) {

    const client =
        await pool.connect();

    let transactionStarted = false;


    try {

        const customerId =
            req.customerId;


        const {
            product_id,
            quantity
        } = req.body;


        // -------------------------------------------------
        // Validation
        // -------------------------------------------------

        if (
            !Number.isInteger(product_id) ||
            product_id <= 0
        ) {

            return res.status(400).json({
                message:
                    "product_id نامعتبر است."
            });
        }


        if (
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {

            return res.status(400).json({
                message:
                    "quantity باید عدد صحیح بزرگ‌تر از صفر باشد."
            });
        }


        // -------------------------------------------------
        // BEGIN TRANSACTION
        // -------------------------------------------------

        await client.query("BEGIN");
        transactionStarted = true;




        // -------------------------------------------------
        // Check active payment
        // -------------------------------------------------

        const paymentLocked =
            await hasActivePayment(
                customerId,
                client
            );


        if (paymentLocked) {

            await client.query("ROLLBACK");

            transactionStarted = false;

            return res.status(409).json({
                message:
                    "پرداخت یک سفارش قبلی آغاز شده است. تا تعیین تکلیف آن، امکان تغییر سبد خرید وجود ندارد."
            });
        }


        // -------------------------------------------------
        // Lock product row
        // -------------------------------------------------

        const productResult =
            await client.query(
                `
                SELECT
                    id,
                    stock

                FROM products

                WHERE id = $1

                FOR UPDATE
                `,
                [product_id]
            );


        if (
            productResult.rows.length === 0
        ) {

            await client.query("ROLLBACK");

            transactionStarted = false;

            return res.status(404).json({
                message:
                    "محصول پیدا نشد."
            });
        }


        const stock =
            Number(
                productResult.rows[0].stock
            );


        if (stock <= 0) {

            await client.query("ROLLBACK");

            transactionStarted = false;

            return res.status(400).json({
                message:
                    "این محصول در حال حاضر ناموجود است."
            });
        }


        // -------------------------------------------------
        // Get / create cart
        // -------------------------------------------------

        const cartId =
            await getOrCreateCart(
                customerId,
                client
            );


        // -------------------------------------------------
        // Check existing item
        // -------------------------------------------------

        const existingItemResult =
            await client.query(
                `
                SELECT
                    id,
                    quantity

                FROM cart_items

                WHERE cart_id = $1
                AND product_id = $2

                FOR UPDATE
                `,
                [
                    cartId,
                    product_id
                ]
            );


        // -------------------------------------------------
        // Existing item
        // -------------------------------------------------

        if (
            existingItemResult.rows.length > 0
        ) {

            const item =
                existingItemResult.rows[0];


            const currentQuantity =
                Number(item.quantity);


            const newQuantity =
                currentQuantity + quantity;


            if (newQuantity > stock) {

                await client.query("ROLLBACK");

                transactionStarted = false;

                return res.status(400).json({
                    message:
                        `حداکثر تعداد قابل سفارش از این محصول ${stock} عدد است.`
                });
            }


            await client.query(
                `
                UPDATE cart_items

                SET quantity = $1

                WHERE id = $2
                `,
                [
                    newQuantity,
                    item.id
                ]
            );
        }


        // -------------------------------------------------
        // New item
        // -------------------------------------------------

        else {

            if (quantity > stock) {

                await client.query("ROLLBACK");

                transactionStarted = false;

                return res.status(400).json({
                    message:
                        `حداکثر تعداد قابل سفارش از این محصول ${stock} عدد است.`
                });
            }


            await client.query(
                `
                INSERT INTO cart_items (
                    cart_id,
                    product_id,
                    quantity
                )

                VALUES ($1, $2, $3)
                `,
                [
                    cartId,
                    product_id,
                    quantity
                ]
            );
        }


        // -------------------------------------------------
        // COMMIT
        // -------------------------------------------------

        await client.query("COMMIT");

        transactionStarted = false;


        // -------------------------------------------------
        // Get updated cart after commit
        // -------------------------------------------------

        const cart =
            await getFullCart(
                customerId,
                cartId
            );


        return res.status(201).json({

            message:
                "محصول به سبد خرید اضافه شد.",

            cart: cart

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
            "Add to cart error:",
            error
        );


        return res.status(500).json({
            message:
                "خطایی در افزودن محصول به سبد خرید رخ داد."
        });
    }
    finally {

        client.release();

    }
}


// =====================================================
// Update Cart Item
// =====================================================

async function updateCartItem(req, res) {

    const client =
        await pool.connect();


    try {

        const customerId =
            req.customerId;


        const productId =
            Number(
                req.params.productId
            );


        const {
            quantity
        } = req.body;


        // -------------------------------------------------
        // Validation
        // -------------------------------------------------

        if (
            !Number.isInteger(productId) ||
            productId <= 0
        ) {

            return res.status(400).json({
                message:
                    "product_id نامعتبر است."
            });
        }


        if (
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {

            return res.status(400).json({
                message:
                    "quantity باید عدد صحیح بزرگ‌تر از صفر باشد."
            });
        }


        // -------------------------------------------------
        // BEGIN
        // -------------------------------------------------

        await client.query("BEGIN");

        const paymentLocked =
            await hasActivePayment(
                customerId,
                client
            );


        if (paymentLocked) {

            await client.query("ROLLBACK");

            return res.status(409).json({
                message:
                    "پرداخت یک سفارش قبلی آغاز شده است. تا تعیین تکلیف آن، امکان تغییر سبد خرید وجود ندارد."
            });
        }
        // -------------------------------------------------
        // Lock product
        // -------------------------------------------------

        const productResult =
            await client.query(
                `
                SELECT
                    id,
                    stock

                FROM products

                WHERE id = $1

                FOR UPDATE
                `,
                [productId]
            );


        if (
            productResult.rows.length === 0
        ) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                message:
                    "محصول پیدا نشد."
            });
        }


        const stock =
            Number(
                productResult.rows[0].stock
            );


        if (stock <= 0) {

            await client.query("ROLLBACK");

            return res.status(400).json({
                message:
                    "این محصول در حال حاضر ناموجود است."
            });
        }


        if (quantity > stock) {

            await client.query("ROLLBACK");

            return res.status(400).json({
                message:
                    `حداکثر تعداد قابل سفارش از این محصول ${stock} عدد است.`
            });
        }


        // -------------------------------------------------
        // Get cart
        // -------------------------------------------------

        const cartId =
            await getOrCreateCart(
                customerId,
                client
            );


        // -------------------------------------------------
        // Update item
        // -------------------------------------------------

        const result =
            await client.query(
                `
                UPDATE cart_items

                SET quantity = $1

                WHERE cart_id = $2
                AND product_id = $3

                RETURNING
                    id,
                    product_id,
                    quantity
                `,
                [
                    quantity,
                    cartId,
                    productId
                ]
            );


        if (
            result.rows.length === 0
        ) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                message:
                    "این محصول در سبد خرید شما وجود ندارد."
            });
        }


        // -------------------------------------------------
        // COMMIT
        // -------------------------------------------------

        await client.query("COMMIT");


        const cart =
            await getFullCart(
                customerId,
                cartId
            );


        return res.status(200).json({
            cart: cart
        });

    }
    catch (error) {

        try {
            await client.query("ROLLBACK");
        }
        catch (rollbackError) {

            console.error(
                "Rollback error:",
                rollbackError
            );
        }


        console.error(
            "Update cart item error:",
            error
        );


        return res.status(500).json({
            message:
                "خطایی در تغییر تعداد محصول رخ داد."
        });
    }
    finally {

        client.release();

    }
}


// =====================================================
// Remove Cart Item
// =====================================================

async function removeCartItem(req, res) {

    const client =
        await pool.connect();


    try {

        const customerId =
            req.customerId;


        const productId =
            Number(
                req.params.productId
            );


        // -------------------------------------------------
        // Validation
        // -------------------------------------------------

        if (
            !Number.isInteger(productId) ||
            productId <= 0
        ) {

            return res.status(400).json({
                message:
                    "product_id نامعتبر است."
            });
        }


        // -------------------------------------------------
        // BEGIN
        // -------------------------------------------------

        await client.query("BEGIN");
        // -------------------------------------------------
        // Check active payment
        // -------------------------------------------------

        const paymentLocked =
            await hasActivePayment(
                customerId,
                client
            );


        if (paymentLocked) {

            await client.query("ROLLBACK");

            return res.status(409).json({
                message:
                    "پرداخت یک سفارش قبلی آغاز شده است. تا تعیین تکلیف آن، امکان تغییر سبد خرید وجود ندارد."
            });
        }

        // -------------------------------------------------
        // Get cart
        // -------------------------------------------------

        const cartId =
            await getOrCreateCart(
                customerId,
                client
            );


        // -------------------------------------------------
        // Remove item
        // -------------------------------------------------

        const result =
            await client.query(
                `
                DELETE FROM cart_items

                WHERE cart_id = $1
                AND product_id = $2

                RETURNING
                    id,
                    product_id,
                    quantity
                `,
                [
                    cartId,
                    productId
                ]
            );


        if (
            result.rows.length === 0
        ) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                message:
                    "این محصول در سبد خرید شما وجود ندارد."
            });
        }


        // -------------------------------------------------
        // COMMIT
        // -------------------------------------------------

        await client.query("COMMIT");


        const cart =
            await getFullCart(
                customerId,
                cartId
            );


        return res.status(200).json({
            cart: cart
        });

    }
    catch (error) {

        try {
            await client.query("ROLLBACK");
        }
        catch (rollbackError) {

            console.error(
                "Rollback error:",
                rollbackError
            );
        }


        console.error(
            "Remove cart item error:",
            error
        );


        return res.status(500).json({
            message:
                "خطایی در حذف محصول رخ داد."
        });
    }
    finally {

        client.release();

    }
}


// =====================================================
// Clear Cart
// =====================================================

async function clearCart(req, res) {

    const client =
        await pool.connect();


    try {

        const customerId =
            req.customerId;


        // -------------------------------------------------
        // BEGIN
        // -------------------------------------------------

        await client.query("BEGIN");

        // -------------------------------------------------
        // Check active payment
        // -------------------------------------------------

        const paymentLocked =
            await hasActivePayment(
                customerId,
                client
            );

        if (paymentLocked) {

            await client.query("ROLLBACK");

            return res.status(409).json({
                message:
                    "پرداخت یک سفارش قبلی آغاز شده است. تا تعیین تکلیف آن، امکان تغییر سبد خرید وجود ندارد."
            });
        }


        // -------------------------------------------------
        // Get cart
        // -------------------------------------------------

        const cartId =
            await getOrCreateCart(
                customerId,
                client
            );


        // -------------------------------------------------
        // Delete all items
        // -------------------------------------------------

        await client.query(
            `
            DELETE FROM cart_items

            WHERE cart_id = $1
            `,
            [cartId]
        );


        // -------------------------------------------------
        // COMMIT
        // -------------------------------------------------

        await client.query("COMMIT");


        const cart =
            await getFullCart(
                customerId,
                cartId
            );


        return res.status(200).json({
            cart: cart
        });

    }
    catch (error) {

        try {
            await client.query("ROLLBACK");
        }
        catch (rollbackError) {

            console.error(
                "Rollback error:",
                rollbackError
            );
        }


        console.error(
            "Clear cart error:",
            error
        );


        return res.status(500).json({
            message:
                "خطایی در خالی کردن سبد خرید رخ داد."
        });
    }
    finally {

        client.release();

    }
}


// =====================================================
// Exports
// =====================================================

module.exports = {

    getFullCart,
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart

};