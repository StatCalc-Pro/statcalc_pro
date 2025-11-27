import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Scissors, Target } from 'lucide-react';

interface OptimalCutoffProps {
  data: Array<{tp: number, fp: number, tn: number, fn: number}>;
}

export function OptimalCutoff({ data }: OptimalCutoffProps) {
  const [method, setMethod] = useState<'youden' | 'sensitivity' | 'specificity'>('youden');
  const [targetValue, setTargetValue] = useState<number>(0.9);
  const [result, setResult] = useState<any>(null);

  const calculateOptimalCutoff = () => {
    if (!data || data.length === 0) return;

    const points = data.map((d, i) => ({
      index: i,
      sensitivity: d.tp / (d.tp + d.fn),
      specificity: d.tn / (d.tn + d.fp),
      tp: d.tp,
      fp: d.fp,
      tn: d.tn,
      fn: d.fn
    }));

    let optimal;

    switch (method) {
      case 'youden':
        // Máximo Youden Index (Sensitivity + Specificity - 1)
        optimal = points.reduce((best, current) => {
          const currentYouden = current.sensitivity + current.specificity - 1;
          const bestYouden = best.sensitivity + best.specificity - 1;
          return currentYouden > bestYouden ? current : best;
        });
        break;

      case 'sensitivity':
        // Maior especificidade mantendo sensibilidade >= target
        optimal = points
          .filter(p => p.sensitivity >= targetValue)
          .reduce((best, current) => 
            current.specificity > best.specificity ? current : best
          );
        break;

      case 'specificity':
        // Maior sensibilidade mantendo especificidade >= target
        optimal = points
          .filter(p => p.specificity >= targetValue)
          .reduce((best, current) => 
            current.sensitivity > best.sensitivity ? current : best
          );
        break;
    }

    if (optimal) {
      const youden = optimal.sensitivity + optimal.specificity - 1;
      const ppv = optimal.tp / (optimal.tp + optimal.fp);
      const npv = optimal.tn / (optimal.tn + optimal.fn);
      const accuracy = (optimal.tp + optimal.tn) / (optimal.tp + optimal.fp + optimal.tn + optimal.fn);

      setResult({
        ...optimal,
        youden,
        ppv,
        npv,
        accuracy,
        method
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="h-5 w-5" />
          Seleção de Ponto de Corte Ótimo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Método de Otimização</label>
            <Select value={method} onValueChange={(value: any) => setMethod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youden">Índice de Youden (Sens + Espec - 1)</SelectItem>
                <SelectItem value="sensitivity">Sensibilidade Fixa</SelectItem>
                <SelectItem value="specificity">Especificidade Fixa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(method === 'sensitivity' || method === 'specificity') && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Valor Mínimo {method === 'sensitivity' ? 'Sensibilidade' : 'Especificidade'}
              </label>
              <Input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={targetValue}
                onChange={(e) => setTargetValue(parseFloat(e.target.value))}
              />
            </div>
          )}
        </div>

        <Button onClick={calculateOptimalCutoff} className="w-full">
          <Target className="mr-2 h-4 w-4" />
          Calcular Ponto Ótimo
        </Button>

        {result && (
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold">Ponto de Corte Ótimo</h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold">{(result.sensitivity * 100).toFixed(1)}%</div>
                <div className="text-muted-foreground">Sensibilidade</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{(result.specificity * 100).toFixed(1)}%</div>
                <div className="text-muted-foreground">Especificidade</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{(result.ppv * 100).toFixed(1)}%</div>
                <div className="text-muted-foreground">PPV</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{(result.npv * 100).toFixed(1)}%</div>
                <div className="text-muted-foreground">NPV</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold">{result.youden.toFixed(3)}</div>
                <div className="text-muted-foreground">Índice de Youden</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{(result.accuracy * 100).toFixed(1)}%</div>
                <div className="text-muted-foreground">Acurácia</div>
              </div>
            </div>

            <div className="p-3 bg-background rounded border">
              <p className="text-sm">
                <strong>Interpretação:</strong> {
                  result.method === 'youden' 
                    ? `Ponto que maximiza a soma de sensibilidade e especificidade (Youden = ${result.youden.toFixed(3)})`
                    : result.method === 'sensitivity'
                    ? `Maior especificidade mantendo sensibilidade ≥ ${(targetValue * 100).toFixed(0)}%`
                    : `Maior sensibilidade mantendo especificidade ≥ ${(targetValue * 100).toFixed(0)}%`
                }
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}