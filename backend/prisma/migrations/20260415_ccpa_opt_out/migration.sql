-- Migration: CCPA Do Not Sell / Do Not Share opt-out fields
-- CCPA §1798.120 / CPRA §1798.135 — right to opt out of sale and sharing
-- of personal information to third parties.
--
-- Datacendia does NOT sell personal information. However, CCPA/CPRA requires
-- a "Do Not Sell or Share My Personal Information" mechanism for any business
-- meeting the revenue/data-volume thresholds, as a precautionary measure.
--
-- Fields added to users table:
--   ccpa_opt_out      — true if user has opted out of data sale/sharing
--   ccpa_opt_out_at   — timestamp of opt-out for compliance records
--   ccpa_data_category_preferences — JSON: per-category sharing preferences

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS ccpa_opt_out              BOOLEAN     NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS ccpa_opt_out_at           TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ccpa_data_category_prefs  JSONB       NOT NULL DEFAULT '{}';

-- Index for efficient bulk compliance queries
CREATE INDEX IF NOT EXISTS idx_users_ccpa_opt_out
  ON users (ccpa_opt_out)
  WHERE ccpa_opt_out = TRUE;

-- Audit record of migration
COMMENT ON COLUMN users.ccpa_opt_out IS
  'CCPA §1798.120 / CPRA §1798.135 — Do Not Sell or Share opt-out flag';
COMMENT ON COLUMN users.ccpa_opt_out_at IS
  'Timestamp when CCPA opt-out was exercised';
COMMENT ON COLUMN users.ccpa_data_category_prefs IS
  'CPRA per-category sharing preferences: {"analytics": false, "advertising": false, "thirdParty": false}';
