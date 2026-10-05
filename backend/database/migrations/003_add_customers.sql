CREATE TABLE customers (
    id SERIAL PRIMARY KEY,

    first_name VARCHAR(100) NOT NULL,

    last_name VARCHAR(100) NOT NULL,

    phone VARCHAR(20) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    phone_verified BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);