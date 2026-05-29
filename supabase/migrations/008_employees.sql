-- ============================================================
-- Migration 008: employees
-- FK: user_profiles (user_id, created_by)
-- Must run before rentals (assigned_driver_id) and expenses.
-- ============================================================

CREATE TABLE public.employees (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID        UNIQUE REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  full_name       TEXT        NOT NULL,
  email           TEXT,
  phone           TEXT        NOT NULL,
  role            user_role   NOT NULL,
  department      TEXT,
  hire_date       DATE        NOT NULL,
  end_date        DATE,
  is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
  salary_amount   NUMERIC(18,2),
  salary_currency VARCHAR(10) NOT NULL DEFAULT 'ZMW',
  national_id     TEXT,
  address         TEXT,
  emergency_contact_name  TEXT,
  emergency_contact_phone TEXT,
  notes           TEXT,
  created_by      UUID        REFERENCES public.user_profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_employees_role      ON public.employees(role);
CREATE INDEX idx_employees_is_active ON public.employees(is_active);

CREATE TRIGGER trg_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "employees: super_admin and admin see all"
  ON public.employees FOR SELECT
  USING (get_user_role() IN ('super_admin','admin'));

CREATE POLICY "employees: worker sees own record"
  ON public.employees FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "employees: finance sees salary data"
  ON public.employees FOR SELECT
  USING (get_user_role() = 'finance');

CREATE POLICY "employees: super_admin manages all"
  ON public.employees FOR ALL
  USING (get_user_role() = 'super_admin');
