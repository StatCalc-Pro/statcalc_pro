import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, X, Sparkles, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { computeMetrics, exportResultsJson } from "@/lib/metrics";
import { Input } from "@/components/ui/input";

const Calculator = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [analysisName, setAnalysisName] = useState<string>("");
  const [pendingResult, setPendingResult] = useState<any | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

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
      toast.loading("Processando arquivo no navegador...");
      // read file as array buffer and parse using xlsx in browser
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const raw = XLSX.utils.sheet_to_json(sheet, { defval: null });

      const rows = computeMetrics(raw as any[]);
      const json = exportResultsJson(rows);

      // set pending result and let user edit name before saving
      setPendingResult(json);
      setSelectedFile(file.name);
      setAnalysisName(file.name);
      toast.success("Arquivo processado — edite o nome se quiser e clique 'Process Data'");
    } catch (err) {
      console.error(err);
      toast.error("Falha ao processar arquivo");
    }
  };

  const handleProcess = () => {
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

    toast.success("Processamento salvo");
    // clear pending result and navigate
    setPendingResult(null);
    navigate("/results");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <input ref={inputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={onFileChange} />
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Area Under the ROC Curve (AUC) Calculator
        </h1>
        <p className="text-muted-foreground text-lg">
          A simple tool to calculate statistical formulas from your data.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">1. Upload Your Data</CardTitle>
          <CardDescription>Please upload your data in a .xlsx format.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center">
                <FileUp className="h-8 w-8 text-accent-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium mb-1">Drag & Drop .xlsx file here</p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click the button below to select a file
                </p>
              </div>
              <Button onClick={handleFileSelect} size="lg">
                <FileUp className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedFile && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">2. File Ready for Processing</CardTitle>
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
                <Button onClick={handleProcess} size="lg">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Process Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent">
            <CardHeader>
              <CardTitle className="text-2xl">3. Calculation Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground mb-2">
                  AREA UNDER THE ROC CURVE (AUC)
                </p>
                <div className="text-7xl font-bold text-primary mb-4">—</div>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Generate Graph
                  </Button>
                  <Button variant="outline">
                    <FileUp className="mr-2 h-4 w-4" />
                    View Tables
                  </Button>
                  <Button>
                    <FileUp className="mr-2 h-4 w-4" />
                    Export Results
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Calculator;