const pool = require("../db/database");

/* =========================================================
   Get all series
========================================================= */

async function getAllSeries(req, res) {

    try {

        const result = await pool.query
        (
            `
            SELECT
                s.id,
                s.name_fa,
                s.name_en,
                s.finish_fa,
                s.finish_en,
                s.folder_name,
                s.color_code,

                (
                    SELECT p.image_path
                    FROM products p
                    WHERE
                        p.series_id = s.id
                        AND p.is_active = TRUE
                    ORDER BY
                        CASE
                            WHEN p.name_fa = 'ظرفشویی' THEN 0
                            ELSE 1
                        END,
                        p.id
                    LIMIT 1
                ) AS preview_image

            FROM series s

            ORDER BY s.id
            `
        );


        res.json({
            series: result.rows
        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            message: "خطایی در دریافت لیست سری‌ها رخ داد."
        });

    }
}

async function getSeriesById(req, res) {
    try {
        const seriesId = req.params.id;

        const seriesResult = await pool.query(
            `
            SELECT
                id,
                name_fa,
                name_en,
                finish_fa,
                finish_en,
                folder_name,
                color_code
            FROM series
            WHERE id = $1
            `,
            [seriesId]
        );

        if (seriesResult.rows.length === 0) {
            return res.status(404).json({
                message: "سری مورد نظر پیدا نشد."
            });
        }

        const productsResult = await pool.query(
            `
            SELECT
                id,
                name_fa,
                price,
                image_path
            FROM products
            WHERE series_id = $1
            ORDER BY id
            `,
            [seriesId]
        );

        const series = seriesResult.rows[0];

        res.json({
            id: series.id,
            name_fa: series.name_fa,
            finish_fa: series.finish_fa,
            name_en: series.name_en,
            finish_en: series.finish_en,
            folder_name: series.folder_name,
            color_code: series.color_code,
            products: productsResult.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "خطایی در دریافت اطلاعات رخ داد."
        });

    }
}


module.exports = {
    getAllSeries,
    getSeriesById
};