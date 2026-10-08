-- =====================================================
-- Prevent multiple pending orders for the same customer
-- =====================================================

CREATE UNIQUE INDEX IF NOT EXISTS
    ux_orders_one_pending_per_customer
ON orders (customer_id)
WHERE status = 'pending';