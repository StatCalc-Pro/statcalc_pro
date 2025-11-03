import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

export const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createCheckoutSession = async (priceId: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: { 
          priceId, 
          userId: user.id 
        },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) throw error;
      
      // Redirecionar para Stripe Checkout
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Erro no checkout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { 
    createCheckoutSession, 
    loading 
  };
};