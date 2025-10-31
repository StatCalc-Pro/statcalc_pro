# Configuração do Supabase

## 1. Executar SQL no Supabase

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Vá para seu projeto
3. Clique em "SQL Editor" no menu lateral
4. Cole e execute o conteúdo do arquivo `supabase-setup.sql`

## 2. Verificar Configuração

Após executar o SQL, verifique se as tabelas foram criadas:

```sql
-- Verificar tabelas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('subscriptions', 'usage_tracking');

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('subscriptions', 'usage_tracking');
```

## 3. Testar Autenticação

1. Registre um novo usuário
2. Verifique se foi criada uma entrada em `subscriptions`
3. Faça uma análise e verifique se foi criada entrada em `usage_tracking`

## 4. Estrutura das Tabelas

### subscriptions
- `user_id`: Referência ao usuário
- `plan_type`: 'free', 'pro', 'enterprise'
- `status`: 'active', 'canceled', 'past_due'
- `stripe_subscription_id`: ID da assinatura no Stripe (futuro)

### usage_tracking
- `user_id`: Referência ao usuário
- `month_year`: Formato '2024-01'
- `analyses_count`: Número de análises no mês

## 5. Segurança (RLS)

- Usuários só podem ver/editar seus próprios dados
- Políticas automáticas aplicadas
- Triggers para criar dados padrão

## 6. Próximos Passos

- [ ] Integração com Stripe
- [ ] Edge Functions para webhooks
- [ ] Sistema de notificações
- [ ] Analytics de uso