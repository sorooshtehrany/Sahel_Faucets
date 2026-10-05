-- =========================================================
-- Initial database schema
-- This file describes the original database structure.
-- The database already exists, so this migration is
-- used as a baseline and must not be executed on the
-- existing database.
-- =========================================================


-- =========================================================
-- Series
-- =========================================================

CREATE TABLE series (
    id SERIAL PRIMARY KEY,
    name_fa VARCHAR(100) NOT NULL,
    finish_fa VARCHAR(100),
    folder_name VARCHAR(100),
    color_code VARCHAR(20),
    name_en VARCHAR(100),
    finish_en VARCHAR(100)
);


-- =========================================================
-- Products
-- =========================================================

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    series_id INTEGER NOT NULL,
    name_fa VARCHAR(100) NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    image_path VARCHAR(255),

    CONSTRAINT products_series_id_fkey
        FOREIGN KEY (series_id)
        REFERENCES series(id)
);