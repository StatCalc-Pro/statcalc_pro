// Parser robusto para dados médicos reais
export interface ParsedData {
  id: string;
  tp: number;
  fp: number;
  tn: number;
  fn: number;
  errors?: string[];
  suggestions?: string[];
}

export class RobustParser {
  // Variações comuns de nomes de colunas
  private static COLUMN_MAPPINGS = {
    id: ['id', 'ID', 'Id', 'study', 'Study', 'name', 'Name', 'caso', 'Caso'],
    tp: ['tp', 'TP', 'true_positive', 'True_Positive', 'vp', 'VP', 'verdadeiro_positivo'],
    fp: ['fp', 'FP', 'false_positive', 'False_Positive', 'falso_positivo'],
    tn: ['tn', 'TN', 'true_negative', 'True_Negative', 'vn', 'VN', 'verdadeiro_negativo'],
    fn: ['fn', 'FN', 'false_negative', 'False_Negative', 'falso_negativo']
  };

  static parseExcelData(rawData: any[]): ParsedData[] {
    const results: ParsedData[] = [];
    
    if (!rawData || rawData.length === 0) {
      throw new Error('Dados vazios ou inválidos');
    }

    // Detectar colunas automaticamente
    const headers = Object.keys(rawData[0]);
    const columnMap = this.detectColumns(headers);

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const parsed = this.parseRow(row, columnMap, i + 1);
      results.push(parsed);
    }

    return results;
  }

  private static detectColumns(headers: string[]): Record<string, string> {
    const map: Record<string, string> = {};
    
    for (const [targetCol, variations] of Object.entries(this.COLUMN_MAPPINGS)) {
      const found = headers.find(h => 
        variations.some(v => h.toLowerCase().includes(v.toLowerCase()))
      );
      if (found) {
        map[targetCol] = found;
      }
    }

    return map;
  }

  private static parseRow(row: any, columnMap: Record<string, string>, rowNum: number): ParsedData {
    const errors: string[] = [];
    const suggestions: string[] = [];

    // Extrair valores com limpeza
    const id = this.cleanString(row[columnMap.id] || `Estudo_${rowNum}`);
    const tp = this.cleanNumber(row[columnMap.tp], 'TP', rowNum, errors);
    const fp = this.cleanNumber(row[columnMap.fp], 'FP', rowNum, errors);
    const tn = this.cleanNumber(row[columnMap.tn], 'TN', rowNum, errors);
    const fn = this.cleanNumber(row[columnMap.fn], 'FN', rowNum, errors);

    // Validações estatísticas
    this.validateStatistical(tp, fp, tn, fn, rowNum, errors, suggestions);

    return { id, tp, fp, tn, fn, errors, suggestions };
  }

  private static cleanString(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value).trim();
  }

  private static cleanNumber(value: any, field: string, row: number, errors: string[]): number {
    if (value === null || value === undefined || value === '') {
      errors.push(`Linha ${row}: ${field} está vazio`);
      return 0;
    }

    // Remover texto comum: "TP (n=85)" -> 85
    let cleaned = String(value).replace(/[^\d.-]/g, '');
    
    const num = parseFloat(cleaned);
    if (isNaN(num) || num < 0) {
      errors.push(`Linha ${row}: ${field} inválido (${value})`);
      return 0;
    }

    return Math.round(num); // Arredondar para inteiro
  }

  private static validateStatistical(
    tp: number, fp: number, tn: number, fn: number, 
    row: number, errors: string[], suggestions: string[]
  ) {
    const total = tp + fp + tn + fn;
    
    if (total === 0) {
      errors.push(`Linha ${row}: Todos os valores são zero`);
      return;
    }

    if (total < 10) {
      suggestions.push(`Linha ${row}: Amostra muito pequena (n=${total}), resultados podem ser instáveis`);
    }

    // Verificar proporções suspeitas
    const sensitivity = tp / (tp + fn);
    const specificity = tn / (tn + fp);

    if (sensitivity === 1 || specificity === 1) {
      suggestions.push(`Linha ${row}: Performance perfeita é suspeita, verifique os dados`);
    }

    if (sensitivity < 0.1 || specificity < 0.1) {
      suggestions.push(`Linha ${row}: Performance muito baixa, verifique se TP/TN não estão trocados`);
    }
  }
}