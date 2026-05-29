-- ============================================================
-- Migration 024: payroll
-- FK: employees, user_profiles
-- Depends on: 008_employees, 004_user_profiles
-- ============================================================

CREATE TABLE public.payroll (
  id             UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id    UUID          NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  period_month   INTEGER       NOT NULL,
  period_year    INTEGER       NOT NULL,
  gross_salary   NUMERIC(18,2) NOT NULL DEFAULT 0,
  deductions     NUMERIC(18,2) NOT NULL DEFAULT 0,
  net_salary     NUMERIC(18,2) NOT NULL DEFAULT 0,
  currency       VARCHAR(10)   NOT NULL DEFAULT 'ZMW',
  net_zmw        NUMERIC(18,2) NOT NULL DEFAULT 0,
  payment_method TEXT,
  payment_date   DATE,
  is_paid        BOOLEAN       NOT NULL DEFAULT FALSE,
  paid_at        TIMESTAMPTZ,
  reference_no   TEXT,
  payslip_url    TEXT,
  processed_by   UUID          REFERENCES public.user_profiles(id),
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payroll_employee ON public.payroll(employee_id);
CREATE INDEX idx_payroll_period   ON public.payroll(period_year, period_month);

CREATE TRIGGER trg_payroll_updated_at
  BEFORE UPDATE ON public.payroll
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payroll: super_admin, admin and finance read all"
  ON public.payroll FOR SELECT
  USING (get_user_role() IN ('super_admin','admin','finance'));

CREATE POLICY "payroll: employee sees own payroll"
  ON public.payroll FOR SELECT
  USING (employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()));

CREATE POLICY "payroll: finance and super_admin manage"
  ON public.payroll FOR ALL
  USING (get_user_role() IN ('super_admin','finance'));
