-- ============================================================
-- Migration 013: vehicle_timeline
-- FK: vehicles, user_profiles
-- Depends on: 009_vehicles
-- ============================================================

CREATE TABLE public.vehicle_timeline (
  id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id     UUID        NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  event          TEXT        NOT NULL,
  description    TEXT,
  reference_id   UUID,
  reference_type TEXT,
  mileage        INTEGER,
  performed_by   UUID        REFERENCES public.user_profiles(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicle_timeline_vehicle ON public.vehicle_timeline(vehicle_id);

-- RLS
ALTER TABLE public.vehicle_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vehicle_timeline: staff can read all"
  ON public.vehicle_timeline FOR SELECT
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));

CREATE POLICY "vehicle_timeline: staff can insert"
  ON public.vehicle_timeline FOR INSERT
  WITH CHECK (get_user_role() IN ('super_admin','admin','finance','worker'));
