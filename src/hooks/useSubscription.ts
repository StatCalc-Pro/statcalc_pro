import { useState, useEffect } from 'react';
import { PlanType, UserPlan, PLAN_FEATURES, hasFeature, canCreateAnalysis } from '@/lib/subscription';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

export const useSubscription = () => {
  const { user } = useAuth();
  const [userPlan, setUserPlan] = useState<UserPlan>({
    type: 'free',
    analysesUsed: 0,
    analysesLimit: 5,
    features: PLAN_FEATURES.free.features
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserPlan = async () => {
      if (!user) {
        // Usuário não logado - usar localStorage para demo
        const stored = localStorage.getItem('userPlan');
        if (stored) {
          setUserPlan(JSON.parse(stored));
        }
        setIsLoading(false);
        return;
      }

      try {
        // Buscar assinatura do usuário
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Buscar uso do mês atual
        const currentMonth = new Date().toISOString().slice(0, 7);
        const { data: usage } = await supabase
          .from('usage_tracking')
          .select('analyses_count')
          .eq('user_id', user.id)
          .eq('month_year', currentMonth)
          .single();

        const planType = subscription?.plan_type || 'free';
        const analysesUsed = usage?.analyses_count || 0;

        setUserPlan({
          type: planType,
          analysesUsed,
          analysesLimit: PLAN_FEATURES[planType].analysesLimit,
          features: PLAN_FEATURES[planType].features
        });
      } catch (error) {
        console.error('Erro ao carregar plano:', error);
        // Fallback para plano free em caso de erro
        setUserPlan({
          type: 'free',
          analysesUsed: 0,
          analysesLimit: 5,
          features: PLAN_FEATURES.free.features
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserPlan();
  }, [user]);

  const incrementUsage = async () => {
    if (!user) {
      // Fallback para localStorage se não logado
      const newPlan = { ...userPlan, analysesUsed: userPlan.analysesUsed + 1 };
      setUserPlan(newPlan);
      localStorage.setItem('userPlan', JSON.stringify(newPlan));
      return;
    }

    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      
      // Incrementar uso no banco
      const { error } = await supabase
        .from('usage_tracking')
        .upsert({
          user_id: user.id,
          month_year: currentMonth,
          analyses_count: userPlan.analysesUsed + 1
        }, {
          onConflict: 'user_id,month_year'
        });

      if (!error) {
        setUserPlan(prev => ({ ...prev, analysesUsed: prev.analysesUsed + 1 }));
      }
    } catch (error) {
      console.error('Erro ao incrementar uso:', error);
    }
  };

  return {
    userPlan,
    hasFeature: (feature: string) => hasFeature(userPlan, feature),
    canCreateAnalysis: () => canCreateAnalysis(userPlan),
    incrementUsage,
    isLoading
  };
};