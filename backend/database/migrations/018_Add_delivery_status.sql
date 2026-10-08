BEGIN;

-- =========================================================
-- 1. Add new columns
-- =========================================================

ALTER TABLE orders
ADD COLUMN delivery_address TEXT;

ALTER TABLE orders
ADD COLUMN payment_status VARCHAR(30);

ALTER TABLE orders
ADD COLUMN delivery_status VARCHAR(30);


-- =========================================================
-- 2. Migrate old status -> payment_status
--
-- Old status:
--   pending   -> payment pending
--   paid      -> payment successful
--   failed    -> payment failed
--   cancelled -> payment pending
--
-- cancelled orders in the current data have no paid_at,
-- so we don't assume that a payment was actually made.
-- =========================================================

UPDATE orders
SET payment_status = CASE
    WHEN status = 'paid' THEN 'paid'
    WHEN status = 'failed' THEN 'failed'
    WHEN status = 'pending' THEN 'pending'
    WHEN status = 'cancelled' THEN 'pending'
END;


-- =========================================================
-- 3. Initialize delivery_status
--
-- Existing paid orders:
--   payment successful, delivery not started
--
-- Failed/cancelled orders:
--   delivery cancelled
--
-- Pending orders:
--   waiting
-- =========================================================

UPDATE orders
SET delivery_status = CASE
    WHEN status = 'paid' THEN 'pending'
    WHEN status = 'failed' THEN 'cancelled'
    WHEN status = 'cancelled' THEN 'cancelled'
    WHEN status = 'pending' THEN 'pending'
END;


-- =========================================================
-- 4. Set defaults for new orders
-- =========================================================

ALTER TABLE orders
ALTER COLUMN payment_status
SET DEFAULT 'pending';

ALTER TABLE orders
ALTER COLUMN delivery_status
SET DEFAULT 'pending';


-- =========================================================
-- 5. Validate payment status
-- =========================================================

ALTER TABLE orders
ADD CONSTRAINT orders_payment_status_check
CHECK (
    payment_status IN (
        'pending',
        'paid',
        'failed'
    )
);


-- =========================================================
-- 6. Validate delivery status
-- =========================================================

ALTER TABLE orders
ADD CONSTRAINT orders_delivery_status_check
CHECK (
    delivery_status IN (
        'pending',
        'preparing',
        'shipped',
        'delivered',
        'cancelled'
    )
);


-- =========================================================
-- 7. New columns must not be NULL
-- =========================================================

ALTER TABLE orders
ALTER COLUMN payment_status SET NOT NULL;

ALTER TABLE orders
ALTER COLUMN delivery_status SET NOT NULL;


-- =========================================================
-- 8. Commit
-- =========================================================

COMMIT;