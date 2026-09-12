-- Run once in Supabase SQL Editor if insert fails with:
-- "Could not find the 'jwt_token' column of 'credentials' in the schema cache"

-- Add jwt_token if missing (matches supabase-schema.sql)
ALTER TABLE public.credentials
  ADD COLUMN IF NOT EXISTS jwt_token text;

-- Backfill existing rows so you can enforce NOT NULL later if needed
UPDATE public.credentials
SET jwt_token = ''
WHERE jwt_token IS NULL;

-- Optional: require token on new rows after backfill (uncomment if you want strict NOT NULL)
-- ALTER TABLE public.credentials ALTER COLUMN jwt_token SET NOT NULL;

-- Align with supabase-schema.sql: spend limits (fixes "spend_per_transaction" / "spend_limit" not in schema cache)
ALTER TABLE public.credentials
  ADD COLUMN IF NOT EXISTS spend_limit numeric(12, 2) NOT NULL DEFAULT 10000.00;

ALTER TABLE public.credentials
  ADD COLUMN IF NOT EXISTS spend_per_transaction numeric(12, 2) NOT NULL DEFAULT 1000.00;

-- If you still have a legacy column `per_txn_limit` and no data in `spend_per_transaction`, run:
-- UPDATE public.credentials SET spend_per_transaction = per_txn_limit WHERE per_txn_limit IS NOT NULL;

-- If PostgREST still caches old schema, wait ~1 minute or restart the project API
