-- ============================================================
-- Migration 015: rental_payments
-- FK: rentals, user_profiles
-- Depends on: 014_rentals
-- ============================================================

CREATE TABLE public.rental_payments (
  id             UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  rental_id      UUID           NOT NULL REFERENCES public.rentals(id) ON DELETE CASCADE,
  amount         NUMERIC(18,2)  NOT NULL,
  currency       VARCHAR(10)    NOT NULL DEFAULT 'ZMW',
  amount_zmw     NUMERIC(18,2)  NOT NULL,
  payment_method payment_method NOT NULL DEFAULT 'cash',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  payment_date   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  reference_no   TEXT,
  is_deposit     BOOLEAN        NOT NULL DEFAULT FALSE,
  confirmed_by   UUID           REFERENCES public.user_profiles(id),
  created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rental_payments_rental    ON public.rental_payments(rental_id);
CREATE INDEX idx_rental_payments_status    ON public.rental_payments(payment_status);

CREATE TRIGGER trg_rental_payments_updated_at
  BEFORE UPDATE ON public.rental_payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE public.rental_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rental_payments: staff can read all"
  ON public.rental_payments FOR SELECT
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));

CREATE POLICY "rental_payments: customer sees own payments"
  ON public.rental_payments FOR SELECT
  USING (rental_id IN (
    SELECT id FROM public.rentals WHERE customer_id IN (
      SELECT id FROM public.customers WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "rental_payments: finance and super_admin manage"
  ON public.rental_payments FOR ALL
  USING (get_user_role() IN ('super_admin','finance'));

CREATE POLICY "rental_payments: staff insert/update"
  ON public.rental_payments FOR ALL
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));
