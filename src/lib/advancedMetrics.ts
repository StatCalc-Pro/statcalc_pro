// Advanced statistical calculations for ROC analysis
// Based on scientific literature and validated methods

export interface AdvancedROCResult {
  auc: number;
  ci_lower: number;
  ci_upper: number;
  se_auc: number; // Standard error
  p_value: number; // H0: AUC = 0.5
  optimal_cutoff: {
    threshold: number;
    sensitivity: number;
    specificity: number;
    youden_index: number;
    ppv: number; // Positive predictive value
    npv: number; // Negative predictive value
  };
  sample_size: {
    positive: number;
    negative: number;
    total: number;
  };
}

export interface CurveComparison {
  curve1_auc: number;
  curve2_auc: number;
  difference: number;
  se_difference: number;
  z_score: number;
  p_value: number; // DeLong test
  ci_difference_lower: number;
  ci_difference_upper: number;
}

/**
 * Calculate advanced ROC metrics with confidence intervals
 * Based on DeLong et al. (1988) and Hanley & McNeil (1982)
 */
export function calculateAdvancedROC(
  tpr: number[], 
  fpr: number[], 
  positives: number, 
  negatives: number
): AdvancedROCResult {
  // Basic AUC calculation using trapezoidal rule
  const auc = trapezoidalAUC(fpr, tpr);
  
  // Standard error calculation (Hanley & McNeil method)
  const se_auc = calculateStandardError(auc, positives, negatives);
  
  // 95% Confidence interval
  const z_95 = 1.96;
  const ci_lower = Math.max(0, auc - z_95 * se_auc);
  const ci_upper = Math.min(1, auc + z_95 * se_auc);
  
  // P-value for H0: AUC = 0.5
  const z_score = (auc - 0.5) / se_auc;
  const p_value = 2 * (1 - normalCDF(Math.abs(z_score)));
  
  // Find optimal cutoff using Youden index
  const optimal_cutoff = findOptimalCutoff(tpr, fpr, positives, negatives);
  
  return {
    auc,
    ci_lower,
    ci_upper,
    se_auc,
    p_value,
    optimal_cutoff,
    sample_size: {
      positive: positives,
      negative: negatives,
      total: positives + negatives
    }
  };
}

/**
 * Compare two ROC curves using DeLong test
 * DeLong, E. R., DeLong, D. M., & Clarke-Pearson, D. L. (1988)
 */
export function compareCurves(
  curve1: { tpr: number[], fpr: number[], positives: number, negatives: number },
  curve2: { tpr: number[], fpr: number[], positives: number, negatives: number }
): CurveComparison {
  const auc1 = trapezoidalAUC(curve1.fpr, curve1.tpr);
  const auc2 = trapezoidalAUC(curve2.fpr, curve2.tpr);
  
  const difference = auc1 - auc2;
  
  // Simplified DeLong variance calculation
  // In practice, this would require the raw data points
  const se1 = calculateStandardError(auc1, curve1.positives, curve1.negatives);
  const se2 = calculateStandardError(auc2, curve2.positives, curve2.negatives);
  
  // Assuming independence (conservative estimate)
  const se_difference = Math.sqrt(se1 * se1 + se2 * se2);
  
  const z_score = difference / se_difference;
  const p_value = 2 * (1 - normalCDF(Math.abs(z_score)));
  
  const z_95 = 1.96;
  const ci_difference_lower = difference - z_95 * se_difference;
  const ci_difference_upper = difference + z_95 * se_difference;
  
  return {
    curve1_auc: auc1,
    curve2_auc: auc2,
    difference,
    se_difference,
    z_score,
    p_value,
    ci_difference_lower,
    ci_difference_upper
  };
}

/**
 * Bootstrap confidence intervals for AUC
 * More robust than normal approximation for small samples
 */
export function bootstrapConfidenceInterval(
  data: Array<{tp: number, fp: number, tn: number, fn: number}>,
  iterations: number = 1000,
  confidence: number = 0.95
): { ci_lower: number, ci_upper: number } {
  const bootstrap_aucs: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    // Bootstrap sample with replacement
    const sample = [];
    for (let j = 0; j < data.length; j++) {
      const randomIndex = Math.floor(Math.random() * data.length);
      sample.push(data[randomIndex]);
    }
    
    // Calculate AUC for bootstrap sample
    const tpr = sample.map(d => d.tp / (d.tp + d.fn));
    const fpr = sample.map(d => d.fp / (d.fp + d.tn));
    const sorted_indices = fpr.map((_, i) => i).sort((a, b) => fpr[a] - fpr[b]);
    
    const sorted_fpr = sorted_indices.map(i => fpr[i]);
    const sorted_tpr = sorted_indices.map(i => tpr[i]);
    
    const auc = trapezoidalAUC(sorted_fpr, sorted_tpr);
    bootstrap_aucs.push(auc);
  }
  
  // Calculate percentiles
  bootstrap_aucs.sort((a, b) => a - b);
  const alpha = 1 - confidence;
  const lower_index = Math.floor(alpha / 2 * iterations);
  const upper_index = Math.floor((1 - alpha / 2) * iterations);
  
  return {
    ci_lower: bootstrap_aucs[lower_index],
    ci_upper: bootstrap_aucs[upper_index]
  };
}

// Helper functions

function trapezoidalAUC(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) return 0;
  
  let auc = 0;
  for (let i = 1; i < x.length; i++) {
    const dx = x[i] - x[i - 1];
    const avgY = (y[i] + y[i - 1]) / 2;
    auc += dx * avgY;
  }
  
  return Math.max(0, Math.min(1, auc));
}

function calculateStandardError(auc: number, positives: number, negatives: number): number {
  // Hanley & McNeil (1982) approximation
  const q1 = auc / (2 - auc);
  const q2 = (2 * auc * auc) / (1 + auc);
  
  const se_squared = (auc * (1 - auc) + (positives - 1) * (q1 - auc * auc) + 
                     (negatives - 1) * (q2 - auc * auc)) / (positives * negatives);
  
  return Math.sqrt(Math.max(0, se_squared));
}

function findOptimalCutoff(
  tpr: number[], 
  fpr: number[], 
  positives: number, 
  negatives: number
): AdvancedROCResult['optimal_cutoff'] {
  let maxYouden = -1;
  let optimalIndex = 0;
  
  for (let i = 0; i < tpr.length; i++) {
    const youden = tpr[i] + (1 - fpr[i]) - 1; // Sensitivity + Specificity - 1
    if (youden > maxYouden) {
      maxYouden = youden;
      optimalIndex = i;
    }
  }
  
  const sensitivity = tpr[optimalIndex];
  const specificity = 1 - fpr[optimalIndex];
  
  // Calculate PPV and NPV (requires prevalence assumption)
  const prevalence = positives / (positives + negatives);
  const ppv = (sensitivity * prevalence) / (sensitivity * prevalence + (1 - specificity) * (1 - prevalence));
  const npv = (specificity * (1 - prevalence)) / ((1 - sensitivity) * prevalence + specificity * (1 - prevalence));
  
  return {
    threshold: optimalIndex, // In practice, this would be the actual threshold value
    sensitivity,
    specificity,
    youden_index: maxYouden,
    ppv,
    npv
  };
}

function normalCDF(x: number): number {
  // Approximation of the standard normal CDF
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;
  
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2.0);
  
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return 0.5 * (1.0 + sign * y);
}

/**
 * Generate scientific interpretation of ROC results
 */
export function interpretROCResults(result: AdvancedROCResult): string {
  let interpretation = "";
  
  // AUC interpretation
  if (result.auc >= 0.9) {
    interpretation += "Excelente capacidade discriminatória (AUC ≥ 0.90). ";
  } else if (result.auc >= 0.8) {
    interpretation += "Boa capacidade discriminatória (AUC = 0.80-0.89). ";
  } else if (result.auc >= 0.7) {
    interpretation += "Capacidade discriminatória aceitável (AUC = 0.70-0.79). ";
  } else if (result.auc >= 0.6) {
    interpretation += "Capacidade discriminatória fraca (AUC = 0.60-0.69). ";
  } else {
    interpretation += "Capacidade discriminatória inadequada (AUC < 0.60). ";
  }
  
  // Statistical significance
  if (result.p_value < 0.001) {
    interpretation += "Diferença altamente significativa em relação ao acaso (p < 0.001). ";
  } else if (result.p_value < 0.05) {
    interpretation += `Diferença significativa em relação ao acaso (p = ${result.p_value.toFixed(3)}). `;
  } else {
    interpretation += `Não há diferença significativa em relação ao acaso (p = ${result.p_value.toFixed(3)}). `;
  }
  
  // Optimal cutoff
  const opt = result.optimal_cutoff;
  interpretation += `O ponto de corte ótimo apresenta sensibilidade de ${(opt.sensitivity * 100).toFixed(1)}% `;
  interpretation += `e especificidade de ${(opt.specificity * 100).toFixed(1)}% (Índice de Youden = ${opt.youden_index.toFixed(3)}).`;
  
  return interpretation;
}