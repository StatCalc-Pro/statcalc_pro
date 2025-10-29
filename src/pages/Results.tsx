// ...existing code...
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileImage, FileSpreadsheet, FileText, Search } from "lucide-react";
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
// import { studiesWithMetrics } from "@/data/studiesData"; // REMOVED - agora usamos dados reais via API/sessionStorage

const Results = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studies, setStudies] = useState<any[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<string | number | null>(null);
  const [summary, setSummary] = useState<{ avg_sensitivity?: number; avg_specificity?: number; auc?: number }>({});
  const itemsPerPage = 10;

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
      // Não há resultados em sessionStorage e nenhum backend é garantido
      // Em GH Pages não teremos /api, então mantemos arrays vazios
      setStudies([]);
      setSummary({});
    }
  }, []);

  // Filter studies based on search (safe string conversion)
  const filteredStudies = studies.filter((study) =>
    String(study.id || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredStudies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudies = filteredStudies.slice(startIndex, endIndex);

  const formatNumber = (num: number, decimals: number = 6) => {
    return Number(num).toFixed(decimals);
  };

  // Prepare ROC data from filtered studies (ensure endpoints at 0,0 and 1,1)
  const rocData = (() => {
    if (!filteredStudies || filteredStudies.length === 0) return [{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }];
    const pts = filteredStudies.map((s: any) => ({ fpr: Number(s.fpr ?? (1 - (s.specificity ?? 0))) || 0, tpr: Number(s.tpr ?? s.sensitivity ?? 0) || 0, id: s.id }));
  const sorted = pts.sort((a, b) => a.fpr - b.fpr);
    // ensure starting and ending points
    if (sorted.length === 0 || sorted[0].fpr > 0) sorted.unshift({ fpr: 0, tpr: 0 });
    const last = sorted[sorted.length - 1];
    if (last.fpr < 1) sorted.push({ fpr: 1, tpr: 1 });
    return sorted;
  })();

  // custom tooltip content to show study id when hovering a point
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

  // custom dot renderer to allow click/hover and highlighting
  const renderDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null) return null;
    const isSelected = selectedStudy != null && String(payload.id) === String(selectedStudy);
    const r = isSelected ? 6 : 3;
    const fill = isSelected ? "#ef4444" : "#4f46e5"; // selected red, default indigo
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
        onMouseEnter={() => payload.id && /* no-op; tooltip handled by Recharts */ null}
      />
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Análise Estatística de Estudos</h1>
          <p className="text-muted-foreground">
            Análise baseada em {studies.length} estudos elegíveis - Dados de VP, FP, VN, FN
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => {
            // try print (user can Save as PDF)
            window.print();
          }}>
            <FileImage className="mr-2 h-4 w-4" />
            Exportar (Imprimir)
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            // export currently filtered studies to Excel
            try {
              const payload = filteredStudies.map((s) => ({
                Estudo: s.id,
                VP: s.tp,
                FP: s.fp,
                VN: s.tn,
                FN: s.fn,
                Sensibilidade: Number(s.sensitivity || 0),
                Especificidade: Number(s.specificity || 0),
              }));
              const ws = XLSX.utils.json_to_sheet(payload);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, "Resultados");
              XLSX.writeFile(wb, "results.xlsx");
            } catch (e) {
              console.error("Erro ao exportar Excel", e);
            }
          }}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
          <Button size="sm" onClick={() => {
            // export CSV of filtered studies
            try {
              const headers = ["Estudo","VP","FP","VN","FN","Sensibilidade","Especificidade"];
              const rows = filteredStudies.map((s) => [
                String(s.id ?? ""),
                String(s.tp ?? ""),
                String(s.fp ?? ""),
                String(s.tn ?? ""),
                String(s.fn ?? ""),
                String(Number(s.sensitivity ?? 0)),
                String(Number(s.specificity ?? 0)),
              ]);
              const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(","))].join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "results.csv";
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            } catch (e) {
              console.error("Erro ao exportar CSV", e);
            }
          }}>
            <FileText className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Estatísticas Resumidas</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Estudos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {studies.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Artigos analisados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sensibilidade Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {summary.avg_sensitivity ? formatNumber(summary.avg_sensitivity, 4) : "—"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                VP / (VP + FN)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Especificidade Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {summary.avg_specificity ? formatNumber(summary.avg_specificity, 4) : "—"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                VN / (VN + FP)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Área Sob a Curva
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {summary.auc ? formatNumber(summary.auc, 3) : "—"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">AUC estimada</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ROC Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Curva ROC</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">Plota TPR vs FPR para os estudos (filtrados)</div>
            <div className="flex gap-2">
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
                if(!source.match(/^<svg[^>]+xmlns:xlink="http\:\/\/www\.w3\.org\/1999\/xlink"/)){
                  source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
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
                img.onerror = (e) => { console.error('Erro ao converter SVG para imagem', e); URL.revokeObjectURL(url); };
                img.src = url;
              }}>
                Exportar Gráfico
              </Button>
            </div>
          </div>

          <div id="roc-chart" style={{ width: '100%', height: 360 }}>
            <ResponsiveContainer width="100%" height={360}>
              <AreaChart data={rocData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fpr" type="number" domain={[0, 1]} tickFormatter={(v) => Number(v).toFixed(2)} />
                <YAxis dataKey="tpr" type="number" domain={[0, 1]} tickFormatter={(v) => Number(v).toFixed(2)} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="tpr" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.12} isAnimationActive={false} />
                <Line type="monotone" dataKey="tpr" stroke="#4f46e5" dot={renderDot} isAnimationActive={false} />
                {/* diagonal reference line (constructed from points) */}
                <Line data={[{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }]} dataKey="tpr" stroke="#999" dot={false} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      {/* Studies table + search + pagination */}
      <div>
        <div className="flex items-center justify-between mb-4 gap-2">
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
          <div className="text-sm text-muted-foreground">
            {filteredStudies.length} resultados
          </div>
        </div>

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
            Página {currentPage} de {totalPages || 1}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages || 1, p + 1))}
              disabled={currentPage >= totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>
      {/* Legend Card */}
      <Card className="bg-accent">
        <CardHeader>
          <CardTitle className="text-lg">Legenda das Métricas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div>
            <p className="font-semibold text-foreground">VP (Verdadeiro Positivo)</p>
            <p className="text-muted-foreground">Casos positivos corretamente identificados</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">FP (Falso Positivo)</p>
            <p className="text-muted-foreground">Casos negativos identificados como positivos</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">VN (Verdadeiro Negativo)</p>
            <p className="text-muted-foreground">Casos negativos corretamente identificados</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">FN (Falso Negativo)</p>
            <p className="text-muted-foreground">Casos positivos identificados como negativos</p>
          </div>
        </CardContent>
      </Card>

    </div>

    
  );
};

export default Results;
