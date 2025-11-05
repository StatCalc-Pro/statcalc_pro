-- Script para corrigir usuários existentes que não têm registros nas tabelas

-- Inserir subscriptions para usuários que não têm
INSERT INTO public.subscriptions (user_id, plan_type, status, created_at, updated_at)
SELECT 
  au.id,
  'free',
  'active',
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public.subscriptions s ON au.id = s.user_id
WHERE s.user_id IS NULL;

-- Inserir usage_tracking para usuários que não têm
INSERT INTO public.usage_tracking (user_id, analyses_count, exports_count, created_at, updated_at)
SELECT 
  au.id,
  0,
  0,
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public.usage_tracking ut ON au.id = ut.user_id
WHERE ut.user_id IS NULL;