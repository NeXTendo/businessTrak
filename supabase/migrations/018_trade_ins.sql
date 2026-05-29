-- ============================================================
-- Migration 018: trade_ins
-- FK: user_profiles, vehicles
-- Depends on: 004_user_profiles, 009_vehicles
-- ============================================================

CREATE TABLE public.trade_ins (
  id                 UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  make               TEXT          NOT NULL,
  model              TEXT          NOT NULL,
  year               SMALLINT      NOT NULL,
  registration_no    TEXT,
  color              TEXT,
  mileage            INTEGER,
  condition_notes    TEXT,
  valued_at          NUMERIC(18,2) NOT NULL,
  valuation_currency VARCHAR(10)   NOT NULL DEFAULT 'ZMW',
  valued_by          UUID          REFERENCES public.user_profiles(id),
  entered_fleet      BOOLEAN       NOT NULL DEFAULT FALSE,
  fleet_vehicle_id   UUID          REFERENCES public.vehicles(id) ON DELETE SET NULL,
  photo_urls         TEXT[]        NOT NULL DEFAULT '{}',
  created_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_trade_ins_updated_at
  BEFORE UPDATE ON public.trade_ins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE public.trade_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trade_ins: staff can read all"
  ON public.trade_ins FOR SELECT
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));

CREATE POLICY "trade_ins: super_admin and admin manage"
  ON public.trade_ins FOR ALL
  USING (get_user_role() IN ('super_admin','admin'));

CREATE POLICY "trade_ins: worker and finance write"
  ON public.trade_ins FOR ALL
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));
