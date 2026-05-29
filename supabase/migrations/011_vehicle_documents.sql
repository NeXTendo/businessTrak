-- ============================================================
-- Migration 011: vehicle_documents
-- FK: vehicles, user_profiles
-- Depends on: 009_vehicles
-- ============================================================

CREATE TABLE public.vehicle_documents (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id   UUID        NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  doc_name     TEXT        NOT NULL,
  url          TEXT        NOT NULL,
  storage_path TEXT        NOT NULL,
  expiry_date  DATE,
  uploaded_by  UUID        REFERENCES public.user_profiles(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicle_docs_vehicle ON public.vehicle_documents(vehicle_id);

-- RLS
ALTER TABLE public.vehicle_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vehicle_documents: staff only"
  ON public.vehicle_documents FOR ALL
  USING (get_user_role() IN ('super_admin','admin','finance'));
