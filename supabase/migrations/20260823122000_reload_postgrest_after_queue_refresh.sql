-- Refresh the notification queue before asking PostgREST to rebuild its
-- schema and configuration caches.
SELECT pg_notification_queue_usage();
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
