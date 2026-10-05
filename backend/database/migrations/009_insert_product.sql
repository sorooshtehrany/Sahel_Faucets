
-- =========================================================
-- Morvarid - Shiny Chrome Series
-- =========================================================

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
    'مروارید',
    'کروم براق',
    'Morvarid-shiny-chrome',
    '#F3F1EE',
    'Morvarid',
    'Shiny Chrom'
)
RETURNING id;

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
SELECT
    id,
    'دوش',
    0,
    'Bath.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Morvarid-shiny-chrome';

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
SELECT
    id,
    'ظرفشویی',
    0,
    'Kitchen.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Morvarid-shiny-chrome';

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
SELECT
    id,
    'توالت',
    0,
    'Toilet.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Morvarid-shiny-chrome';

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
SELECT
    id,
    'روشویی',
    0,
    'Basin.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Morvarid-shiny-chrome';



-- =========================================================
-- Morvarid - White Chrome Series
-- =========================================================

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
    'مروارید',
    'سفید کروم',
    'Morvarid-white-chrome',
    '#FFFFFF',
    'Morvarid',
    'White Chrom'
)
RETURNING id;

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
SELECT
    id,
    'دوش',
    0,
    'Bath.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Morvarid-white-chrome';

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
SELECT
    id,
    'ظرفشویی',
    0,
    'Kitchen.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Morvarid-white-chrome';

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
SELECT
    id,
    'توالت',
    0,
    'Toilet.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Morvarid-white-chrome';

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
SELECT
    id,
    'روشویی',
    0,
    'Basin.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Morvarid-white-chrome';




-- =========================================================
-- Aqua - Shiny Chrome Series
-- =========================================================

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
    'آکوا',
    'کروم براق',
    'Aqua-shiny-chrome',
    '#F3F1EE',
    'Aqua',
    'Shiny Chrom'
)
RETURNING id;

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
SELECT
    id,
    'دوش',
    0,
    'Bath.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Aqua-shiny-chrome';

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
SELECT
    id,
    'ظرفشویی',
    0,
    'Kitchen.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Aqua-shiny-chrome';

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
SELECT
    id,
    'توالت',
    0,
    'Toilet.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Aqua-shiny-chrome';

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
SELECT
    id,
    'روشویی',
    0,
    'Basin.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Aqua-shiny-chrome';






-- =========================================================
-- Flat1 - Shiny Chrome Series
-- =========================================================

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
    'فلت ۱',
    'کروم براق',
    'Flat1-shiny-chrome',
    '#F3F1EE',
    'Flat1',
    'Shiny Chrom'
)
RETURNING id;

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
SELECT
    id,
    'دوش',
    0,
    'Bath.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Flat1-shiny-chrome';

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
SELECT
    id,
    'ظرفشویی',
    0,
    'Kitchen.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Flat1-shiny-chrome';

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
SELECT
    id,
    'توالت',
    0,
    'Toilet.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Flat1-shiny-chrome';

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
SELECT
    id,
    'روشویی',
    0,
    'Basin.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Flat1-shiny-chrome';