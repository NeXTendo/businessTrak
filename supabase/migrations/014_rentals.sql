-- ============================================================
-- Migration 014: rentals
-- FK: customers, vehicles, employees
-- Depends on: 007_customers, 009_vehicles, 008_employees
-- ============================================================

CREATE SEQUENCE IF NOT EXISTS rental_number_seq;

CREATE TABLE public.rentals (
  id                 UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  rental_number      TEXT          NOT NULL UNIQUE,
  customer_id        UUID          NOT NULL REFERENCES public.customers(id),
  vehicle_id         UUID          NOT NULL REFERENCES public.vehicles(id),
  assigned_driver_id UUID          REFERENCES public.employees(id) ON DELETE SET NULL,
  start_date         DATE          NOT NULL,
  end_date           DATE          NOT NULL,
  actual_return_date DATE,
  with_driver        BOOLEAN       NOT NULL DEFAULT FALSE,
  status             rental_status NOT NULL DEFAULT 'inquiry',
  rate_type          TEXT          NOT NULL DEFAULT 'daily',
  rate_amount        NUMERIC(18,2) NOT NULL DEFAULT 0,
  currency           VARCHAR(10)   NOT NULL DEFAULT 'ZMW',
  rate_zmw           NUMERIC(18,2) NOT NULL DEFAULT 0,
  deposit_amount     NUMERIC(18,2) NOT NULL DEFAULT 0,
  deposit_paid       BOOLEAN       NOT NULL DEFAULT FALSE,
  deposit_returned   BOOLEAN       NOT NULL DEFAULT FALSE,
  driver_rate        NUMERIC(18,2) NOT NULL DEFAULT 0,
  total_amount       NUMERIC(18,2) DEFAULT 0,
  late_fee_amount    NUMERIC(18,2) NOT NULL DEFAULT 0,
  amount_paid        NUMERIC(18,2) NOT NULL DEFAULT 0,
  balance_due        NUMERIC(18,2) DEFAULT 0,
  pickup_location    TEXT,
  return_location    TEXT,
  special_notes      TEXT,
  created_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rentals_customer     ON public.rentals(customer_id);
CREATE INDEX idx_rentals_vehicle      ON public.rentals(vehicle_id);
CREATE INDEX idx_rentals_status       ON public.rentals(status);
CREATE INDEX idx_rentals_rental_no    ON public.rentals(rental_number);

CREATE OR REPLACE FUNCTION generate_rental_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.rental_number IS NULL THEN
    NEW.rental_number := 'RNT-' || TO_CHAR(NOW(), 'YYMM') || '-' || LPAD(NEXTVAL('rental_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_rentals_number
  BEFORE INSERT ON public.rentals
  FOR EACH ROW EXECUTE FUNCTION generate_rental_number();

CREATE TRIGGER trg_rentals_updated_at
  BEFORE UPDATE ON public.rentals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rentals: staff can read all"
  ON public.rentals FOR SELECT
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));

CREATE POLICY "rentals: customer sees own rentals"
  ON public.rentals FOR SELECT
  USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

CREATE POLICY "rentals: admin and super_admin manage"
  ON public.rentals FOR ALL
  USING (get_user_role() IN ('super_admin','admin'));

CREATE POLICY "rentals: staff insert/update"
  ON public.rentals FOR ALL
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));
