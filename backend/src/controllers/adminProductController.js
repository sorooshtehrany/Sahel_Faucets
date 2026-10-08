const pool =
    require("../db/database");


async function getAdminProducts(req, res) {

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

        const search =
            req.query.search
                ? req.query.search.trim()
                : "";


        const seriesId =
            req.query.seriesId
                ? parseInt(req.query.seriesId)
                : null;


        const isActive =
            req.query.isActive !== undefined
                ? req.query.isActive
                : null;


        const conditions = [];

        const values = [];

        let parameterIndex = 1;


        // -------------------------------------------------
        // Search
        // -------------------------------------------------

        if (search) {

            conditions.push(
                `
                (
                    p.name_fa ILIKE $${parameterIndex}
                    OR p.description ILIKE $${parameterIndex}
                    OR s.name_fa ILIKE $${parameterIndex}
                )
                `
            );

            values.push(
                `%${search}%`
            );

            parameterIndex++;
        }


        // -------------------------------------------------
        // Series filter
        // -------------------------------------------------

        if (
            seriesId !== null &&
            !Number.isNaN(seriesId)
        ) {

            conditions.push(
                `p.series_id = $${parameterIndex}`
            );

            values.push(
                seriesId
            );

            parameterIndex++;
        }


        // -------------------------------------------------
        // Active filter
        // -------------------------------------------------

        if (
            isActive === "true" ||
            isActive === "false"
        ) {

            conditions.push(
                `p.is_active = $${parameterIndex}`
            );

            values.push(
                isActive === "true"
            );

            parameterIndex++;
        }


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

        FROM products p

        LEFT JOIN series s
            ON s.id = p.series_id

        ${whereClause}
        `,
                values
            );


        const total =
            parseInt(
                countResult.rows[0].total
            );


        // -------------------------------------------------
        // Products
        // -------------------------------------------------

        const productsResult =
            await pool.query(
                `
                SELECT
                    p.id,
                    p.series_id,
                    p.name_fa,
                    p.price,
                    p.image_path,
                    p.description,
                    p.stock,
                    p.is_active,

                    s.name_fa AS series_name,
                    s.finish_fa AS series_finish

                FROM products p

                LEFT JOIN series s
                    ON s.id = p.series_id

                ${whereClause}

                ORDER BY
                    p.id DESC

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
                productsResult.rows,

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
            "Admin get products error:",
            error
        );

        return res.status(500).json({

            message:
                "خطایی در دریافت محصولات رخ داد."
        });
    }
}

async function getAdminProductById(req, res) {

    try {

        const productId =
            parseInt(req.params.id);


        // -------------------------------------------------
        // Validate product ID
        // -------------------------------------------------

        if (
            Number.isNaN(productId) ||
            productId <= 0
        ) {

            return res.status(400).json({

                message:
                    "شناسه محصول نامعتبر است."
            });
        }


        // -------------------------------------------------
        // Get product
        // -------------------------------------------------

        const result =
            await pool.query(
                `
                SELECT
                    p.id,
                    p.series_id,
                    p.name_fa,
                    p.price,
                    p.image_path,
                    p.description,
                    p.stock,
                    p.is_active,

                    s.name_fa AS series_name,
                    s.finish_fa AS series_finish

                FROM products p

                LEFT JOIN series s
                    ON s.id = p.series_id

                WHERE p.id = $1
                `,
                [productId]
            );


        // -------------------------------------------------
        // Product not found
        // -------------------------------------------------

        if (
            result.rows.length === 0
        ) {

            return res.status(404).json({

                message:
                    "محصول مورد نظر پیدا نشد."
            });
        }


        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(200).json({

            data:
                result.rows[0]
        });

    }
    catch (error) {

        console.error(
            "Admin get product by id error:",
            error
        );

        return res.status(500).json({

            message:
                "خطایی در دریافت محصول رخ داد."
        });
    }
}

async function createAdminProduct(req, res) {
    try {

        const seriesId =
            parseInt(req.params.seriesId);


        // -------------------------------------------------
        // Validate series ID
        // -------------------------------------------------

        if (
            Number.isNaN(seriesId) ||
            seriesId <= 0
        ) {
            return res.status(400).json({
                message:
                    "شناسه سری نامعتبر است."
            });
        }


        const {
            name_fa,
            price,
            image_path,
            description,
            stock,
            is_active
        } = req.body;


        // -------------------------------------------------
        // Validate name
        // -------------------------------------------------

        if (
            typeof name_fa !== "string" ||
            !name_fa.trim()
        ) {
            return res.status(400).json({
                message:
                    "نام فارسی محصول الزامی است."
            });
        }


        // -------------------------------------------------
        // Validate price
        // -------------------------------------------------

        if (
            price === undefined ||
            price === null ||
            Number.isNaN(Number(price)) ||
            Number(price) < 0
        ) {
            return res.status(400).json({
                message:
                    "قیمت محصول نامعتبر است."
            });
        }


        // -------------------------------------------------
        // Validate stock
        // -------------------------------------------------

        if (
            stock === undefined ||
            stock === null ||
            Number.isNaN(Number(stock)) ||
            !Number.isInteger(Number(stock)) ||
            Number(stock) < 0
        ) {
            return res.status(400).json({
                message:
                    "موجودی محصول نامعتبر است."
            });
        }

        if (
            is_active !== undefined &&
            typeof is_active !== "boolean"
        ) {
            return res.status(400).json({
                message:
                    "وضعیت فعال بودن محصول نامعتبر است."
            });
        }

        // -------------------------------------------------
        // Check series exists
        // -------------------------------------------------

        const seriesResult =
            await pool.query(
                `
                SELECT
                    id

                FROM series

                WHERE id = $1
                `,
                [seriesId]
            );


        if (
            seriesResult.rows.length === 0
        ) {
            return res.status(404).json({
                message:
                    "سری مورد نظر پیدا نشد."
            });
        }


        // -------------------------------------------------
        // Create product
        // -------------------------------------------------

        const productResult =
            await pool.query(
                `
                INSERT INTO products
                (
                    series_id,
                    name_fa,
                    price,
                    image_path,
                    description,
                    stock,
                    is_active
                )

                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7
                )

                RETURNING
                    id,
                    series_id,
                    name_fa,
                    price,
                    image_path,
                    description,
                    stock,
                    is_active
                `,
                [
                    seriesId,
                    name_fa.trim(),
                    Number(price),
                    image_path || null,
                    description || "",
                    Number(stock),
                    is_active !== undefined
                        ? Boolean(is_active)
                        : true
                ]
            );


        return res.status(201).json({

            message:
                "محصول با موفقیت ایجاد شد.",

            data:
                productResult.rows[0]
        });

    }
    catch (error) {

        console.error(
            "Admin create product error:",
            error
        );

        return res.status(500).json({

            message:
                "خطایی در ایجاد محصول رخ داد."
        });
    }
}

async function updateAdminProduct(req, res) {
    try {

        const productId =
            parseInt(req.params.id);


        // -------------------------------------------------
        // Validate product ID
        // -------------------------------------------------

        if (
            Number.isNaN(productId) ||
            productId <= 0
        ) {
            return res.status(400).json({
                message:
                    "شناسه محصول نامعتبر است."
            });
        }


        const {
            name_fa,
            price,
            image_path,
            description,
            stock,
            is_active
        } = req.body;


        // -------------------------------------------------
        // Validate fields
        // -------------------------------------------------

        if (
            name_fa !== undefined &&
            (
                typeof name_fa !== "string" ||
                !name_fa.trim()
            )
        ) {
            return res.status(400).json({
                message:
                    "نام فارسی محصول نامعتبر است."
            });
        }


        if (
            price !== undefined &&
            (
                price === null ||
                Number.isNaN(Number(price)) ||
                Number(price) < 0
            )
        ) {
            return res.status(400).json({
                message:
                    "قیمت محصول نامعتبر است."
            });
        }


        if (
            stock !== undefined &&
            (
                stock === null ||
                Number.isNaN(Number(stock)) ||
                !Number.isInteger(Number(stock)) ||
                Number(stock) < 0
            )
        ) {
            return res.status(400).json({
                message:
                    "موجودی محصول نامعتبر است."
            });
        }


        if (
            is_active !== undefined &&
            typeof is_active !== "boolean"
        ) {
            return res.status(400).json({
                message:
                    "وضعیت فعال بودن محصول نامعتبر است."
            });
        }


        // -------------------------------------------------
        // Update product
        // -------------------------------------------------

        const result =
            await pool.query(
                `
                UPDATE products

                SET
                    name_fa =
                        COALESCE($1, name_fa),

                    price =
                        COALESCE($2, price),

                    image_path =
                        COALESCE($3, image_path),

                    description =
                        COALESCE($4, description),

                    stock =
                        COALESCE($5, stock),

                    is_active =
                        COALESCE($6, is_active)

                WHERE id = $7

                RETURNING
                    id,
                    series_id,
                    name_fa,
                    price,
                    image_path,
                    description,
                    stock,
                    is_active
                `,
                [
                    name_fa !== undefined
                        ? name_fa.trim()
                        : null,

                    price !== undefined
                        ? Number(price)
                        : null,

                    image_path !== undefined
                        ? image_path
                        : null,

                    description !== undefined
                        ? description
                        : null,

                    stock !== undefined
                        ? Number(stock)
                        : null,

                    is_active !== undefined
                        ? is_active
                        : null,

                    productId
                ]
            );


        if (
            result.rows.length === 0
        ) {
            return res.status(404).json({
                message:
                    "محصول مورد نظر پیدا نشد."
            });
        }


        return res.status(200).json({

            message:
                "محصول با موفقیت به‌روزرسانی شد.",

            data:
                result.rows[0]
        });

    }
    catch (error) {

        console.error(
            "Admin update product error:",
            error
        );

        return res.status(500).json({

            message:
                "خطایی در به‌روزرسانی محصول رخ داد."
        });
    }
}

async function deleteAdminProduct(req, res) {

    try {

        const productId =
            parseInt(req.params.id);


        // -------------------------------------------------
        // Validate product ID
        // -------------------------------------------------

        if (
            Number.isNaN(productId) ||
            productId <= 0
        ) {

            return res.status(400).json({

                message:
                    "شناسه محصول نامعتبر است."
            });
        }


        // -------------------------------------------------
        // Delete product
        // -------------------------------------------------

        const result =
            await pool.query(
                `
                DELETE FROM products

                WHERE id = $1

                RETURNING
                    id,
                    series_id,
                    name_fa
                `,
                [productId]
            );


        // -------------------------------------------------
        // Product not found
        // -------------------------------------------------

        if (
            result.rows.length === 0
        ) {

            return res.status(404).json({

                message:
                    "محصول مورد نظر پیدا نشد."
            });
        }


        // -------------------------------------------------
        // Success
        // -------------------------------------------------

        return res.status(200).json({

            message:
                "محصول با موفقیت حذف شد.",

            data:
                result.rows[0]
        });

    }
    catch (error) {

        console.error(
            "Admin delete product error:",
            error
        );


        // -------------------------------------------------
        // Product referenced by order_items
        // -------------------------------------------------

        if (
            error.code === "23503"
        ) {

            return res.status(409).json({

                message:
                    "این محصول در سفارش‌ها استفاده شده و قابل حذف نیست."
            });
        }


        return res.status(500).json({

            message:
                "خطایی در حذف محصول رخ داد."
        });
    }
}

module.exports = {
    getAdminProducts,
    getAdminProductById,
    createAdminProduct,
    updateAdminProduct,
    deleteAdminProduct
};