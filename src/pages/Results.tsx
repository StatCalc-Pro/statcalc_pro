import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileImage, FileSpreadsheet, FileText, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { UpgradeModal } from "@/components/UpgradeModal";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { ClinicalInterpreter } from "@/lib/clinicalInterpretation";
import { CurveComparison } from "@/components/CurveComparison";
import { OptimalCutoff } from "@/components/OptimalCutoff";
import { downloadLatexReport, downloadPDFReport } from "@/lib/reportGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as XLSX from "xlsx";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Results = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studies, setStudies] = useState<any[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<string | number | null>(null);
  const [summary, setSummary] = useState<{ avg_sensitivity?: number; avg_specificity?: number; auc?: number; advanced?: any }>({});
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const itemsPerPage = 10;
  const { hasFeature } = useSubscription();

  useEffect(() => {
    const loadFromSession = () => {
      const raw = sessionStorage.getItem("results");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setStudies(parsed.studies || []);
          setSummary(parsed.summary || {});
          return true;
        } catch (e) {
          console.error("Falha ao parsear results do sessionStorage", e);
        }
      }
      return false;
    };

    const loaded = loadFromSession();
    if (!loaded) {
      setStudies([]);
      setSummary({});
    }
  }, []);

  const filteredStudies = studies.filter((study) =>
    String(study.id || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudies = filteredStudies.slice(startIndex, endIndex);

  const formatNumber = (num: number, decimals: number = 6) => {
    return Number(num).toFixed(decimals);
  };

  const rocData = (() => {
    if (!filteredStudies || filteredStudies.length === 0) return [{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }];
    const pts = filteredStudies.map((s: any) => ({ fpr: Number(s.fpr ?? (1 - (s.specificity ?? 0))) || 0, tpr: Number(s.tpr ?? s.sensitivity ?? 0) || 0, id: s.id }));
    const sorted = pts.sort((a, b) => a.fpr - b.fpr);
    if (sorted.length === 0 || sorted[0].fpr > 0) sorted.unshift({ fpr: 0, tpr: 0 });
    const last = sorted[sorted.length - 1];
    if (last.fpr < 1) sorted.push({ fpr: 1, tpr: 1 });
    return sorted;
  })();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 rounded shadow">
          <div className="font-medium">{String(data.id ?? "(summary)")}</div>
          <div className="text-xs text-muted-foreground">FPR: {Number(data.fpr).toFixed(4)}</div>
          <div className="text-xs text-muted-foreground">TPR: {Number(data.tpr).toFixed(4)}</div>
        </div>
      );
    }
    return null;
  };

  const renderDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null) return null;
    const isSelected = selectedStudy != null && String(payload.id) === String(selectedStudy);
    const r = isSelected ? 6 : 3;
    const fill = isSelected ? "#ef4444" : "#4f46e5";
    return (
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        stroke="#fff"
        strokeWidth={1}
        style={{ cursor: payload.id ? "pointer" : "default" }}
        onClick={() => payload.id && setSelectedStudy(payload.id)}
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com resultado principal */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-green-50 px-6 py-4 rounded-2xl border border-blue-200 mb-4">
          <div className="text-6xl font-bold text-primary">
            {summary.auc ? summary.auc.toFixed(3) : "—"}
          </div>
          <div className="text-left">
            <div className="text-lg font-semibold text-foreground">Área Sob a Curva</div>
            <div className="text-sm text-muted-foreground">{studies.length} estudos analisados</div>
          </div>
        </div>
        
        <div className="flex justify-center gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {summary.avg_sensitivity ? (summary.avg_sensitivity * 100).toFixed(1) + '%' : "—"}
            </div>
            <div className="text-xs text-muted-foreground">Sensibilidade</div>
          </div>
          <div className="w-px bg-border"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {summary.avg_specificity ? (summary.avg_specificity * 100).toFixed(1) + '%' : "—"}
            </div>
            <div className="text-xs text-muted-foreground">Especificidade</div>
          </div>
        </div>

        <div className="flex justify-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <FileImage className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            const reportData = {
              title: 'Análise ROC',
              studies: filteredStudies,
              summary,
              advanced: summary.advanced
            };
            downloadPDFReport(reportData);
          }}>
            <FileText className="mr-2 h-4 w-4" />
            Relatório PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            const reportData = {
              title: 'Análise ROC',
              studies: filteredStudies,
              summary,
              advanced: summary.advanced
            };
            downloadLatexReport(reportData);
          }}>
            <FileText className="mr-2 h-4 w-4" />
            LaTeX
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6 h-12">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            📊 Resumo
          </TabsTrigger>
          <TabsTrigger value="chart" className="flex items-center gap-2">
            📈 Gráfico
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            📋 Dados
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            🔬 Científico
          </TabsTrigger>
          <TabsTrigger value="compare" className="flex items-center gap-2">
            ⚖️ Comparar
          </TabsTrigger>
          <TabsTrigger value="cutoff" className="flex items-center gap-2">
            ✂️ Cutoff
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance Visual */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-center text-xl">🎯 Performance do Teste Diagnóstico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray={`${(summary.auc || 0) * 100}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {summary.auc ? (summary.auc * 100).toFixed(0) + '%' : "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">AUC</div>
                    </div>
                  </div>
                </div>
              </div>
              


              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border-2 ${hasFeature('detailed_metrics') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 relative'}`}>
                  {!hasFeature('detailed_metrics') && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                      <Button size="sm" variant="outline" onClick={() => setShowUpgradeModal(true)}>
                        🔒 Pro
                      </Button>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {hasFeature('detailed_metrics') && summary.avg_sensitivity ? (summary.avg_sensitivity * 100).toFixed(1) + '%' : "—"}
                    </div>
                    <div className="text-sm font-medium text-green-700">Sensibilidade</div>
                    <div className="text-xs text-green-600 mt-1">Detecta casos positivos</div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg border-2 ${hasFeature('detailed_metrics') ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 relative'}`}>
                  {!hasFeature('detailed_metrics') && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                      <Button size="sm" variant="outline" onClick={() => setShowUpgradeModal(true)}>
                        🔒 Pro
                      </Button>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {hasFeature('detailed_metrics') && summary.avg_specificity ? (summary.avg_specificity * 100).toFixed(1) + '%' : "—"}
                    </div>
                    <div className="text-sm font-medium text-blue-700">Especificidade</div>
                    <div className="text-xs text-blue-600 mt-1">Exclui casos negativos</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


        </TabsContent>

        <TabsContent value="chart">
          <Card className={hasFeature('roc_chart') ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200' : 'relative bg-gray-50'}>
            {!hasFeature('roc_chart') && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">📈</div>
                  <div className="text-xl font-semibold text-gray-700 mb-2">Gráfico ROC Interativo</div>
                  <p className="text-sm text-gray-600 mb-2">• Visualização em alta qualidade</p>
                  <p className="text-sm text-gray-600 mb-2">• Pontos clicáveis e informativos</p>
                  <p className="text-sm text-gray-600 mb-6">• Exportação para publicações</p>
                  <Button onClick={() => setShowUpgradeModal(true)} size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600">
                    🚀 Desbloquear Visualização
                  </Button>
                </div>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  📈 Curva ROC Interativa
                  {hasFeature('roc_chart') && <Badge className="bg-blue-100 text-blue-700">HD</Badge>}
                </span>
                <Button size="sm" variant="outline" onClick={() => {
                  const container = document.getElementById('roc-chart');
                  if (!container) return;
                  const svg = container.querySelector('svg');
                  if (!svg) return;
                  const serializer = new XMLSerializer();
                  let source = serializer.serializeToString(svg as any);
                  if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
                    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
                  }
                  const rect = (svg as any).getBoundingClientRect();
                  const img = new Image();
                  const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
                  const url = URL.createObjectURL(svgBlob);
                  img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const scale = window.devicePixelRatio || 1;
                    canvas.width = rect.width * scale;
                    canvas.height = rect.height * scale;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;
                    ctx.setTransform(scale, 0, 0, scale, 0, 0);
                    ctx.drawImage(img, 0, 0);
                    const png = canvas.toDataURL('image/png');
                    const a = document.createElement('a');
                    a.href = png;
                    a.download = 'roc-chart.png';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                  };
                  img.src = url;
                }}>
                  Exportar PNG
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div id="roc-chart" style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={rocData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fpr" type="number" domain={[0, 1]} tickFormatter={(v) => Number(v).toFixed(2)} />
                    <YAxis dataKey="tpr" type="number" domain={[0, 1]} tickFormatter={(v) => Number(v).toFixed(2)} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="tpr" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.12} isAnimationActive={false} />
                    <Line type="monotone" dataKey="tpr" stroke="#4f46e5" dot={renderDot} isAnimationActive={false} />
                    <Line data={[{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }]} dataKey="tpr" stroke="#999" dot={false} strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card className={hasFeature('detailed_data') ? '' : 'relative'}>
            {!hasFeature('detailed_data') && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="text-lg font-medium text-muted-foreground mb-2">📋 Dados Detalhados</div>
                  <p className="text-sm text-muted-foreground mb-4">Tabela completa com busca e filtros</p>
                  <Button onClick={() => setShowUpgradeModal(true)}>
                    Acessar Dados Completos
                  </Button>
                </div>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Dados dos Estudos</span>
                <div className="flex items-center gap-2 w-full max-w-md">
                  <Search className="text-muted-foreground" />
                  <Input
                    placeholder="Buscar estudo..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudo</TableHead>
                    <TableHead>VP</TableHead>
                    <TableHead>FP</TableHead>
                    <TableHead>VN</TableHead>
                    <TableHead>FN</TableHead>
                    <TableHead>Sensibilidade</TableHead>
                    <TableHead>Especificidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentStudies.map((s: any, idx: number) => {
                    const isSelected = selectedStudy != null && String(s.id) === String(selectedStudy);
                    return (
                      <TableRow key={String(s.id) + idx} className={`cursor-pointer ${isSelected ? 'bg-muted/20 ring-1 ring-primary/40' : ''}`} onClick={() => setSelectedStudy(s.id)}>
                        <TableCell className="font-medium">{s.id}</TableCell>
                        <TableCell>{s.tp}</TableCell>
                        <TableCell>{s.fp}</TableCell>
                        <TableCell>{s.tn}</TableCell>
                        <TableCell>{s.fn}</TableCell>
                        <TableCell>{formatNumber(Number(s.sensitivity || 0), 4)}</TableCell>
                        <TableCell>{formatNumber(Number(s.specificity || 0), 4)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages || 1} • {filteredStudies.length} resultados
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}>
                    Anterior
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages || 1, p + 1))} disabled={currentPage >= totalPages}>
                    Próxima
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          {summary.advanced ? (
            <Card className={`bg-green-50 border-green-200 ${hasFeature('advanced_metrics') ? '' : 'relative'}`}>
              {!hasFeature('advanced_metrics') && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="text-lg font-medium text-muted-foreground mb-2">🔬 Métricas Científicas Avançadas</div>
                    <p className="text-sm text-muted-foreground mb-2">• Intervalos de Confiança (95% CI)</p>
                    <p className="text-sm text-muted-foreground mb-2">• Teste de Significância (p-valor)</p>
                    <p className="text-sm text-muted-foreground mb-4">• Ponto de Corte Ótimo (Youden)</p>
                    <Button onClick={() => setShowUpgradeModal(true)}>
                      Upgrade para Análise Científica
                    </Button>
                  </div>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">📊 Métricas Estatísticas Avançadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{summary.advanced.auc.toFixed(3)}</div>
                    <div className="text-green-600">AUC</div>
                    <div className="text-xs text-green-500">IC 95%: {summary.advanced.ci_lower.toFixed(3)}-{summary.advanced.ci_upper.toFixed(3)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{summary.advanced.p_value < 0.001 ? '<0.001' : summary.advanced.p_value.toFixed(3)}</div>
                    <div className="text-green-600">p-valor</div>
                    <div className="text-xs text-green-500">vs acaso</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{(summary.advanced.optimal_cutoff.sensitivity * 100).toFixed(1)}%</div>
                    <div className="text-green-600">Sens. Ótima</div>
                    <div className="text-xs text-green-500">Youden: {summary.advanced.optimal_cutoff.youden_index.toFixed(3)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{(summary.advanced.optimal_cutoff.specificity * 100).toFixed(1)}%</div>
                    <div className="text-green-600">Espec. Ótima</div>
                    <div className="text-xs text-green-500">PPV: {(summary.advanced.optimal_cutoff.ppv * 100).toFixed(1)}%</div>
                  </div>
                </div>

              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Métricas avançadas não disponíveis. Faça upload de novos dados para calcular.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="compare">
          <div className={hasFeature('curve_comparison') ? '' : 'relative'}>
            {!hasFeature('curve_comparison') && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="text-lg font-medium text-muted-foreground mb-2">📈 Comparação de Curvas (DeLong Test)</div>
                  <p className="text-sm text-muted-foreground mb-4">Compare múltiplas curvas ROC com teste estatístico</p>
                  <Button onClick={() => setShowUpgradeModal(true)}>
                    Desbloquear Comparação
                  </Button>
                </div>
              </div>
            )}
            <CurveComparison />
          </div>
        </TabsContent>

        <TabsContent value="cutoff">
          <div className={hasFeature('optimal_cutoff') ? '' : 'relative'}>
            {!hasFeature('optimal_cutoff') && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="text-lg font-medium text-muted-foreground mb-2">✂️ Ponto de Corte Ótimo</div>
                  <p className="text-sm text-muted-foreground mb-2">• Índice de Youden</p>
                  <p className="text-sm text-muted-foreground mb-2">• Sensibilidade Fixa</p>
                  <p className="text-sm text-muted-foreground mb-4">• Especificidade Fixa</p>
                  <Button onClick={() => setShowUpgradeModal(true)}>
                    Acessar Análise de Cutoff
                  </Button>
                </div>
              </div>
            )}
            {studies.length > 0 ? (
              <OptimalCutoff data={studies.map(s => ({tp: s.tp, fp: s.fp, tn: s.tn, fn: s.fn}))} />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Nenhum dado disponível para análise de ponto de corte.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {isFeatureEnabled('SHOW_UPGRADE_PROMPTS') && (
        <UpgradeModal 
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          title="Recurso Premium"
          description="Este recurso está disponível apenas nos planos pagos."
        />
      )}
    </div>
  );
};

export default Results;