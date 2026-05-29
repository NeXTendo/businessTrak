-- ============================================================
-- Migration 003: Shared Helper Functions & Triggers
-- update_updated_at() is reused by every table with updated_at.
-- Must run before any table creation.
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
