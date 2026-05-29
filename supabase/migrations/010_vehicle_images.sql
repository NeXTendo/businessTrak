-- ============================================================
-- Migration 010: vehicle_images
-- FK: vehicles, user_profiles
-- Depends on: 009_vehicles
-- ============================================================

CREATE TABLE public.vehicle_images (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id   UUID        NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  url          TEXT        NOT NULL,
  storage_path TEXT        NOT NULL,
  is_primary   BOOLEAN     NOT NULL DEFAULT FALSE,
  sort_order   SMALLINT    NOT NULL DEFAULT 0,
  uploaded_by  UUID        REFERENCES public.user_profiles(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicle_images_vehicle ON public.vehicle_images(vehicle_id);

-- RLS
ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vehicle_images: staff reads all"
  ON public.vehicle_images FOR SELECT
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));

CREATE POLICY "vehicle_images: public reads published vehicle images"
  ON public.vehicle_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.vehicles v
      WHERE v.id = vehicle_id AND v.is_published = TRUE
    )
  );

CREATE POLICY "vehicle_images: admin manages"
  ON public.vehicle_images FOR ALL
  USING (get_user_role() IN ('super_admin','admin'));
