import { loadStripe } from '@stripe/stripe-js';

// Inicializar Stripe com chave pública
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Price IDs dos planos (substituir pelos IDs reais do Stripe)
export const STRIPE_PRICES = {
  STUDENT_MONTHLY: 'price_1SY9NrPMcRymeCXl2lPCIXBX', // R$ 9/mês - Criar no Stripe
  PRO_MONTHLY: 'price_1SY9O3PMcRymeCXlLRXNv2aB', // R$ 19/mês - Criar no Stripe  
  ENTERPRISE_MONTHLY: 'price_1SY9P0PMcRymeCXlJcCUtVkM', // R$ 99/mês - Criar no Stripe
} as const;