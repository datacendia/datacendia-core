-- SOC 2 Security Hardening Migration
-- April 15, 2026
-- Adds: account lockout fields, LOCKED user status, hashed password reset tokens

-- =============================================================================
-- 1. Account Lockout Fields (CC6.7 — Brute-Force Protection)
-- =============================================================================

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "locked_until"           TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS "last_failed_at"         TIMESTAMPTZ;

-- =============================================================================
-- 2. Add LOCKED value to UserStatus enum
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = 'UserStatus'::regtype
      AND enumlabel  = 'LOCKED'
  ) THEN
    ALTER TYPE "UserStatus" ADD VALUE 'LOCKED';
  END IF;
END
$$;

-- =============================================================================
-- 3. password_resets — Replace plaintext token with SHA-256 hash
-- =============================================================================

-- Add the new hashed column (nullable initially for backward-compat)
ALTER TABLE "password_resets"
  ADD COLUMN IF NOT EXISTS "token_hash" TEXT;

-- Drop any old unique constraint on the plaintext token column if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'password_resets' AND column_name = 'token'
  ) THEN
    -- Migrate existing tokens: hash them in-place (hex-encode existing value as SHA-256)
    UPDATE "password_resets"
    SET "token_hash" = encode(digest("token", 'sha256'), 'hex')
    WHERE "token_hash" IS NULL AND "token" IS NOT NULL;

    -- Drop the old plaintext column
    ALTER TABLE "password_resets" DROP COLUMN IF EXISTS "token";
  END IF;
END
$$;

-- Make token_hash NOT NULL and UNIQUE now that it's populated
ALTER TABLE "password_resets"
  ALTER COLUMN "token_hash" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "password_resets_token_hash_key"
  ON "password_resets"("token_hash");

CREATE INDEX IF NOT EXISTS "password_resets_token_hash_idx"
  ON "password_resets"("token_hash");

-- =============================================================================
-- 4. Performance indexes for lockout lookups
-- =============================================================================

CREATE INDEX IF NOT EXISTS "users_locked_until_idx"
  ON "users"("locked_until")
  WHERE "locked_until" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "users_failed_login_attempts_idx"
  ON "users"("failed_login_attempts")
  WHERE "failed_login_attempts" > 0;
