-- ============================================================
-- Migration 006: currencies
-- No FK to other tables except user_profiles (updated_by).
-- Must run before any table that stores a currency code.
-- ============================================================

CREATE TABLE public.currencies (
  id             UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  code           VARCHAR(10)   NOT NULL UNIQUE,
  name           TEXT          NOT NULL,
  symbol         VARCHAR(10)   NOT NULL,
  rate_to_zmw    NUMERIC(18,6) NOT NULL DEFAULT 1,
  is_base        BOOLEAN       NOT NULL DEFAULT FALSE,
  is_active      BOOLEAN       NOT NULL DEFAULT TRUE,
  updated_by     UUID          REFERENCES public.user_profiles(id),
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_currencies_updated_at
  BEFORE UPDATE ON public.currencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed base currencies
INSERT INTO public.currencies (code, name, symbol, rate_to_zmw, is_base) VALUES
  ('ZMW', 'Zambian Kwacha',    'K',  1.000000,  TRUE),
  ('USD', 'US Dollar',         '$',  27.000000, FALSE),
  ('ZAR', 'South African Rand','R',  1.450000,  FALSE),
  ('GBP', 'British Pound',     '£',  34.000000, FALSE),
  ('EUR', 'Euro',              '€',  29.000000, FALSE);

-- RLS
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "currencies: all staff can read"
  ON public.currencies FOR SELECT
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));

CREATE POLICY "currencies: public can read active"
  ON public.currencies FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "currencies: finance and super_admin manage"
  ON public.currencies FOR ALL
  USING (get_user_role() IN ('super_admin','finance'));
