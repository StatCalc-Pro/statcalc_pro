-- Script para corrigir erro de cadastro de usuários
-- Execute no SQL Editor do Supabase

-- 1. Adicionar month_year na tabela usage_tracking se não existir
ALTER TABLE public.usage_tracking 
ADD COLUMN IF NOT EXISTS month_year TEXT NOT NULL DEFAULT TO_CHAR(NOW(), 'YYYY-MM');

-- 2. Recriar função do trigger com campos corretos
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Criar subscription gratuita
  INSERT INTO public.subscriptions (user_id, plan_type, status, created_at, updated_at)
  VALUES (NEW.id, 'free', 'active', NOW(), NOW())
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Criar usage tracking
  INSERT INTO public.usage_tracking (user_id, analyses_count, exports_count, month_year, created_at, updated_at)
  VALUES (NEW.id, 0, 0, TO_CHAR(NOW(), 'YYYY-MM'), NOW(), NOW())
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recriar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();