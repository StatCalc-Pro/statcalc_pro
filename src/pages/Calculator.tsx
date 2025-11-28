import { useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, X, Sparkles, BarChart3, Download, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { computeMetrics, exportResultsJson } from "@/lib/metrics";
import { calculateAdvancedROC, bootstrapConfidenceInterval } from "@/lib/advancedMetrics";
import { RobustParser } from "@/lib/robustParser";
import { Input } from "@/components/ui/input";

import { useSubscription } from "@/hooks/useSubscription";
import { UpgradeModal } from "@/components/UpgradeModal";
import { getUpgradeMessage } from "@/lib/subscription";
import { isFeatureEnabled } from "@/lib/featureFlags";

const Calculator = () => {
  useScrollToTop();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [analysisName, setAnalysisName] = useState<string>("");
  const [pendingResult, setPendingResult] = useState<any | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { userPlan, canCreateAnalysis, incrementUsage } = useSubscription();

  const handleFileSelect = () => {
    inputRef.current?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      toast.error("Por favor selecione um arquivo Excel (.xlsx ou .xls)");
      return;
    }
    try {
      const loadingToast = toast.loading("Processando arquivo no navegador...");
      
      // read file as array buffer and parse using xlsx in browser
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const raw = XLSX.utils.sheet_to_json(sheet, { defval: null });

      // Usar parser robusto
      const parsedData = RobustParser.parseExcelData(raw as any[]);
      
      // Mostrar erros/sugestões se houver
      const allErrors = parsedData.flatMap(d => d.errors || []);
      const allSuggestions = parsedData.flatMap(d => d.suggestions || []);
      
      if (allErrors.length > 0) {
        toast.error(`Erros encontrados: ${allErrors.slice(0, 3).join(', ')}${allErrors.length > 3 ? '...' : ''}`);
      }
      if (allSuggestions.length > 0) {
        toast.warning(`Sugestões: ${allSuggestions.slice(0, 2).join(', ')}${allSuggestions.length > 2 ? '...' : ''}`);
      }

      const rows = computeMetrics(parsedData as any[]);
      
      // Calcular métricas avançadas
      const tpr = rows.map(r => r.tpr);
      const fpr = rows.map(r => r.fpr);
      const totalPositives = rows.reduce((sum, r) => sum + r.tp + r.fn, 0);
      const totalNegatives = rows.reduce((sum, r) => sum + r.tn + r.fp, 0);
      
      let advancedResults = null;
      if (totalPositives > 0 && totalNegatives > 0) {
        try {
          advancedResults = calculateAdvancedROC(tpr, fpr, totalPositives, totalNegatives);
          toast.success(`AUC: ${advancedResults.auc.toFixed(3)} (IC 95%: ${advancedResults.ci_lower.toFixed(3)}-${advancedResults.ci_upper.toFixed(3)})`);
        } catch (error) {
          console.error('Erro no cálculo avançado:', error);
        }
      }
      
      const json = exportResultsJson(rows);
      
      // Adicionar métricas avançadas ao resultado
      if (advancedResults) {
        json.summary.advanced = advancedResults;
        console.log('Métricas avançadas adicionadas:', advancedResults);
      }

      // set pending result and let user edit name before saving
      setPendingResult(json);
      setSelectedFile(file.name);
      setAnalysisName(file.name);
      
      toast.dismiss(loadingToast);
      toast.success("Arquivo processado — edite o nome se quiser e clique 'Process Data'");
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Falha ao processar arquivo");
    }
  };

  const handleProcess = async () => {
    // Verificar se pode criar análise (apenas se limitações estiverem ativas)
    if (isFeatureEnabled('ENABLE_SUBSCRIPTION_LIMITS') && !canCreateAnalysis(userPlan)) {
      setShowUpgradeModal(true);
      return;
    }

    // use pendingResult if available, otherwise fallback to sessionStorage (backwards compat)
    const json = pendingResult ?? (() => {
      try {
        const raw = sessionStorage.getItem("results");
        return raw ? JSON.parse(raw) : null;
      } catch { return null; }
    })();
    if (!json) {
      toast.error("Nenhum resultado disponível. Faça upload primeiro.");
      return;
    }

    setIsProcessing(true);
    
    // Simular processamento com delay para mostrar loading
    await new Promise(resolve => setTimeout(resolve, 2000));

    // build session payload using possibly edited name
    const date = new Date().toISOString().split("T")[0];
    const name = analysisName || selectedFile || json.name || "Análise";
    const sessionPayload = { ...json, name, date };
    sessionStorage.setItem("results", JSON.stringify(sessionPayload));

    // append to analyses history in localStorage (keep last 20)
    try {
      const entry = { id: Date.now(), name, date, auc: sessionPayload.summary?.auc ?? 0, studiesCount: (sessionPayload.studies || []).length };
      const rawHist = localStorage.getItem("analysesHistory");
      const hist = rawHist ? JSON.parse(rawHist) : [];
      hist.unshift(entry);
      const max = 20;
      const sliced = hist.slice(0, max);
      localStorage.setItem("analysesHistory", JSON.stringify(sliced));
    } catch (e) {
      console.error("Falha ao atualizar histórico de análises", e);
    }

    // Marcar uso diário para plano gratuito
    if (isFeatureEnabled('ENABLE_SUBSCRIPTION_LIMITS') && userPlan.type === 'free') {
      const today = new Date().toDateString();
      localStorage.setItem('lastAnalysisDate', today);
    }
    
    // Incrementar uso (apenas se limitações estiverem ativas)
    if (isFeatureEnabled('ENABLE_SUBSCRIPTION_LIMITS')) {
      incrementUsage();
    }
    
    setIsProcessing(false);
    toast.success("Processamento concluído!");
    // clear pending result and navigate
    setPendingResult(null);
    navigate("/results");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <input ref={inputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={onFileChange} />
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Calculadora de Área Sob a Curva ROC (AUC)
        </h1>
        <p className="text-muted-foreground text-lg">
          Uma ferramenta simples para calcular fórmulas estatísticas dos seus dados.
        </p>
        
        {isFeatureEnabled('SHOW_PLAN_BADGES') && userPlan.type === 'free' && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-primary/20">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Crown className="h-4 w-4 text-primary" />
              <span>Plano Gratuito: {userPlan.analysesUsed}/{userPlan.analysesLimit} análises usadas</span>
            </div>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">1. Carregue Seus Dados</CardTitle>
          <CardDescription>Por favor, carregue seus dados no formato .xlsx.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center">
                <FileUp className="h-8 w-8 text-accent-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium mb-1">Arraste e solte arquivo .xlsx aqui</p>
                <p className="text-sm text-muted-foreground mb-4">
                  ou clique no botão abaixo para selecionar um arquivo
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleFileSelect} size="lg">
                  <FileUp className="mr-2 h-4 w-4" />
                  Procurar Arquivos
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => {
                    const templateData = [
                      { id: "estudo_1", tp: "", fp: "", tn: "", fn: "" },
                      { id: "estudo_2", tp: "", fp: "", tn: "", fn: "" },
                      { id: "estudo_3", tp: "", fp: "", tn: "", fn: "" }
                    ];
                    const wb = XLSX.utils.book_new();
                    const ws = XLSX.utils.json_to_sheet(templateData);
                    XLSX.utils.book_append_sheet(wb, ws, "Template");
                    XLSX.writeFile(wb, "template_statcalc.xlsx");
                    toast.success("Template baixado: template_statcalc.xlsx");
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Template
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedFile && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">2. Arquivo Pronto para Processamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FileUp className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{selectedFile}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedFile(null);
                    sessionStorage.removeItem("results");
                    setPendingResult(null);
                    setAnalysisName("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium mb-2 block">Nome da Análise (pode editar)</label>
                <Input value={analysisName} onChange={(e) => setAnalysisName(e.target.value)} />
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={handleProcess} size="lg" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Processar Dados
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent">
            <CardHeader>
              <CardTitle className="text-2xl">3. Resultados dos Cálculos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground mb-2">
                  ÁREA SOB A CURVA ROC (AUC)
                </p>
                <div className="text-7xl font-bold text-primary mb-4">—</div>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Gerar Gráfico
                  </Button>
                  <Button variant="outline">
                    <FileUp className="mr-2 h-4 w-4" />
                    Ver Tabelas
                  </Button>
                  <Button>
                    <FileUp className="mr-2 h-4 w-4" />
                    Exportar Resultados
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
      
      {isFeatureEnabled('SHOW_UPGRADE_PROMPTS') && (
        <UpgradeModal 
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          title="Limite de Análises Atingido"
          description={getUpgradeMessage('unlimited_analyses')}
        />
      )}
    </div>
  );
};

export default Calculator;