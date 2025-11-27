import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { 
        status: 401,
        headers: corsHeaders 
      });
    }

    // Verificar se é GOD MASTER
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response('Unauthorized', { 
        status: 401,
        headers: corsHeaders 
      });
    }

    // Verificar se tem plano god_master
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_type')
      .eq('user_id', user.id)
      .single();

    if (subscription?.plan_type !== 'god_master') {
      return new Response('Forbidden', { 
        status: 403,
        headers: corsHeaders 
      });
    }

    if (req.method === 'GET') {
      // Listar usuários
      const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) throw listError;

      // Buscar subscriptions
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*');

      // Buscar usage
      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('*');

      // Combinar dados
      const usersWithData = authUsers.users.map(authUser => {
        const userSub = subscriptions?.find(sub => sub.user_id === authUser.id);
        const userUsage = usage?.find(u => u.user_id === authUser.id);
        
        return {
          id: authUser.id,
          email: authUser.email,
          created_at: authUser.created_at,
          user_metadata: authUser.user_metadata,
          subscription: userSub,
          usage: userUsage
        };
      });

      return new Response(
        JSON.stringify({ users: usersWithData, subscriptions, usage }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    if (req.method === 'PUT') {
      // Atualizar plano de usuário
      const { userId, planType } = await req.json();
      
      const { error } = await supabase
        .from('subscriptions')
        .update({ plan_type: planType })
        .eq('user_id', userId);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    if (req.method === 'DELETE') {
      // Deletar usuário
      const { userId } = await req.json();
      
      // Deletar registros relacionados primeiro
      await supabase.from('subscriptions').delete().eq('user_id', userId);
      await supabase.from('usage_tracking').delete().eq('user_id', userId);
      
      // Deletar usuário
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Admin error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
});