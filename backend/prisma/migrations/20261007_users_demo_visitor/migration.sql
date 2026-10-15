-- Accounts created by the landing page demo form (POST /auth/demo-access).
-- The form reopens only these, without a password. Set by the server only;
-- existing accounts stay false.
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "demo_visitor" BOOLEAN NOT NULL DEFAULT false;
