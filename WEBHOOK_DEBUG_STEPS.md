# Webhook 200 OK mas sem logs - Debug

## Problema: Stripe retorna 200 OK mas Supabase não tem logs

Isso indica que o webhook não está chegando na Edge Function.

## Verificações:

### 1. URL do Webhook no Stripe
Confirmar se a URL está correta:
- Deve ser: `https://[PROJECT_ID].supabase.co/functions/v1/stripe-webhooks`
- **NÃO** deve ter `/` no final

### 2. Edge Function Deployada
No Supabase Dashboard:
- Edge Functions → Verificar se `stripe-webhooks` está listada
- Status deve ser "Active"
- Testar URL manualmente

### 3. Teste Manual da Function
```bash
curl https://[PROJECT_ID].supabase.co/functions/v1/stripe-webhooks
```
Deve retornar "No signature" (esperado)

### 4. Verificar Project ID
- No Supabase Dashboard → Settings → General
- Copiar o Project Reference ID correto
- Confirmar se a URL do webhook usa o ID certo

## Solução Rápida:

1. **Pegar URL correta**:
   - Supabase → Edge Functions → stripe-webhooks
   - Copiar a URL exata mostrada

2. **Atualizar no Stripe**:
   - Stripe → Webhooks → [seu webhook] → Edit
   - Colar a URL correta
   - Salvar

3. **Testar novamente**:
   - Fazer novo pagamento de teste
   - Verificar logs no Supabase