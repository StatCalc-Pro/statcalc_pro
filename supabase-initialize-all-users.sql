-- Script para inicializar TODOS os usuários existentes de uma vez
-- Execute este SQL no Supabase para corrigir todos os usuários

-- Primeiro, verificar se as tabelas existem e criar se necessário
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan_type TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  analyses_count INTEGER DEFAULT 0,
  exports_count INTEGER DEFAULT 0,
  stripe_subscription_id TEXT,
  last_reset TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir subscriptions para TODOS os usuários que não têm (apenas colunas que existem)
INSERT INTO public.subscriptions (user_id, plan_type, status)
SELECT 
  au.id,
  'free',
  'active'
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.subscriptions s WHERE s.user_id = au.id
);

-- Inserir usage_tracking para TODOS os usuários que não têm (com month_year obrigatório)
INSERT INTO public.usage_tracking (user_id, analyses_count, month_year)
SELECT 
  au.id,
  0,
  TO_CHAR(NOW(), 'YYYY-MM')
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.usage_tracking ut WHERE ut.user_id = au.id
);

-- Verificar quantos usuários foram processados
SELECT 
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM public.subscriptions) as users_with_subscriptions,
  (SELECT COUNT(*) FROM public.usage_tracking) as users_with_usage;