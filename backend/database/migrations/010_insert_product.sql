-- =========================================================
-- Archer - Shiny Gold Series
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
    'طلایی براق',
    'Flat1-shiny-gold',
    '#f0e0a0',
    'Flat1',
    'Shiny Gold'
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
WHERE folder_name = 'Flat1-shiny-gold';

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
WHERE folder_name = 'Flat1-shiny-gold';

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
WHERE folder_name = 'Flat1-shiny-gold';

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
WHERE folder_name = 'Flat1-shiny-gold';







-- =========================================================
-- Bambo - Shiny Chrome Series
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
    'بامبو',
    'کروم براق',
    'Bambo-shiny-chrome',
    '#F3F1EE',
    'Bambo',
    'Shiny Chrome'
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
WHERE folder_name = 'Bambo-shiny-chrome';

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
WHERE folder_name = 'Bambo-shiny-chrome';

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
WHERE folder_name = 'Bambo-shiny-chrome';

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
WHERE folder_name = 'Bambo-shiny-chrome';

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
    'روشویی بلند',
    0,
    'Tall-Basin.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Bambo-shiny-chrome';






-- =========================================================
-- Bambo - White Gold Series
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
    'بامبو',
    'سفید طلایی',
    'Bambo-white-gold',
    '#FFFFFF',
    'Bambo',
    'White Gold'
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
WHERE folder_name = 'Bambo-white-gold';

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
WHERE folder_name = 'Bambo-white-gold';

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
WHERE folder_name = 'Bambo-white-gold';

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
WHERE folder_name = 'Bambo-white-gold';

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
    'روشویی بلند',
    0,
    'Tall-Basin.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Bambo-white-gold';




-- =========================================================
-- Aria - White Gold Series
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
    'آریا',
    'سفید طلایی',
    'Aria-white-gold',
    '#FFFFFF',
    'Arya',
    'White Gold'
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
WHERE folder_name = 'Aria-white-gold';

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
WHERE folder_name = 'Aria-white-gold';

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
WHERE folder_name = 'Aria-white-gold';

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
WHERE folder_name = 'Aria-white-gold';



-- =========================================================
-- Aria - Shiny Chrome Series
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
    'آریا',
    'کروم براق',
    'Aria-shiny-chrome',
    '#F3F1EE',
    'Arya',
    'Shiny Chrome'
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
WHERE folder_name = 'Aria-shiny-chrome';

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
WHERE folder_name = 'Aria-shiny-chrome';

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
WHERE folder_name = 'Aria-shiny-chrome';

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
WHERE folder_name = 'Aria-shiny-chrome';





-- =========================================================
-- Anahita - Shiny Gold Series
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
    'آناهیتا',
    'طلایی براق',
    'Anahita-shiny-gold',
    '#f0e0a0',
    'Anahita',
    'Shiny Gold'
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
WHERE folder_name = 'Anahita-shiny-gold';

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
WHERE folder_name = 'Anahita-shiny-gold';

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
WHERE folder_name = 'Anahita-shiny-gold';

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
WHERE folder_name = 'Anahita-shiny-gold';


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
    'روشویی بلند',
    0,
    'Tall-Basin.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Anahita-shiny-gold';




-- =========================================================
-- Alborz - Shiny Chrome Series
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
    'البرز',
    'کروم براق',
    'Alborz-shiny-chrome',
    '#F3F1EE',
    'Alborz',
    'Shiny Chrome'
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
WHERE folder_name = 'Alborz-shiny-chrome';

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
WHERE folder_name = 'Alborz-shiny-chrome';

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
WHERE folder_name = 'Alborz-shiny-chrome';

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
WHERE folder_name = 'Alborz-shiny-chrome';
