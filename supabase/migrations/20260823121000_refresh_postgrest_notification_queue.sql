-- Supabase's documented recovery for a stale PostgREST schema cache when
-- reload notifications are not being received. This is read-only and
-- non-disruptive.
SELECT pg_notification_queue_usage();
