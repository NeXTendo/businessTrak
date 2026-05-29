-- ============================================================
-- Migration 016: rental_inspections
-- FK: rentals, user_profiles
-- Depends on: 014_rentals
-- ============================================================

CREATE TABLE public.rental_inspections (
  id                    UUID             PRIMARY KEY DEFAULT uuid_generate_v4(),
  rental_id             UUID             NOT NULL REFERENCES public.rentals(id) ON DELETE CASCADE,
  inspection_type       inspection_type  NOT NULL DEFAULT 'pre_rental',
  mileage               INTEGER          NOT NULL DEFAULT 0,
  fuel_level            fuel_level       NOT NULL DEFAULT 'full',
  damage_noted          BOOLEAN          NOT NULL DEFAULT FALSE,
  damage_notes          TEXT,
  photo_urls            TEXT[]           NOT NULL DEFAULT '{}',
  performed_by          UUID             NOT NULL REFERENCES public.user_profiles(id),
  customer_acknowledged BOOLEAN          NOT NULL DEFAULT FALSE,
  performed_at          TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  created_at            TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rental_inspections_rental ON public.rental_inspections(rental_id);

-- RLS
ALTER TABLE public.rental_inspections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rental_inspections: staff can read all"
  ON public.rental_inspections FOR SELECT
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));

CREATE POLICY "rental_inspections: customer sees own inspections"
  ON public.rental_inspections FOR SELECT
  USING (rental_id IN (
    SELECT id FROM public.rentals WHERE customer_id IN (
      SELECT id FROM public.customers WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "rental_inspections: worker can insert"
  ON public.rental_inspections FOR ALL
  USING (get_user_role() IN ('super_admin','admin','worker'));
