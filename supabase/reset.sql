-- PulseAí — reset seguro do banco para recomeçar do zero
-- Use este arquivo ANTES de rodar supabase/schema.sql e supabase/seed.sql.
-- Ele remove somente objetos do PulseAí no schema public e buckets criados para o MVP.

-- 1) Remover views de dashboard
DROP VIEW IF EXISTS public.business_dashboard_metrics CASCADE;
DROP VIEW IF EXISTS public.event_vibe_scores CASCADE;

-- 2) Remover tabelas do PulseAí
DROP TABLE IF EXISTS public.analytics_events CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.transport_requests CASCADE;
DROP TABLE IF EXISTS public.drivers CASCADE;
DROP TABLE IF EXISTS public.favorites CASCADE;
DROP TABLE IF EXISTS public.reactions CASCADE;
DROP TABLE IF EXISTS public.checkins CASCADE;
DROP TABLE IF EXISTS public.menu_items CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.businesses CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 3) Remover tipos/enums do PulseAí
DROP TYPE IF EXISTS public.order_status CASCADE;
DROP TYPE IF EXISTS public.transport_status CASCADE;
DROP TYPE IF EXISTS public.vehicle_preference CASCADE;
DROP TYPE IF EXISTS public.transport_kind CASCADE;
DROP TYPE IF EXISTS public.vibe_reaction_type CASCADE;
DROP TYPE IF EXISTS public.event_status CASCADE;
DROP TYPE IF EXISTS public.business_status CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;

-- 4) Limpar buckets de imagens criados pelo MVP
DELETE FROM storage.objects
WHERE bucket_id IN ('avatars', 'business-covers', 'event-covers', 'menu-items');

DELETE FROM storage.buckets
WHERE id IN ('avatars', 'business-covers', 'event-covers', 'menu-items');

-- 5) Mensagem final de conferência
SELECT 'Reset PulseAí concluído. Agora rode schema.sql e depois seed.sql.' AS status;
