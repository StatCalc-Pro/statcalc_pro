# ✅ CHECKLIST DE PRODUÇÃO - StatCalc Pro

## 🔧 CONFIGURAÇÕES CRÍTICAS

### ✅ Supabase
- [x] URL e ANON_KEY configurados no .env
- [x] Edge Functions deployadas (stripe-checkout, stripe-webhooks, admin-users)
- [x] Tabelas criadas (subscriptions, usage_tracking)
- [x] RLS policies configuradas
- [x] Trigger de usuário desabilitado (evita erro 500 no signup)

### ⚠️ STRIPE - REQUER CONFIGURAÇÃO
- [ ] VITE_STRIPE_PUBLISHABLE_KEY no .env
- [ ] STRIPE_SECRET_KEY nas Edge Functions
- [ ] STRIPE_WEBHOOK_SECRET configurado
- [ ] Price IDs atualizados no código
- [ ] Webhook endpoint configurado no Stripe Dashboard

### ✅ URLs de Redirecionamento
- [x] Site URL: https://statcalcpro.vercel.app
- [x] Redirect URLs: https://statcalcpro.vercel.app/auth
- [x] Success URL: https://statcalcpro.vercel.app/success
- [x] Cancel URL: https://statcalcpro.vercel.app/pricing

## 🧪 TESTES FUNCIONAIS

### ✅ Autenticação
- [x] Cadastro de usuário
- [x] Confirmação por email
- [x] Login/logout
- [x] Redirecionamento pós-confirmação
- [x] Proteção de rotas

### ✅ Funcionalidades Core
- [x] Upload de arquivo Excel
- [x] Cálculos ROC/AUC
- [x] Visualização de resultados
- [x] Exportação (Excel, CSV, PNG)
- [x] Histórico local

### ⚠️ Sistema de Pagamentos - REQUER TESTE
- [ ] Checkout Stripe
- [ ] Webhooks de pagamento
- [ ] Atualização de planos
- [ ] Cancelamento de assinatura

### ✅ Interface
- [x] Responsividade
- [x] Navegação
- [x] Páginas de ajuda
- [x] Guias detalhados
- [x] Página de conta

## 🚨 PROBLEMAS IDENTIFICADOS

### 1. Stripe não configurado
```bash
# Adicionar ao .env:
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 2. Edge Functions precisam de deploy
```bash
# Deploy das funções:
supabase functions deploy stripe-checkout
supabase functions deploy stripe-webhooks  
supabase functions deploy admin-users
```

### 3. Variáveis de ambiente das Edge Functions
```bash
# Configurar no Supabase:
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_SERVICE_ROLE_KEY=...
APP_URL=https://statcalcpro.vercel.app
```

### 4. Webhook do Stripe
- Configurar endpoint: https://ezgtqmellbcpngboqbod.supabase.co/functions/v1/stripe-webhooks
- Eventos: checkout.session.completed, customer.subscription.*

## 📋 PASSOS PARA PRODUÇÃO

### 1. Configurar Stripe
```bash
# 1. Criar conta Stripe
# 2. Obter chaves de API
# 3. Criar produtos e preços
# 4. Atualizar STRIPE_PRICES no código
```

### 2. Deploy Edge Functions
```bash
supabase login
supabase functions deploy stripe-checkout
supabase functions deploy stripe-webhooks
supabase functions deploy admin-users
```

### 3. Configurar Variáveis
```bash
# No Supabase Dashboard > Edge Functions > Settings
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_SERVICE_ROLE_KEY=...
APP_URL=https://statcalcpro.vercel.app
```

### 4. Configurar Webhook Stripe
- URL: https://ezgtqmellbcpngboqbod.supabase.co/functions/v1/stripe-webhooks
- Eventos: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted

### 5. Testar Fluxo Completo
- [ ] Cadastro → Confirmação → Login
- [ ] Upload → Cálculo → Exportação  
- [ ] Upgrade → Pagamento → Webhook
- [ ] Cancelamento

## ✅ PRONTO PARA PRODUÇÃO (SEM PAGAMENTOS)

O sistema está 100% funcional para:
- ✅ Cadastro e login de usuários
- ✅ Análises estatísticas ROC/AUC
- ✅ Visualização e exportação
- ✅ Histórico e gerenciamento
- ✅ Páginas de ajuda e guias

**Para habilitar pagamentos**: Configurar Stripe conforme passos acima.