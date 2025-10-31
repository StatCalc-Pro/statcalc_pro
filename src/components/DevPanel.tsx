import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Crown, RefreshCw, Database } from "lucide-react";
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
    <div className="fixed bottom-4 right-4 z-50 w-80">
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
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4" />
              <span className="text-sm font-medium">Plano Atual:</span>
              <Badge variant={userPlan.type === 'free' ? 'secondary' : 'default'}>
                {userPlan.type}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Análises: {userPlan.analysesUsed}/{userPlan.analysesLimit === -1 ? '∞' : userPlan.analysesLimit}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium">Trocar Plano:</p>
            <div className="flex gap-2">
              <Button
                onClick={() => changePlan('free')}
                size="sm"
                variant={userPlan.type === 'free' ? 'default' : 'outline'}
              >
                Free
              </Button>
              <Button
                onClick={() => changePlan('pro')}
                size="sm"
                variant={userPlan.type === 'pro' ? 'default' : 'outline'}
              >
                Pro
              </Button>
              <Button
                onClick={() => changePlan('enterprise')}
                size="sm"
                variant={userPlan.type === 'enterprise' ? 'default' : 'outline'}
              >
                Enterprise
              </Button>
              <Button
                onClick={() => changePlan('god_master')}
                size="sm"
                variant={userPlan.type === 'god_master' ? 'destructive' : 'outline'}
              >
                GOD MASTER
              </Button>
            </div>
          </div>

          <Button
            onClick={async () => {
              if (user) {
                await initializeUserData(user.id);
                window.location.reload();
              }
            }}
            size="sm"
            variant="outline"
            className="w-full"
          >
            <Database className="h-3 w-3 mr-1" />
            Inicializar Dados
          </Button>

          <div>
            <p className="text-xs font-medium mb-2">Features Ativas:</p>
            <div className="flex flex-wrap gap-1">
              {userPlan.features.map((feature) => (
                <Badge key={feature} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={resetUsage}
            size="sm"
            variant="outline"
            className="w-full"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reset Uso
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};