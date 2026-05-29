-- ============================================================
-- Migration 012: vehicle_maintenance
-- FK: vehicles, user_profiles
-- Depends on: 009_vehicles
-- ============================================================

CREATE TABLE public.vehicle_maintenance (
  id                   UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id           UUID          NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  service_type         TEXT          NOT NULL,
  description          TEXT,
  service_date         DATE          NOT NULL,
  mileage_at_service   INTEGER,
  cost                 NUMERIC(18,2),
  currency             VARCHAR(10)   NOT NULL DEFAULT 'ZMW',
  service_provider     TEXT,
  next_service_date    DATE,
  next_service_mileage INTEGER,
  receipt_url          TEXT,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicle_maint_vehicle ON public.vehicle_maintenance(vehicle_id);
CREATE INDEX idx_vehicle_maint_date    ON public.vehicle_maintenance(service_date);

CREATE TRIGGER trg_vehicle_maintenance_updated_at
  BEFORE UPDATE ON public.vehicle_maintenance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE public.vehicle_maintenance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vehicle_maintenance: staff can read all"
  ON public.vehicle_maintenance FOR SELECT
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));

CREATE POLICY "vehicle_maintenance: admin and super_admin manage"
  ON public.vehicle_maintenance FOR ALL
  USING (get_user_role() IN ('super_admin','admin'));

CREATE POLICY "vehicle_maintenance: worker can create and update"
  ON public.vehicle_maintenance FOR ALL
  USING (get_user_role() = 'worker');
