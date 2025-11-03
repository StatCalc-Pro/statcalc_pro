# Debug Webhook - Pagamento não atualizou

## 1. Verificar Logs do Supabase

No dashboard do Supabase:
1. Ir em **Edge Functions**
2. Clicar em **stripe-webhooks**
3. Ver **Logs** - deve mostrar se o webhook foi chamado

## 2. Verificar Webhook no Stripe

No Stripe Dashboard:
1. **Developers** → **Webhooks**
2. Clicar no seu webhook
3. Aba **Attempts** - ver se há tentativas e status codes

## 3. Verificar Banco de Dados

No Supabase:
1. **Table Editor** → **subscriptions**
2. Verificar se há registro para seu user_id
3. Verificar campos: `stripe_customer_id`, `stripe_subscription_id`, `status`

## 4. Possíveis Problemas

### Webhook não configurado:
- URL errada no Stripe
- Eventos não selecionados
- Webhook secret incorreto

### Variáveis de ambiente:
- `STRIPE_WEBHOOK_SECRET` não configurado
- `STRIPE_SECRET_KEY` incorreto

### Banco de dados:
- Tabela subscriptions não existe
- RLS policies bloqueando

## 5. Teste Manual

Testar se webhook está funcionando:
```bash
curl -X POST https://[PROJECT_ID].supabase.co/functions/v1/stripe-webhooks \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

Deve retornar erro de signature (esperado).

## 6. Próximos Passos

1. Verificar logs do Supabase
2. Verificar attempts no Stripe
3. Confirmar variáveis de ambiente
4. Testar webhook manualmente