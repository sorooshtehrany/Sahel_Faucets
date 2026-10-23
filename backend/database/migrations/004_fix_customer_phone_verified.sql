DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'customers'
          AND column_name = 'phone_varified'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'customers'
          AND column_name = 'phone_verified'
    ) THEN
        ALTER TABLE customers
        RENAME COLUMN phone_varified TO phone_verified;
    END IF;
END $$;
