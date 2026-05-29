-- ============================================================
-- Migration 009: vehicles
-- FK: user_profiles (created_by)
-- Must run before vehicle_images, vehicle_documents,
-- vehicle_maintenance, vehicle_timeline, rentals, sales,
-- trade_ins, expenses.
-- ============================================================

CREATE TABLE public.vehicles (
  id                  UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_no     TEXT              NOT NULL UNIQUE,
  vin                 TEXT              UNIQUE,
  engine_number       TEXT,
  chassis_number      TEXT,
  make                TEXT              NOT NULL,
  model               TEXT              NOT NULL,
  year                SMALLINT          NOT NULL,
  color               TEXT,
  fuel_type           fuel_type         NOT NULL DEFAULT 'petrol',
  transmission        transmission_type NOT NULL DEFAULT 'automatic',
  mileage             INTEGER           NOT NULL DEFAULT 0,
  seat_capacity       SMALLINT,
  purchase_price      NUMERIC(18,2),
  purchase_currency   VARCHAR(10)       NOT NULL DEFAULT 'ZMW',
  selling_price       NUMERIC(18,2),
  selling_currency    VARCHAR(10)       NOT NULL DEFAULT 'ZMW',
  rental_rate_daily   NUMERIC(18,2),
  rental_rate_weekly  NUMERIC(18,2),
  rental_rate_monthly NUMERIC(18,2),
  rental_currency     VARCHAR(10)       NOT NULL DEFAULT 'ZMW',
  driver_rate_daily   NUMERIC(18,2),
  status              vehicle_status    NOT NULL DEFAULT 'available',
  is_published        BOOLEAN           NOT NULL DEFAULT FALSE,
  has_driver_option   BOOLEAN           NOT NULL DEFAULT FALSE,
  insurance_expiry    DATE,
  road_tax_expiry     DATE,
  description         TEXT,
  features            TEXT[],
  acquired_at         DATE,
  created_by          UUID              REFERENCES public.user_profiles(id),
  created_at          TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicles_status       ON public.vehicles(status);
CREATE INDEX idx_vehicles_is_published ON public.vehicles(is_published);
CREATE INDEX idx_vehicles_make_model   ON public.vehicles(make, model);
CREATE INDEX idx_vehicles_reg          ON public.vehicles(registration_no);

CREATE TRIGGER trg_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vehicles: all staff can read all"
  ON public.vehicles FOR SELECT
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));

CREATE POLICY "vehicles: public can read published+available"
  ON public.vehicles FOR SELECT
  USING (is_published = TRUE AND status IN ('available','reserved'));

CREATE POLICY "vehicles: admin and super_admin manage"
  ON public.vehicles FOR ALL
  USING (get_user_role() IN ('super_admin','admin'));

CREATE POLICY "vehicles: worker updates status only"
  ON public.vehicles FOR UPDATE
  USING (get_user_role() = 'worker');
