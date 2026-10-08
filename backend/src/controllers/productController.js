const pool = require("../db/database");

async function getAllProducts(req, res) {
    try {

        const result = await pool.query(`
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
            WHERE is_active = TRUE
            ORDER BY id
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "خطایی در دریافت محصولات رخ داد."
        });
    }
}


async function getProductById(req, res) {

    try {

        const productId = req.params.id;

        const result = await pool.query(
            `
            SELECT
                products.id,
                products.series_id,
                products.name_fa,
                products.price,
                products.image_path,
                products.description,
                products.stock,
                products.is_active,

                series.name_fa AS series_name_fa,
                series.name_en AS series_name_en,
                series.finish_fa AS series_finish_fa,
                series.finish_en AS series_finish_en,
                series.folder_name,
                series.color_code

            FROM products

            INNER JOIN series
                ON products.series_id = series.id

            WHERE products.id = $1
            AND products.is_active = TRUE
            `,
            [productId]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "محصول مورد نظر پیدا نشد."
            });

        }


        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "خطایی در دریافت محصول رخ داد."
        });

    }
}


async function searchProducts(req, res) {
    try {
        const searchText = req.query.q;

        if (!searchText || searchText.trim() === "") {
            return res.status(400).json({
                message: "عبارت جستجو وارد نشده است."
            });
        }

        const words = searchText
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        const conditions = [];
        const values = [];

        words.forEach((word, index) => {

            const parameterIndex = index + 1;

            conditions.push(`
                (
                    products.name_fa ILIKE $${parameterIndex}
                    OR series.name_fa ILIKE $${parameterIndex}
                    OR series.finish_fa ILIKE $${parameterIndex}
                )
            `);

            values.push(`%${word}%`);
        });

        const result = await pool.query(
            `
            SELECT
                products.id,
                products.series_id,
                products.name_fa,
                products.price,
                products.image_path,
                products.description,
                products.stock,
                products.is_active,

                series.name_fa AS series_name_fa,
                series.finish_fa AS series_finish_fa

            FROM products

            INNER JOIN series
                ON products.series_id = series.id

            WHERE products.is_active = TRUE

            AND ${conditions.join(" AND ")}

            ORDER BY products.id
            `,
            values
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "خطایی در جستجوی محصولات رخ داد."
        });
    }
}


module.exports = {
    getAllProducts,
    getProductById,
    searchProducts
};