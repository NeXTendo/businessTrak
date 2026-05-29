-- ============================================================
-- Migration 007: customers
-- FK: user_profiles (user_id, blacklisted_by, created_by)
-- Must run before rentals, sales, invoices, receipts.
-- ============================================================

CREATE TABLE public.customers (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID        REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  full_name           TEXT        NOT NULL,
  email               TEXT,
  phone               TEXT        NOT NULL,
  alt_phone           TEXT,
  physical_address    TEXT,
  city                TEXT,
  country             TEXT        NOT NULL DEFAULT 'Zambia',
  id_type             TEXT        NOT NULL DEFAULT 'nrc',
  id_number           TEXT,
  id_document_url     TEXT,
  drivers_licence_url TEXT,
  drivers_licence_no  TEXT,
  is_blacklisted      BOOLEAN     NOT NULL DEFAULT FALSE,
  blacklist_reason    TEXT,
  blacklisted_at      TIMESTAMPTZ,
  blacklisted_by      UUID        REFERENCES public.user_profiles(id),
  notes               TEXT,
  created_by          UUID        REFERENCES public.user_profiles(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_phone       ON public.customers(phone);
CREATE INDEX idx_customers_blacklisted ON public.customers(is_blacklisted);
CREATE INDEX idx_customers_user_id     ON public.customers(user_id);

CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customers: staff can read all"
  ON public.customers FOR SELECT
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));

CREATE POLICY "customers: customer sees own record"
  ON public.customers FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "customers: admin and super_admin manage"
  ON public.customers FOR ALL
  USING (get_user_role() IN ('super_admin','admin'));

CREATE POLICY "customers: customer updates own record"
  ON public.customers FOR UPDATE
  USING (user_id = auth.uid());
