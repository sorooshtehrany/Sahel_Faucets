-- =========================================================
-- 013_create_orders_and_payments.sql
-- Orders + Order Items + Payments
-- =========================================================


-- =========================================================
-- Orders
-- =========================================================

CREATE TABLE orders (

    id SERIAL PRIMARY KEY,

    customer_id INTEGER NOT NULL,

    total_amount NUMERIC(12,2) NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'pending',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    paid_at TIMESTAMP NULL,

    CONSTRAINT orders_customer_id_fkey
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE RESTRICT,

    CONSTRAINT orders_total_amount_check
        CHECK (total_amount >= 0),

    CONSTRAINT orders_status_check
        CHECK (
            status IN (
                'pending',
                'paid',
                'failed',
                'cancelled'
            )
        )

);


-- =========================================================
-- Order Items
-- =========================================================

CREATE TABLE order_items (

    id SERIAL PRIMARY KEY,

    order_id INTEGER NOT NULL,

    product_id INTEGER NOT NULL,

    product_name VARCHAR(100) NOT NULL,

    unit_price NUMERIC(12,2) NOT NULL,

    quantity INTEGER NOT NULL,

    total_price NUMERIC(12,2) NOT NULL,

    CONSTRAINT order_items_order_id_fkey
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT order_items_product_id_fkey
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT order_items_unit_price_check
        CHECK (unit_price >= 0),

    CONSTRAINT order_items_quantity_check
        CHECK (quantity > 0),

    CONSTRAINT order_items_total_price_check
        CHECK (total_price >= 0)

);


-- =========================================================
-- Payments
-- =========================================================

CREATE TABLE payments (

    id SERIAL PRIMARY KEY,

    order_id INTEGER NOT NULL,

    amount NUMERIC(12,2) NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'pending',

    authority VARCHAR(255),

    reference_id VARCHAR(255),

    gateway VARCHAR(50),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    paid_at TIMESTAMP NULL,

    CONSTRAINT payments_order_id_fkey
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE RESTRICT,

    CONSTRAINT payments_amount_check
        CHECK (amount > 0),

    CONSTRAINT payments_status_check
        CHECK (
            status IN (
                'pending',
                'paid',
                'failed',
                'cancelled'
            )
        )

);


-- =========================================================
-- Indexes
-- =========================================================

CREATE INDEX idx_orders_customer_id
    ON orders(customer_id);

CREATE INDEX idx_orders_status
    ON orders(status);

CREATE INDEX idx_order_items_order_id
    ON order_items(order_id);

CREATE INDEX idx_order_items_product_id
    ON order_items(product_id);

CREATE INDEX idx_payments_order_id
    ON payments(order_id);

CREATE INDEX idx_payments_authority
    ON payments(authority);

