-- ============================================================
-- Migration 021: invoices
-- FK: rentals, sales, customers, user_profiles
-- Depends on: 014_rentals, 019_sales, 007_customers
-- ============================================================

CREATE SEQUENCE IF NOT EXISTS invoice_number_seq;

CREATE TABLE public.invoices (
  id             UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT          NOT NULL UNIQUE,
  rental_id      UUID          REFERENCES public.rentals(id) ON DELETE SET NULL,
  sale_id        UUID          REFERENCES public.sales(id) ON DELETE SET NULL,
  customer_id    UUID          NOT NULL REFERENCES public.customers(id),
  subtotal       NUMERIC(18,2) NOT NULL DEFAULT 0,
  discount       NUMERIC(18,2) NOT NULL DEFAULT 0,
  tax_amount     NUMERIC(18,2) NOT NULL DEFAULT 0,
  total_amount   NUMERIC(18,2) NOT NULL DEFAULT 0,
  currency       VARCHAR(10)   NOT NULL DEFAULT 'ZMW',
  total_zmw      NUMERIC(18,2) NOT NULL DEFAULT 0,
  is_paid        BOOLEAN       NOT NULL DEFAULT FALSE,
  paid_at        TIMESTAMPTZ,
  due_date       DATE,
  pdf_url        TEXT,
  generated_by   UUID          REFERENCES public.user_profiles(id),
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_customer ON public.invoices(customer_id);
CREATE INDEX idx_invoices_rental   ON public.invoices(rental_id);
CREATE INDEX idx_invoices_sale     ON public.invoices(sale_id);
CREATE INDEX idx_invoices_invoice_no ON public.invoices(invoice_number);

CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number := 'INV-' || TO_CHAR(NOW(), 'YYMM') || '-' || LPAD(NEXTVAL('invoice_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoices_number
  BEFORE INSERT ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION generate_invoice_number();

CREATE TRIGGER trg_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoices: staff can read all"
  ON public.invoices FOR SELECT
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));

CREATE POLICY "invoices: customer sees own invoices"
  ON public.invoices FOR SELECT
  USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

CREATE POLICY "invoices: finance and super_admin manage"
  ON public.invoices FOR ALL
  USING (get_user_role() IN ('super_admin','finance'));

CREATE POLICY "invoices: staff write"
  ON public.invoices FOR ALL
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));
