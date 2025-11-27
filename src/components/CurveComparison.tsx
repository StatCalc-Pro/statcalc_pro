import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, TrendingUp } from 'lucide-react';
import { compareCurves } from '@/lib/advancedMetrics';
import * as XLSX from 'xlsx';
import { RobustParser } from '@/lib/robustParser';
import { computeMetrics } from '@/lib/metrics';

export function CurveComparison() {
  const [curve1, setCurve1] = useState<any>(null);
  const [curve2, setCurve2] = useState<any>(null);
  const [comparison, setComparison] = useState<any>(null);

  const handleFileUpload = async (file: File, curveNumber: 1 | 2) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json(sheet, { defval: null });
      
      const parsedData = RobustParser.parseExcelData(raw as any[]);
      const rows = computeMetrics(parsedData as any[]);
      
      const tpr = rows.map(r => r.tpr);
      const fpr = rows.map(r => r.fpr);
      const positives = rows.reduce((sum, r) => sum + r.tp + r.fn, 0);
      const negatives = rows.reduce((sum, r) => sum + r.tn + r.fp, 0);
      
      const curveData = { tpr, fpr, positives, negatives, name: file.name };
      
      if (curveNumber === 1) {
        setCurve1(curveData);
      } else {
        setCurve2(curveData);
      }
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
    }
  };

  const runComparison = () => {
    if (!curve1 || !curve2) return;
    
    const result = compareCurves(curve1, curve2);
    setComparison(result);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Comparação de Curvas ROC (DeLong Test)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Curva 1</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 1)}
                className="hidden"
                id="curve1-upload"
              />
              <label htmlFor="curve1-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm">{curve1 ? curve1.name : 'Upload Excel'}</p>
              </label>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Curva 2</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 2)}
                className="hidden"
                id="curve2-upload"
              />
              <label htmlFor="curve2-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm">{curve2 ? curve2.name : 'Upload Excel'}</p>
              </label>
            </div>
          </div>
        </div>

        <Button 
          onClick={runComparison} 
          disabled={!curve1 || !curve2}
          className="w-full"
        >
          Executar Teste DeLong
        </Button>

        {comparison && (
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold">Resultados da Comparação</h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold">{comparison.curve1_auc.toFixed(3)}</div>
                <div className="text-muted-foreground">AUC Curva 1</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{comparison.curve2_auc.toFixed(3)}</div>
                <div className="text-muted-foreground">AUC Curva 2</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{comparison.difference.toFixed(3)}</div>
                <div className="text-muted-foreground">Diferença</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {comparison.p_value < 0.001 ? '<0.001' : comparison.p_value.toFixed(3)}
                </div>
                <div className="text-muted-foreground">p-valor</div>
              </div>
            </div>

            <div className="p-3 bg-background rounded border">
              <p className="text-sm">
                <strong>Interpretação:</strong> {comparison.p_value < 0.05 
                  ? '🔴 Diferença estatisticamente significativa entre as curvas' 
                  : '🟢 Não há diferença estatisticamente significativa entre as curvas'
                } (p = {comparison.p_value.toFixed(3)})
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                IC 95% da diferença: [{comparison.ci_difference_lower.toFixed(3)}, {comparison.ci_difference_upper.toFixed(3)}]
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}