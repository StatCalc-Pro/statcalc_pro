# 🚨 CORREÇÕES CRÍTICAS PARA PRODUÇÃO

## ❌ PROBLEMAS CRÍTICOS ENCONTRADOS

### 1. Webhook Stripe com Bug Fatal
**Arquivo**: `supabase/functions/stripe-webhooks/index.ts`
**Problema**: Usando campo `type` em vez de `plan_type`

```typescript
// ❌ ERRO - linha 85
type: planType,

// ✅ CORREÇÃO
plan_type: planType,
```

### 2. Variáveis de Ambiente Faltando
**Arquivo**: `.env`
**Problema**: Stripe não configurado

```bash
# ❌ FALTANDO
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Edge Functions Não Deployadas
**Problema**: Funções existem mas não estão no Supabase

```bash
# ❌ ERRO 404 nas funções
https://ezgtqmellbcpngboqbod.supabase.co/functions/v1/admin-users
```

## 🔧 CORREÇÕES APLICADAS

### 1. Corrigir Webhook Stripe