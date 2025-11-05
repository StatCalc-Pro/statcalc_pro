import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Settings, Crown, RefreshCw, Database, Shield } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { PlanType, PLAN_FEATURES } from "@/lib/subscription";
import { useAuth } from "@/lib/auth";
import { initializeUserData } from "@/lib/userInit";
import { supabase } from "@/lib/supabaseClient";

export const DevPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userPlan } = useSubscription();
  const { user } = useAuth();

  const changePlan = async (newPlan: PlanType) => {
    if (!user) {
      // Fallback para localStorage se não logado
      const newUserPlan = {
        type: newPlan,
        analysesUsed: userPlan.analysesUsed,
        analysesLimit: PLAN_FEATURES[newPlan].analysesLimit,
        features: PLAN_FEATURES[newPlan].features
      };
      localStorage.setItem('userPlan', JSON.stringify(newUserPlan));
      window.location.reload();
      return;
    }

    // Atualizar no Supabase para usuários logados
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ plan_type: newPlan })
        .eq('user_id', user.id);
      
      if (!error) {
        window.location.reload();
      } else {
        console.error('Erro ao atualizar plano:', error);
      }
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
    }
  };

  const resetUsage = async () => {
    if (!user) {
      // Fallback para localStorage se não logado
      const resetPlan = { ...userPlan, analysesUsed: 0 };
      localStorage.setItem('userPlan', JSON.stringify(resetPlan));
      window.location.reload();
      return;
    }

    // Reset no Supabase para usuários logados
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { error } = await supabase
        .from('usage_tracking')
        .update({ analyses_count: 0 })
        .eq('user_id', user.id)
        .eq('month_year', currentMonth);
      
      if (!error) {
        window.location.reload();
      } else {
        console.error('Erro ao resetar uso:', error);
      }
    } catch (error) {
      console.error('Erro ao resetar uso:', error);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          variant="outline"
          className="bg-background shadow-lg"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Dev Panel</CardTitle>
            <Button
              onClick={() => setIsOpen(false)}
              size="sm"
              variant="ghost"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Status GOD MASTER */}
          <div className="text-center p-3 bg-red-50 border border-red-200 rounded">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Crown className="h-4 w-4 text-red-600" />
              <Badge variant="destructive">GOD MASTER</Badge>
            </div>
            <p className="text-xs text-red-600 font-medium">
              Acesso Total • Poderes Ilimitados
            </p>
          </div>

          {/* Simulação de Planos */}
          <div>
            <p className="text-xs font-medium mb-2">🎭 Simular Planos:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => changePlan('free')}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                👤 Free
              </Button>
              <Button
                onClick={() => changePlan('pro')}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                💎 Premium
              </Button>
            </div>
          </div>

          {/* Ferramentas de Debug */}
          <div>
            <p className="text-xs font-medium mb-2">🔧 Debug Tools:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={resetUsage}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                🔄 Reset
              </Button>
              <Button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                🗑️ Clear
              </Button>
            </div>
          </div>

          {/* Feature Flags */}
          <div>
            <p className="text-xs font-medium mb-2">🚩 Feature Flags:</p>
            <div className="space-y-1">
              <Button
                onClick={() => {
                  const flags = JSON.parse(localStorage.getItem('featureFlags') || '{}');
                  flags.ENABLE_ONBOARDING = !flags.ENABLE_ONBOARDING;
                  localStorage.setItem('featureFlags', JSON.stringify(flags));
                  window.location.reload();
                }}
                size="sm"
                variant={JSON.parse(localStorage.getItem('featureFlags') || '{}').ENABLE_ONBOARDING ? 'default' : 'outline'}
                className="w-full text-xs"
              >
                {JSON.parse(localStorage.getItem('featureFlags') || '{}').ENABLE_ONBOARDING ? '✅' : '❌'} Onboarding
              </Button>
              <Button
                onClick={() => {
                  const flags = JSON.parse(localStorage.getItem('featureFlags') || '{}');
                  flags.SHOW_PRICING_PAGE = !flags.SHOW_PRICING_PAGE;
                  localStorage.setItem('featureFlags', JSON.stringify(flags));
                  window.location.reload();
                }}
                size="sm"
                variant={JSON.parse(localStorage.getItem('featureFlags') || '{}').SHOW_PRICING_PAGE ? 'default' : 'outline'}
                className="w-full text-xs"
              >
                {JSON.parse(localStorage.getItem('featureFlags') || '{}').SHOW_PRICING_PAGE ? '✅' : '❌'} Pricing
              </Button>
            </div>
          </div>

          {/* Ações de Admin */}
          <div>
            <p className="text-xs font-medium mb-2">👑 Admin Actions:</p>
            <div className="space-y-2">
              <Link to="/admin">
                <Button size="sm" variant="destructive" className="w-full">
                  <Shield className="h-3 w-3 mr-1" />
                  Painel Admin
                </Button>
              </Link>
              <Button
                onClick={async () => {
                  try {
                    const { data } = await supabase.from('subscriptions').select('count');
                    const { data: usage } = await supabase.from('usage_tracking').select('analyses_count');
                    const totalAnalyses = usage?.reduce((sum, u) => sum + u.analyses_count, 0) || 0;
                    alert(`📊 Stats:\n• Usuários: ${data?.length || 0}\n• Análises: ${totalAnalyses}`);
                  } catch (error) {
                    alert('Erro ao buscar stats');
                  }
                }}
                size="sm"
                variant="outline"
                className="w-full text-xs"
              >
                📊 Quick Stats
              </Button>
              <Button
                onClick={() => {
                  const info = {
                    userAgent: navigator.userAgent,
                    url: window.location.href,
                    timestamp: new Date().toISOString(),
                    localStorage: Object.keys(localStorage),
                    sessionStorage: Object.keys(sessionStorage)
                  };
                  console.log('🔍 Debug Info:', info);
                  alert('Debug info logged to console');
                }}
                size="sm"
                variant="outline"
                className="w-full text-xs"
              >
                🔍 Debug Info
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};