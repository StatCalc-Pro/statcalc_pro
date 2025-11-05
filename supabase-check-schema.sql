-- Verificar estrutura das tabelas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'subscriptions' AND table_schema = 'public';

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'usage_tracking' AND table_schema = 'public';