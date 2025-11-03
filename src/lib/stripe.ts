import { loadStripe } from '@stripe/stripe-js';

// Inicializar Stripe com chave pública
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Price IDs dos planos (substituir pelos IDs reais do Stripe)
export const STRIPE_PRICES = {
  TEST_FREE: 'price_1SP7q2PMcRymeCXlNQqEEp5g', // R$ 0/mês - Plano de teste
  PRO_MONTHLY: 'price_1SP7L7PMcRymeCXlkrhzGot3', // R$ 59/mês - Substituir pelo price ID real
} as const;