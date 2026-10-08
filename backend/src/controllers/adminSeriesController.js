const pool = require("../db/database");


/* =========================================================
   Get all series
========================================================= */

async function getAdminSeries(req, res) {

    try {

        const result =
            await pool.query(
                `
                SELECT
                    s.id,
                    s.name_fa,
                    s.finish_fa,
                    s.folder_name,
                    s.color_code,
                    s.name_en,
                    s.finish_en,

                    COUNT(p.id)::integer AS product_count

                FROM series s

                LEFT JOIN products p
                    ON p.series_id = s.id

                GROUP BY
                    s.id

                ORDER BY
                    s.id DESC
                `
            );


        return res.status(200).json({

            data:
                result.rows

        });

    }
    catch (error) {

        console.error(
            "Admin get series error:",
            error
        );


        return res.status(500).json({

            message:
                "خطایی در دریافت سری‌ها رخ داد."
        });

    }
}


/* =========================================================
   Get one series
   Including its products
========================================================= */

async function getAdminSeriesById(req, res) {

    try {

        const seriesId =
            parseInt(req.params.id);


        if (
            Number.isNaN(seriesId) ||
            seriesId <= 0
        ) {

            return res.status(400).json({

                message:
                    "شناسه سری نامعتبر است."
            });

        }


        const seriesResult =
            await pool.query(
                `
                SELECT
                    id,
                    name_fa,
                    finish_fa,
                    folder_name,
                    color_code,
                    name_en,
                    finish_en

                FROM series

                WHERE id = $1
                `,
                [
                    seriesId
                ]
            );


        if (
            seriesResult.rows.length === 0
        ) {

            return res.status(404).json({

                message:
                    "سری مورد نظر پیدا نشد."
            });

        }


        const productsResult =
            await pool.query(
                `
                SELECT
                    id,
                    series_id,
                    name_fa,
                    price,
                    image_path,
                    description,
                    stock,
                    is_active

                FROM products

                WHERE series_id = $1

                ORDER BY id
                `,
                [
                    seriesId
                ]
            );


        return res.status(200).json({

            ...seriesResult.rows[0],

            products:
                productsResult.rows

        });

    }
    catch (error) {

        console.error(
            "Admin get series by id error:",
            error
        );


        return res.status(500).json({

            message:
                "خطایی در دریافت اطلاعات سری رخ داد."
        });

    }
}


/* =========================================================
   Create series
========================================================= */

async function createAdminSeries(req, res) {

    try {

        const {
            name_fa,
            finish_fa,
            folder_name,
            color_code,
            name_en,
            finish_en
        } = req.body;


        if (
            !name_fa ||
            !name_fa.trim()
        ) {

            return res.status(400).json({

                message:
                    "نام فارسی سری الزامی است."
            });

        }


        if (
            !folder_name ||
            !folder_name.trim()
        ) {

            return res.status(400).json({

                message:
                    "نام پوشه الزامی است."
            });

        }


        const result =
            await pool.query(
                `
                INSERT INTO series
                (
                    name_fa,
                    finish_fa,
                    folder_name,
                    color_code,
                    name_en,
                    finish_en
                )

                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                )

                RETURNING
                    id,
                    name_fa,
                    finish_fa,
                    folder_name,
                    color_code,
                    name_en,
                    finish_en
                `,
                [
                    name_fa.trim(),
                    finish_fa || null,
                    folder_name.trim(),
                    color_code || null,
                    name_en || null,
                    finish_en || null
                ]
            );


        return res.status(201).json({

            message:
                "سری با موفقیت ایجاد شد.",

            data:
                result.rows[0]

        });

    }
    catch (error) {

        console.error(
            "Admin create series error:",
            error
        );


        return res.status(500).json({

            message:
                "خطایی در ایجاد سری رخ داد."
        });

    }
}


/* =========================================================
   Update series
========================================================= */

async function updateAdminSeries(req, res) {

    try {

        const seriesId =
            parseInt(req.params.id);


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
            finish_fa,
            folder_name,
            color_code,
            name_en,
            finish_en
        } = req.body;


        const result =
            await pool.query(
                `
                UPDATE series

                SET
                    name_fa =
                        COALESCE($1, name_fa),

                    finish_fa =
                        COALESCE($2, finish_fa),

                    folder_name =
                        COALESCE($3, folder_name),

                    color_code =
                        COALESCE($4, color_code),

                    name_en =
                        COALESCE($5, name_en),

                    finish_en =
                        COALESCE($6, finish_en)

                WHERE id = $7

                RETURNING
                    id,
                    name_fa,
                    finish_fa,
                    folder_name,
                    color_code,
                    name_en,
                    finish_en
                `,
                [
                    name_fa !== undefined
                        ? name_fa.trim()
                        : null,

                    finish_fa !== undefined
                        ? finish_fa
                        : null,

                    folder_name !== undefined
                        ? folder_name.trim()
                        : null,

                    color_code !== undefined
                        ? color_code
                        : null,

                    name_en !== undefined
                        ? name_en
                        : null,

                    finish_en !== undefined
                        ? finish_en
                        : null,

                    seriesId
                ]
            );


        if (
            result.rows.length === 0
        ) {

            return res.status(404).json({

                message:
                    "سری مورد نظر پیدا نشد."
            });

        }


        return res.status(200).json({

            message:
                "سری با موفقیت به‌روزرسانی شد.",

            data:
                result.rows[0]

        });

    }
    catch (error) {

        console.error(
            "Admin update series error:",
            error
        );


        return res.status(500).json({

            message:
                "خطایی در به‌روزرسانی سری رخ داد."
        });

    }
}


/* =========================================================
   Delete series
========================================================= */

async function deleteAdminSeries(req, res) {

    try {

        const seriesId =
            parseInt(req.params.id);


        if (
            Number.isNaN(seriesId) ||
            seriesId <= 0
        ) {

            return res.status(400).json({

                message:
                    "شناسه سری نامعتبر است."
            });

        }


        const result =
            await pool.query(
                `
                DELETE FROM series

                WHERE id = $1

                RETURNING id
                `,
                [
                    seriesId
                ]
            );


        if (
            result.rows.length === 0
        ) {

            return res.status(404).json({

                message:
                    "سری مورد نظر پیدا نشد."
            });

        }


        return res.status(200).json({

            message:
                "سری با موفقیت حذف شد."

        });

    }
    catch (error) {

        console.error(
            "Admin delete series error:",
            error
        );


        /*
         * PostgreSQL foreign key violation
         * products.series_id -> series.id
         */

        if (
            error.code === "23503"
        ) {

            return res.status(409).json({

                message:
                    "این سری دارای محصول است و ابتدا باید محصولات آن مدیریت یا حذف شوند."
            });

        }


        return res.status(500).json({

            message:
                "خطایی در حذف سری رخ داد."
        });

    }
}


module.exports = {

    getAdminSeries,

    getAdminSeriesById,

    createAdminSeries,

    updateAdminSeries,

    deleteAdminSeries

};