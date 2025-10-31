import { supabase } from './supabaseClient';

export const initializeUserData = async (userId: string) => {
  try {
    // Criar assinatura se não existir
    await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_type: 'free',
        status: 'active'
      })
      .catch(() => null); // Ignorar se já existe

    // Inicializar uso do mês atual se não existir
    const currentMonth = new Date().toISOString().slice(0, 7);
    await supabase
      .from('usage_tracking')
      .insert({
        user_id: userId,
        month_year: currentMonth,
        analyses_count: 0
      })
      .catch(() => null); // Ignorar se já existe

    return { success: true };
  } catch (error) {
    console.error('Erro ao inicializar dados do usuário:', error);
    return { success: false, error };
  }
};