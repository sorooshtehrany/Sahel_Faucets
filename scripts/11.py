# ==========================================
# Series information
# ==========================================

name_fa = "انواع ظرفشویی"
finish_fa = " "

folder_name = "Kitchen-Faucets1"
color_code = "#ffffff"

name_en = "Kitchen Faucets"
finish_en = " "


# ==========================================
# Generate SQL
# ==========================================

sql = f"""
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
    '{name_fa}',
    '{finish_fa}',
    '{folder_name}',
    '{color_code}',
    '{name_en}',
    '{finish_en}'
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
WHERE folder_name = '{folder_name}';


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
WHERE folder_name = '{folder_name}';


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
WHERE folder_name = '{folder_name}';


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
WHERE folder_name = '{folder_name}';
"""

print(sql)
