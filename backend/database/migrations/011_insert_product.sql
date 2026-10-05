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
    'آرچر',
    'طلایی براق',
    'Archer-shiny-gold',
    '#f0e0a0',
    'Archer',
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
WHERE folder_name = 'Archer-shiny-gold';


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
WHERE folder_name = 'Archer-shiny-gold';


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
WHERE folder_name = 'Archer-shiny-gold';


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
WHERE folder_name = 'Archer-shiny-gold';









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
    'آرچر',
    'کروم براق',
    'Archer-shiny-chrome',
    '#F3F1EE',
    'Archer',
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
WHERE folder_name = 'Archer-shiny-chrome';


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
WHERE folder_name = 'Archer-shiny-chrome';


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
WHERE folder_name = 'Archer-shiny-chrome';


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
WHERE folder_name = 'Archer-shiny-chrome';











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
    'صدف',
    'کروم براق',
    'Sadaf-shiny-chrome',
    '#F3F1EE',
    'Sadaf',
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
WHERE folder_name = 'Sadaf-shiny-chrome';


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
WHERE folder_name = 'Sadaf-shiny-chrome';


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
WHERE folder_name = 'Sadaf-shiny-chrome';


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
WHERE folder_name = 'Sadaf-shiny-chrome';










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
    'زرین',
    'سفید طلایی',
    'Zarrin-white-gold',
    '#ffffff',
    'Zarrin',
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
WHERE folder_name = 'Zarrin-white-gold';


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
WHERE folder_name = 'Zarrin-white-gold';


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
WHERE folder_name = 'Zarrin-white-gold';


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
WHERE folder_name = 'Zarrin-white-gold';









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
    'زرین',
    'کروم براق',
    'Zarrin-shiny-chrome',
    '#F3F1EE',
    'Zarrin',
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
WHERE folder_name = 'Zarrin-shiny-chrome';


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
WHERE folder_name = 'Zarrin-shiny-chrome';


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
WHERE folder_name = 'Zarrin-shiny-chrome';


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
WHERE folder_name = 'Zarrin-shiny-chrome';










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
    'یاتو',
    'سفید کروم',
    'Yato-white-chrome',
    '#ffffff',
    'Yato',
    'White Chrome'
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
WHERE folder_name = 'Yato-white-chrome';


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
WHERE folder_name = 'Yato-white-chrome';


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
WHERE folder_name = 'Yato-white-chrome';


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
WHERE folder_name = 'Yato-white-chrome';








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
    'پریا',
    'طلایی براق',
    'Paria-shiny-gold',
    '#f0e0a0',
    'Paria',
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
WHERE folder_name = 'Paria-shiny-gold';


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
WHERE folder_name = 'Paria-shiny-gold';


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
WHERE folder_name = 'Paria-shiny-gold';


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
WHERE folder_name = 'Paria-shiny-gold';











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
    'پریا',
    'کروم براق',
    'Paria-shiny-chrome',
    '#F3F1EE',
    'Paria',
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
WHERE folder_name = 'Paria-shiny-chrome';


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
WHERE folder_name = 'Paria-shiny-chrome';


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
WHERE folder_name = 'Paria-shiny-chrome';


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
WHERE folder_name = 'Paria-shiny-chrome';








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
    'تندیس',
    'سفید طلایی',
    'Tandis-white-gold',
    '#ffffff',
    'Tandis',
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
WHERE folder_name = 'Tandis-white-gold';


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
WHERE folder_name = 'Tandis-white-gold';


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
WHERE folder_name = 'Tandis-white-gold';


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
WHERE folder_name = 'Tandis-white-gold';










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
    'تندیس',
    'کروم براق',
    'Tandis-shiny-chrome',
    '#F3F1EE',
    'Tandis',
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
WHERE folder_name = 'Tandis-shiny-chrome';


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
WHERE folder_name = 'Tandis-shiny-chrome';


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
WHERE folder_name = 'Tandis-shiny-chrome';


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
WHERE folder_name = 'Tandis-shiny-chrome';










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
    'ماوی ایتالیایی',
    'طلایی براق',
    'MaviItaly-shiny-gold',
    '#f0e0a0',
    'Mavi Italy',
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
WHERE folder_name = 'MaviItaly-shiny-gold';


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
WHERE folder_name = 'MaviItaly-shiny-gold';


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
WHERE folder_name = 'MaviItaly-shiny-gold';


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
WHERE folder_name = 'MaviItaly-shiny-gold';









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
    'ماوی ایتالیایی',
    'کروم براق',
    'MaviItaly-shiny-chrome',
    '#F3F1EE',
    'Mavi Italy',
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
WHERE folder_name = 'MaviItaly-shiny-chrome';


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
WHERE folder_name = 'MaviItaly-shiny-chrome';


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
WHERE folder_name = 'MaviItaly-shiny-chrome';


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
WHERE folder_name = 'MaviItaly-shiny-chrome';











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
    'تالیا',
    'کروم براق',
    'Taliya-shiny-chrome',
    '#F3F1EE',
    'Taliya',
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
WHERE folder_name = 'Taliya-shiny-chrome';


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
WHERE folder_name = 'Taliya-shiny-chrome';


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
WHERE folder_name = 'Taliya-shiny-chrome';


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
WHERE folder_name = 'Taliya-shiny-chrome';








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
    'ستاره',
    'کروم براق',
    'Setare-shiny-chrome',
    '#F3F1EE',
    'Setareh',
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
WHERE folder_name = 'Setare-shiny-chrome';


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
WHERE folder_name = 'Setare-shiny-chrome';


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
WHERE folder_name = 'Setare-shiny-chrome';


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
WHERE folder_name = 'Setare-shiny-chrome';

















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
    'دیانا کلاسیک',
    'کروم براق',
    'DiyanaClassic-shiny-chrome',
    '#F3F1EE',
    'Classic Diyana',
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
    'تکپایه',
    0,
    'Basin2.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'DiyanaClassic-shiny-chrome';


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
    'روشویی توکاسه',
    0,
    'Basin1.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'DiyanaClassic-shiny-chrome';


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
    'ظرفشویی دیواری',
    0,
    'Kitchen.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'DiyanaClassic-shiny-chrome';


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
WHERE folder_name = 'DiyanaClassic-shiny-chrome';


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
    'دوش راست',
    0,
    'Bath.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'DiyanaClassic-shiny-chrome';

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
    'دوش کج',
    0,
    'Bath2.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'DiyanaClassic-shiny-chrome';









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
    'کژال',
    'کروم و طلایی براق',
    'Kazhal',
    '#F3F1EE',
    'Kazhal',
    'Shiny Chrome and Gold'
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
    'روشویی طلایی',
    0,
    'Basin-gold.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Kazhal';


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
    'روشویی کروم',
    0,
    'Basin-silver.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Kazhal';





