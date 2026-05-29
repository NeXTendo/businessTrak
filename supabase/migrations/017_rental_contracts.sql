-- ============================================================
-- Migration 017: rental_contracts
-- FK: rentals
-- Depends on: 014_rentals
-- ============================================================

CREATE TABLE public.rental_contracts (
  id                  UUID             PRIMARY KEY DEFAULT uuid_generate_v4(),
  rental_id           UUID             NOT NULL REFERENCES public.rentals(id) ON DELETE CASCADE,
  pdf_url             TEXT,
  signature_method    signature_method,
  is_signed           BOOLEAN          NOT NULL DEFAULT FALSE,
  signed_at           TIMESTAMPTZ,
  signature_image_url TEXT,
  signed_by_name      TEXT,
  generated_at        TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  created_at          TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rental_contracts_rental ON public.rental_contracts(rental_id);

CREATE TRIGGER trg_rental_contracts_updated_at
  BEFORE UPDATE ON public.rental_contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE public.rental_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rental_contracts: staff can read all"
  ON public.rental_contracts FOR SELECT
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));

CREATE POLICY "rental_contracts: customer sees own contract"
  ON public.rental_contracts FOR SELECT
  USING (rental_id IN (
    SELECT id FROM public.rentals WHERE customer_id IN (
      SELECT id FROM public.customers WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "rental_contracts: customer updates own contract signature"
  ON public.rental_contracts FOR UPDATE
  USING (rental_id IN (
    SELECT id FROM public.rentals WHERE customer_id IN (
      SELECT id FROM public.customers WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "rental_contracts: admin and super_admin manage"
  ON public.rental_contracts FOR ALL
  USING (get_user_role() IN ('super_admin','admin'));
