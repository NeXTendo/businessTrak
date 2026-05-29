-- ============================================================
-- Migration 019: sales
-- FK: customers, vehicles, trade_ins, user_profiles
-- Depends on: 007_customers, 009_vehicles, 018_trade_ins
-- ============================================================

CREATE SEQUENCE IF NOT EXISTS sale_number_seq;

CREATE TABLE public.sales (
  id                   UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_number          TEXT          NOT NULL UNIQUE,
  customer_id          UUID          NOT NULL REFERENCES public.customers(id),
  vehicle_id           UUID          NOT NULL REFERENCES public.vehicles(id),
  trade_in_id          UUID          REFERENCES public.trade_ins(id) ON DELETE SET NULL,
  sale_type            sale_type     NOT NULL DEFAULT 'full_payment',
  sale_status          sale_status   NOT NULL DEFAULT 'pending',
  asking_price         NUMERIC(18,2) NOT NULL DEFAULT 0,
  agreed_price         NUMERIC(18,2) NOT NULL DEFAULT 0,
  currency             VARCHAR(10)   NOT NULL DEFAULT 'ZMW',
  agreed_price_zmw     NUMERIC(18,2) NOT NULL DEFAULT 0,
  trade_in_value       NUMERIC(18,2) NOT NULL DEFAULT 0,
  top_up_amount        NUMERIC(18,2),
  down_payment         NUMERIC(18,2) NOT NULL DEFAULT 0,
  installment_count    INTEGER,
  installment_amount   NUMERIC(18,2),
  installment_interval TEXT,
  next_payment_date    DATE,
  total_paid           NUMERIC(18,2) NOT NULL DEFAULT 0,
  balance_due          NUMERIC(18,2) DEFAULT 0,
  completed_at         TIMESTAMPTZ,
  created_by           UUID          REFERENCES public.user_profiles(id),
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sales_customer  ON public.sales(customer_id);
CREATE INDEX idx_sales_vehicle   ON public.sales(vehicle_id);
CREATE INDEX idx_sales_status    ON public.sales(sale_status);
CREATE INDEX idx_sales_sale_no   ON public.sales(sale_number);

CREATE OR REPLACE FUNCTION generate_sale_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sale_number IS NULL THEN
    NEW.sale_number := 'SAL-' || TO_CHAR(NOW(), 'YYMM') || '-' || LPAD(NEXTVAL('sale_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sales_number
  BEFORE INSERT ON public.sales
  FOR EACH ROW EXECUTE FUNCTION generate_sale_number();

CREATE TRIGGER trg_sales_updated_at
  BEFORE UPDATE ON public.sales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sales: staff can read all"
  ON public.sales FOR SELECT
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));

CREATE POLICY "sales: customer sees own sales"
  ON public.sales FOR SELECT
  USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

CREATE POLICY "sales: admin and super_admin manage"
  ON public.sales FOR ALL
  USING (get_user_role() IN ('super_admin','admin'));

CREATE POLICY "sales: staff insert/update"
  ON public.sales FOR ALL
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));
