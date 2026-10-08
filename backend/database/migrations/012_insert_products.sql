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
    'انواع ظرفشویی',
    ' ',
    'Kitchen-Faucets1',
    '#ffffff',
    'Kitchen Faucets',
    ' '
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
    'ظرفشویی',
    0,
    'Kitchen1.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Kitchen-Faucets1';


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
    'Kitchen2.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Kitchen-Faucets1';


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
    'Kitchen3.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Kitchen-Faucets1';


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
    'Kitchen4.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Kitchen-Faucets1';


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
    'Kitchen5.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Kitchen-Faucets1';











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
    'انواع ظرفشویی',
    ' ',
    'Kitchen-Faucets2',
    '#ffffff',
    'Kitchen Faucets',
    ' '
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
    'ظرفشویی',
    0,
    'Kitchen1.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Kitchen-Faucets2';


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
    'Kitchen2.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Kitchen-Faucets2';


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
    'Kitchen3.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Kitchen-Faucets2';


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
    'Kitchen4.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Kitchen-Faucets2';


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
    'Kitchen5.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Kitchen-Faucets2';


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
    'Kitchen6.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Kitchen-Faucets2';











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
    'یونیورست',
    ' ',
    'Universet',
    '#ffffff',
    'Universet',
    ' '
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
    'یونیورست دوحالته کروم',
    0,
    'UniversetChrome.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Universet';


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
    'یونیورست دوحالته مشکی طلایی',
    0,
    'UniversetBlackGold.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Universet';


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
    'یونیورست دوحالته طلایی',
    0,
    'UniversetGold.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Universet';


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
    'یونیکا',
    0,
    'Unica.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Universet';

















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
    'فلاش تانک',
    ' ',
    'FlashTank',
    '#ffffff',
    'FlashTank',
    ' '
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
    'فلاش تانک ۱',
    0,
    'FlashTank1.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'FlashTank';


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
    'فلاش تانک ۲',
    0,
    'FlashTank2.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'FlashTank';


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
    'فلاش تانک ۳',
    0,
    'FlashTank3.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'FlashTank';


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
    'فلاش تانک ۴',
    0,
    'FlashTank4.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'FlashTank';












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
    'شلنگ توالت',
    ' ',
    'Toilet-hose',
    '#ffffff',
    'Toilet hose',
    ' '
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
    'رزگلد',
    0,
    'RoseGold.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Toilet-hose';


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
    'گلد',
    0,
    'Gold.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Toilet-hose';


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
    'کروم',
    0,
    'Chrome.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Toilet-hose';


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
    'مشکی',
    0,
    'Black.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Toilet-hose';

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
    'سفید',
    0,
    'White.png',
    '',
    100,
    TRUE
FROM series
WHERE folder_name = 'Toilet-hose';
