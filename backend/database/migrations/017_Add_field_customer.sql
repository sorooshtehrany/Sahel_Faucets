ALTER TABLE password_reset_codes
ADD COLUMN purpose VARCHAR(30) NOT NULL DEFAULT 'password_reset';