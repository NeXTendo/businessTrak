-- ============================================================
-- Migration 023: expenses
-- FK: vehicles, employees, user_profiles
-- Depends on: 009_vehicles, 008_employees, 004_user_profiles
-- ============================================================

CREATE TABLE public.expenses (
  id             UUID             PRIMARY KEY DEFAULT uuid_generate_v4(),
  category       expense_category NOT NULL DEFAULT 'other',
  description    TEXT             NOT NULL,
  amount         NUMERIC(18,2)    NOT NULL,
  currency       VARCHAR(10)      NOT NULL DEFAULT 'ZMW',
  amount_zmw     NUMERIC(18,2)    NOT NULL,
  expense_date   DATE             NOT NULL DEFAULT CURRENT_DATE,
  vehicle_id     UUID             REFERENCES public.vehicles(id) ON DELETE SET NULL,
  employee_id    UUID             REFERENCES public.employees(id) ON DELETE SET NULL,
  payment_method payment_method,
  reference_no   TEXT,
  receipt_url    TEXT,
  recorded_by    UUID             REFERENCES public.user_profiles(id),
  created_at     TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_expenses_category ON public.expenses(category);
CREATE INDEX idx_expenses_date     ON public.expenses(expense_date);
CREATE INDEX idx_expenses_vehicle  ON public.expenses(vehicle_id);

CREATE TRIGGER trg_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "expenses: staff can read all"
  ON public.expenses FOR SELECT
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));

CREATE POLICY "expenses: finance and super_admin manage"
  ON public.expenses FOR ALL
  USING (get_user_role() IN ('super_admin','finance'));

CREATE POLICY "expenses: staff write"
  ON public.expenses FOR ALL
  USING (get_user_role() IN ('super_admin','admin','finance','worker'));
