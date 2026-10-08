CREATE INDEX IF NOT EXISTS
    ix_payments_pending_order
ON payments (order_id)
WHERE status = 'pending';