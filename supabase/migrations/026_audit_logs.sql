-- ============================================================
-- Migration 026: audit_logs
-- FK: user_profiles
-- Depends on: 004_user_profiles
-- ============================================================

CREATE TABLE public.audit_logs (
  id           UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID         REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  user_role    user_role,
  user_name    TEXT,
  action       audit_action NOT NULL,
  module       TEXT         NOT NULL,
  record_id    UUID,
  record_type  TEXT,
  description  TEXT         NOT NULL,
  before_state JSONB,
  after_state  JSONB,
  ip_address   TEXT,
  device_info  TEXT,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user   ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_module ON public.audit_logs(module);

-- RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs: super_admin and admin see all"
  ON public.audit_logs FOR SELECT
  USING (get_user_role() IN ('super_admin','admin'));

CREATE POLICY "audit_logs: system inserts"
  ON public.audit_logs FOR INSERT
  WITH CHECK (TRUE);
