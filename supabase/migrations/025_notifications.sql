-- ============================================================
-- Migration 025: notifications
-- FK: user_profiles
-- Depends on: 004_user_profiles
-- ============================================================

CREATE TABLE public.notifications (
  id             UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID              NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  type           notification_type NOT NULL DEFAULT 'general',
  title          TEXT              NOT NULL,
  message        TEXT              NOT NULL,
  reference_id   UUID,
  reference_type TEXT,
  is_read        BOOLEAN           NOT NULL DEFAULT FALSE,
  read_at        TIMESTAMPTZ,
  created_at     TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user    ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications: user sees own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "notifications: user updates own notification status"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "notifications: system/staff creates notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (TRUE);
