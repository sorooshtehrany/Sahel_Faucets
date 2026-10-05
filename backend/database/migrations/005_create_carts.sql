CREATE TABLE carts (
    id SERIAL PRIMARY KEY,

    customer_id INTEGER NOT NULL UNIQUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT carts_customer_id_fkey
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE CASCADE
);


CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,

    cart_id INTEGER NOT NULL,

    product_id INTEGER NOT NULL,

    quantity INTEGER NOT NULL CHECK (quantity > 0),

    CONSTRAINT cart_items_cart_id_fkey
        FOREIGN KEY (cart_id)
        REFERENCES carts(id)
        ON DELETE CASCADE,

    CONSTRAINT cart_items_product_id_fkey
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT cart_items_cart_product_unique
        UNIQUE (cart_id, product_id)
);