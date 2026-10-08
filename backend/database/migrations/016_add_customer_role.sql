ALTER TABLE customers
ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'customer';

ALTER TABLE customers
ADD CONSTRAINT customers_role_check
CHECK (role IN ('customer', 'admin'));