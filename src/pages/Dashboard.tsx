import { useState, useEffect } from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileUp, BarChart3, FileText, TrendingUp, Crown, Trash2, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { trackEvent } from "@/lib/vercel-analytics";

import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";
import { isFeatureEnabled } from "@/lib/featureFlags";

const Dashboard = () => {
  useScrollToTop();
  const { userPlan } = useSubscription();
  // Load recent analyses from localStorage/history (fallback to sessionStorage)
  const [history, setHistory] = useState<any[]>([]);
  const [recentAnalyses, setRecentAnalyses] = useState<Array<{ id: number; name: string; date: string; auc: number }>>([]);

  useEffect(() => {
    try {
      const rawHist = localStorage.getItem("analysesHistory");
      if (rawHist) {
        const parsed = JSON.parse(rawHist);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          setRecentAnalyses(parsed.slice(0, 10).map((p: any, idx: number) => ({ id: p.id ?? idx + 1, name: p.name ?? "Análise", date: p.date ?? "", auc: p.auc ?? 0 })));
          return;
        }
      }

      // fallback: try single last result in sessionStorage
      const raw = sessionStorage.getItem("results");
      if (raw) {
        const parsed = JSON.parse(raw);
        const auc = parsed?.summary?.auc ?? 0;
        const date = parsed?.date ?? new Date().toISOString().split("T")[0];
        const single = [{ id: Date.now(), name: parsed?.name ?? "Última análise", date, auc }];
        setHistory(single);
        setRecentAnalyses(single);
      }
    } catch (e) {
      console.error("Falha ao carregar análises recentes", e);
    }
  }, []);

  // Track a dashboard view event when the component mounts.
  useEffect(() => {
    // Avoid sending sensitive identifiers; prefer anonymous IDs or none.
    trackEvent("Dashboard_view", { plan: "trial" });
  }, []);

  const totalAnalyses = history.length;
  const avgAuc = history.length ? history.reduce((s, h) => s + (Number(h.auc) || 0), 0) / history.length : 0;
  const totalRecords = history.reduce((s, h) => s + (Number(h.studiesCount) || 0), 0);
  const reportsGenerated = history.length; // number of saved analyses (treated as generated reports)

  const removeAnalysis = (id: number) => {
    if (!confirm("Remover esta análise do histórico? Esta ação não pode ser desfeita.")) return;
    const newHist = history.filter((h) => h.id !== id);
    setHistory(newHist);
    setRecentAnalyses(newHist.slice(0, 10).map((p: any, idx: number) => ({ id: p.id ?? idx + 1, name: p.name ?? "Análise", date: p.date ?? "", auc: p.auc ?? 0 })));
    try {
      localStorage.setItem("analysesHistory", JSON.stringify(newHist));
    } catch (e) {
      console.error("Falha ao salvar histórico após remoção", e);
    }
  };

  return (
    <div className="space-y-8">
       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Painel</h1>
          <p className="text-muted-foreground text-lg">
            Bem-vindo de volta! Inicie uma nova análise ou revise seus cálculos recentes.
          </p>
        </div>
        
        {isFeatureEnabled('SHOW_PRICING_PAGE') && userPlan.type === 'free' && (
          <Link to="/pricing">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Crown className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">Plano Atual</span>
                    <Badge variant="outline" className="text-xs">Teste Grátis</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Faça upgrade para desbloquear mais recursos
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground ml-2" />
              </CardContent>
            </Card>
          </Link>
        )}
        </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Análises</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalAnalyses}</div>
            <p className="text-xs text-muted-foreground mt-1">baseado no histórico local</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AUC Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{history.length ? avgAuc.toFixed(2) : "—"}</div>
            <p className="text-xs text-muted-foreground mt-1">Entre análises armazenadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dados Processados</CardTitle>
            <FileUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalRecords.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Registros analisados (soma dos estudos)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relatórios Gerados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{reportsGenerated}</div>
            <p className="text-xs text-muted-foreground mt-1">Análises salvas (local)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Início Rápido</CardTitle>
            <CardDescription>Comece uma nova análise estatística</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/calculator">
              <Button className="w-full justify-start gap-2" size="lg">
                <FileUp className="h-5 w-5" />
                Carregar Novo Dataset
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>
            <Link to="/help">
              <Button variant="outline" className="w-full justify-start gap-2" size="lg">
                <FileText className="h-5 w-5" />
                Ver Documentação
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análises Recentes</CardTitle>
            <CardDescription>Seus cálculos estatísticos mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">{analysis.name}</p>
                    <p className="text-xs text-muted-foreground">{analysis.date}</p>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <p className="text-sm font-bold text-primary">AUC: {analysis.auc}</p>
                    <Link to="/results">
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                        Ver Resultados
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => removeAnalysis(analysis.id)} title="Remover do histórico">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
