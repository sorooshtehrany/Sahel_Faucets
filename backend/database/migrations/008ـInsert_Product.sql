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
    'Image.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Dolphin-Matte_Gold';

-- =========================================================
-- Rose - Matte Gold Series
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
    'دلفینی',
    'کروم براق',
    'Rose-shiny-chrom',
    '#F3F1EE',
    'Rose',
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
WHERE folder_name = 'Rose-shiny-chrom';

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
WHERE folder_name = 'Rose-shiny-chrom';

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
WHERE folder_name = 'Rose-shiny-chrom';

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
WHERE folder_name = 'Rose-shiny-chrom';
