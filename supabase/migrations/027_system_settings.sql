-- ============================================================
-- Migration 027: system_settings
-- FK: none
-- Depends on: none
-- ============================================================

CREATE TABLE public.system_settings (
  id               UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name     TEXT          NOT NULL DEFAULT 'Chatowa Investments',
  company_email    TEXT          NOT NULL DEFAULT 'chatowainvestments@gmail.com',
  company_phone    TEXT          NOT NULL DEFAULT '+260968887055',
  company_address  TEXT          NOT NULL DEFAULT 'Plot 000, Woodlands',
  company_city     TEXT          NOT NULL DEFAULT 'Lusaka',
  logo_url         TEXT,
  default_currency VARCHAR(10)   NOT NULL DEFAULT 'ZMW',
  late_fee_rate    NUMERIC(5,2)  NOT NULL DEFAULT 10.00,
  vat_rate         NUMERIC(5,2)  NOT NULL DEFAULT 16.00,
  whatsapp_enabled BOOLEAN       NOT NULL DEFAULT FALSE,
  email_enabled    BOOLEAN       NOT NULL DEFAULT FALSE,
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed initial settings row
INSERT INTO public.system_settings (id) VALUES ('00000000-0000-0000-0000-000000000000');

-- RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "system_settings: anyone can read settings"
  ON public.system_settings FOR SELECT
  USING (TRUE);

CREATE POLICY "system_settings: admin and super_admin manage"
  ON public.system_settings FOR ALL
  USING (get_user_role() IN ('super_admin','admin'));
