
CREATE TABLE password_reset_codes (

    id SERIAL PRIMARY KEY,

    customer_id INTEGER NOT NULL,

    code VARCHAR(6) NOT NULL,

    expires_at TIMESTAMP NOT NULL,

    used BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT password_reset_codes_customer_id_fkey
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE CASCADE

);

