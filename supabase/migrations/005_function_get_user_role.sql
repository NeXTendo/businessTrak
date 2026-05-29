-- ============================================================
-- Migration 005: get_user_role() helper
-- Must run AFTER user_profiles exists (it queries that table).
-- Used inside all RLS policies below.
-- ============================================================

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.user_profiles
  WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- Policies for public.user_profiles (require get_user_role())
-- ============================================================

CREATE POLICY "user_profiles: super_admin sees all"
  ON public.user_profiles FOR SELECT
  USING (get_user_role() = 'super_admin');

CREATE POLICY "user_profiles: staff sees own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "user_profiles: user updates own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "user_profiles: super_admin manages all"
  ON public.user_profiles FOR ALL
  USING (get_user_role() = 'super_admin');
