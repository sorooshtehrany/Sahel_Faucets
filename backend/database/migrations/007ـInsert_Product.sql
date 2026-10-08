-- =========================================================
-- Dolphin - Matte Gold Series
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
    'طلایی مات',
    'Dolphin-Matte_Gold',
    '#C9A227',
    'Dolphin',
    'Matte Gold'
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
WHERE folder_name = 'Dolphin-Matte_Gold';

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
WHERE folder_name = 'Dolphin-Matte_Gold';

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
WHERE folder_name = 'Dolphin-Matte_Gold';