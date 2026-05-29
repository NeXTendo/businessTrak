-- ============================================================
-- Migration 020: sale_payments
-- FK: sales, user_profiles
-- Depends on: 019_sales
-- ============================================================

CREATE TABLE public.sale_payments (
  id              UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id         UUID           NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  amount          NUMERIC(18,2)  NOT NULL,
  currency        VARCHAR(10)    NOT NULL DEFAULT 'ZMW',
  amount_zmw      NUMERIC(18,2)  NOT NULL,
  payment_method  payment_method NOT NULL DEFAULT 'cash',
  payment_status  payment_status NOT NULL DEFAULT 'pending',
  payment_date    TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  reference_no    TEXT,
  is_down_payment BOOLEAN        NOT NULL DEFAULT FALSE,
  installment_no  INTEGER,
  confirmed_by    UUID           REFERENCES public.user_profiles(id),
  created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sale_payments_sale    ON public.sale_payments(sale_id);
CREATE INDEX idx_sale_payments_status  ON public.sale_payments(payment_status);

CREATE TRIGGER trg_sale_payments_updated_at
  BEFORE UPDATE ON public.sale_payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE public.sale_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sale_payments: staff can read all"
  ON public.sale_payments FOR SELECT
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));

CREATE POLICY "sale_payments: customer sees own payments"
  ON public.sale_payments FOR SELECT
  USING (sale_id IN (
    SELECT id FROM public.sales WHERE customer_id IN (
      SELECT id FROM public.customers WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "sale_payments: finance and super_admin manage"
  ON public.sale_payments FOR ALL
  USING (get_user_role() IN ('super_admin','finance'));

CREATE POLICY "sale_payments: staff insert/update"
  ON public.sale_payments FOR ALL
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));
