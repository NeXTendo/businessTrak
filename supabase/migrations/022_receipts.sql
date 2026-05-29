-- ============================================================
-- Migration 022: receipts
-- FK: invoices, rentals, sales, customers, user_profiles
-- Depends on: 021_invoices, 014_rentals, 019_sales, 007_customers
-- ============================================================

CREATE SEQUENCE IF NOT EXISTS receipt_number_seq;

CREATE TABLE public.receipts (
  id             UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_number TEXT           NOT NULL UNIQUE,
  invoice_id     UUID           REFERENCES public.invoices(id) ON DELETE SET NULL,
  rental_id      UUID           REFERENCES public.rentals(id) ON DELETE SET NULL,
  sale_id        UUID           REFERENCES public.sales(id) ON DELETE SET NULL,
  customer_id    UUID           NOT NULL REFERENCES public.customers(id),
  amount_paid    NUMERIC(18,2)  NOT NULL,
  currency       VARCHAR(10)    NOT NULL DEFAULT 'ZMW',
  amount_zmw     NUMERIC(18,2)  NOT NULL,
  payment_method payment_method NOT NULL DEFAULT 'cash',
  reference_no   TEXT,
  pdf_url        TEXT,
  issued_by      UUID           REFERENCES public.user_profiles(id),
  created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_receipts_customer   ON public.receipts(customer_id);
CREATE INDEX idx_receipts_invoice    ON public.receipts(invoice_id);
CREATE INDEX idx_receipts_receipt_no ON public.receipts(receipt_number);

CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.receipt_number IS NULL THEN
    NEW.receipt_number := 'RCP-' || TO_CHAR(NOW(), 'YYMM') || '-' || LPAD(NEXTVAL('receipt_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_receipts_number
  BEFORE INSERT ON public.receipts
  FOR EACH ROW EXECUTE FUNCTION generate_receipt_number();

CREATE TRIGGER trg_receipts_updated_at
  BEFORE UPDATE ON public.receipts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "receipts: staff can read all"
  ON public.receipts FOR SELECT
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));

CREATE POLICY "receipts: customer sees own receipts"
  ON public.receipts FOR SELECT
  USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

CREATE POLICY "receipts: finance and super_admin manage"
  ON public.receipts FOR ALL
  USING (get_user_role() IN ('super_admin','finance'));

CREATE POLICY "receipts: staff write"
  ON public.receipts FOR ALL
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));
