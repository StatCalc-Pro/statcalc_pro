// Interpretação clínica automática dos resultados ROC
export interface ClinicalInterpretation {
  overall: string;
  performance: 'excelente' | 'boa' | 'moderada' | 'fraca' | 'inadequada';
  recommendations: string[];
  clinicalUse: string;
  limitations: string[];
  statisticalNote: string;
}

export class ClinicalInterpreter {
  static interpretROC(
    auc: number,
    sensitivity: number,
    specificity: number,
    ci_lower?: number,
    ci_upper?: number,
    optimalCutoff?: { threshold: number; youden: number }
  ): ClinicalInterpretation {
    
    const performance = this.classifyPerformance(auc);
    const overall = this.generateOverallInterpretation(auc, sensitivity, specificity, ci_lower, ci_upper);
    const recommendations = this.generateRecommendations(auc, sensitivity, specificity);
    const clinicalUse = this.suggestClinicalUse(auc, sensitivity, specificity);
    const limitations = this.identifyLimitations(auc, sensitivity, specificity);
    const statisticalNote = this.generateStatisticalNote(auc, ci_lower, ci_upper);

    return {
      overall,
      performance,
      recommendations,
      clinicalUse,
      limitations,
      statisticalNote
    };
  }

  private static classifyPerformance(auc: number): ClinicalInterpretation['performance'] {
    if (auc >= 0.9) return 'excelente';
    if (auc >= 0.8) return 'boa';
    if (auc >= 0.7) return 'moderada';
    if (auc >= 0.6) return 'fraca';
    return 'inadequada';
  }

  private static generateOverallInterpretation(
    auc: number, 
    sensitivity: number, 
    specificity: number,
    ci_lower?: number,
    ci_upper?: number
  ): string {
    const aucText = this.getAUCDescription(auc);
    const ciText = ci_lower && ci_upper ? 
      ` (IC 95%: ${ci_lower.toFixed(3)} - ${ci_upper.toFixed(3)})` : '';
    
    const balanceText = this.getBalanceDescription(sensitivity, specificity);
    
    return `O teste apresenta ${aucText} com AUC = ${auc.toFixed(3)}${ciText}. ` +
           `${balanceText} A sensibilidade de ${(sensitivity * 100).toFixed(1)}% indica ` +
           `${this.getSensitivityDescription(sensitivity)}, enquanto a especificidade de ` +
           `${(specificity * 100).toFixed(1)}% sugere ${this.getSpecificityDescription(specificity)}.`;
  }

  private static getAUCDescription(auc: number): string {
    if (auc >= 0.9) return 'discriminação excelente';
    if (auc >= 0.8) return 'boa capacidade discriminatória';
    if (auc >= 0.7) return 'capacidade discriminatória moderada';
    if (auc >= 0.6) return 'fraca capacidade discriminatória';
    return 'capacidade discriminatória inadequada para uso clínico';
  }

  private static getBalanceDescription(sensitivity: number, specificity: number): string {
    const diff = Math.abs(sensitivity - specificity);
    
    if (diff < 0.1) {
      return 'O teste apresenta bom equilíbrio entre sensibilidade e especificidade.';
    } else if (sensitivity > specificity + 0.1) {
      return 'O teste favorece a detecção de casos positivos (alta sensibilidade).';
    } else {
      return 'O teste favorece a exclusão de casos negativos (alta especificidade).';
    }
  }

  private static getSensitivityDescription(sensitivity: number): string {
    if (sensitivity >= 0.9) return 'excelente capacidade de detectar casos positivos';
    if (sensitivity >= 0.8) return 'boa capacidade de detectar casos positivos';
    if (sensitivity >= 0.7) return 'capacidade moderada de detectar casos positivos';
    return 'limitada capacidade de detectar casos positivos';
  }

  private static getSpecificityDescription(specificity: number): string {
    if (specificity >= 0.9) return 'excelente capacidade de excluir casos negativos';
    if (specificity >= 0.8) return 'boa capacidade de excluir casos negativos';
    if (specificity >= 0.7) return 'capacidade moderada de excluir casos negativos';
    return 'limitada capacidade de excluir casos negativos';
  }

  private static generateRecommendations(
    auc: number, 
    sensitivity: number, 
    specificity: number
  ): string[] {
    const recommendations: string[] = [];

    // Recomendações baseadas na AUC
    if (auc < 0.7) {
      recommendations.push('Considere combinar com outros biomarcadores ou testes');
      recommendations.push('Avalie a necessidade de otimizar o ponto de corte');
    }

    // Recomendações baseadas no equilíbrio sens/spec
    if (sensitivity < 0.7 && specificity > 0.8) {
      recommendations.push('Adequado para testes confirmatórios (rule-in)');
      recommendations.push('Não recomendado como teste de triagem isolado');
    } else if (sensitivity > 0.8 && specificity < 0.7) {
      recommendations.push('Adequado para triagem inicial (rule-out)');
      recommendations.push('Requer confirmação com testes mais específicos');
    }

    // Recomendações gerais
    if (auc >= 0.8) {
      recommendations.push('Performance adequada para uso clínico');
    }

    return recommendations;
  }

  private static suggestClinicalUse(
    auc: number, 
    sensitivity: number, 
    specificity: number
  ): string {
    if (auc < 0.6) {
      return 'Não recomendado para uso clínico isolado devido à baixa performance discriminatória.';
    }

    if (sensitivity >= 0.9) {
      return 'Excelente para triagem e exclusão de doença (rule-out). Poucos falsos negativos.';
    }

    if (specificity >= 0.9) {
      return 'Excelente para confirmação diagnóstica (rule-in). Poucos falsos positivos.';
    }

    if (auc >= 0.8) {
      return 'Adequado como ferramenta auxiliar no diagnóstico, preferencialmente em combinação com avaliação clínica.';
    }

    return 'Pode ser útil como ferramenta complementar, mas não deve ser usado isoladamente para decisões clínicas.';
  }

  private static identifyLimitations(
    auc: number, 
    sensitivity: number, 
    specificity: number
  ): string[] {
    const limitations: string[] = [];

    if (auc < 0.8) {
      limitations.push('Performance discriminatória limitada pode resultar em classificações incorretas');
    }

    if (sensitivity < 0.8) {
      limitations.push(`Taxa de falsos negativos de ${((1 - sensitivity) * 100).toFixed(1)}% pode resultar em casos não detectados`);
    }

    if (specificity < 0.8) {
      limitations.push(`Taxa de falsos positivos de ${((1 - specificity) * 100).toFixed(1)}% pode resultar em diagnósticos desnecessários`);
    }

    limitations.push('Resultados baseados na população estudada - validação externa recomendada');
    limitations.push('Interpretação deve considerar prevalência da doença na população alvo');

    return limitations;
  }

  private static generateStatisticalNote(
    auc: number,
    ci_lower?: number,
    ci_upper?: number
  ): string {
    let note = `AUC = ${auc.toFixed(3)}`;
    
    if (ci_lower && ci_upper) {
      note += ` (IC 95%: ${ci_lower.toFixed(3)} - ${ci_upper.toFixed(3)})`;
      
      if (ci_lower > 0.5) {
        note += '. O intervalo de confiança não inclui 0.5, indicando performance significativamente melhor que o acaso.';
      } else {
        note += '. O intervalo de confiança inclui 0.5, questionando a significância estatística da performance.';
      }
    }

    return note;
  }

  // Método para gerar texto pronto para paper
  static generatePaperText(
    auc: number,
    sensitivity: number,
    specificity: number,
    ci_lower?: number,
    ci_upper?: number
  ): string {
    const ciText = ci_lower && ci_upper ? 
      ` (95% CI: ${ci_lower.toFixed(3)}-${ci_upper.toFixed(3)})` : '';
    
    return `A análise da curva ROC demonstrou uma área sob a curva (AUC) de ${auc.toFixed(3)}${ciText}, ` +
           `indicando ${this.getAUCDescription(auc).toLowerCase()}. O ponto de corte ótimo apresentou ` +
           `sensibilidade de ${(sensitivity * 100).toFixed(1)}% e especificidade de ${(specificity * 100).toFixed(1)}%.`;
  }
}