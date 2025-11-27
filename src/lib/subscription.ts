export type PlanType = 'free' | 'student' | 'pro' | 'enterprise' | 'god_master';

export interface UserPlan {
  type: PlanType;
  analysesUsed: number;
  analysesLimit: number;
  features: string[];
}

export const PLAN_FEATURES = {
  free: {
    analysesLimit: 1, // 1 por dia
    price: 0,
    curvesPerAnalysis: 1,
    features: ['basic_auc'] // Apenas AUC básico
  },
  student: {
    analysesLimit: -1, // Ilimitado
    price: 9,
    curvesPerAnalysis: -1,
    features: ['basic_export', 'advanced_export', 'detailed_metrics', 'roc_chart', 'detailed_data', 'advanced_metrics', 'curve_comparison', 'optimal_cutoff', 'clinical_interpretation', 'specialty_templates']
  },
  pro: {
    analysesLimit: -1, // Ilimitado
    price: 19,
    curvesPerAnalysis: -1,
    features: ['basic_export', 'advanced_export', 'detailed_metrics', 'roc_chart', 'detailed_data', 'advanced_metrics', 'curve_comparison', 'optimal_cutoff', 'clinical_interpretation', 'specialty_templates', 'priority_support']
  },
  enterprise: {
    analysesLimit: -1,
    price: 99, // Reduced from 199
    curvesPerAnalysis: -1,
    features: ['basic_export', 'advanced_export', 'advanced_charts', 'confidence_intervals', 'multiple_curves', 'curve_comparison', 'optimal_cutoff', 'specialty_templates', 'publication_ready', 'api_access', 'redcap_integration', 'subgroup_analysis', 'meta_analysis', 'dedicated_support']
  },
  god_master: {
    analysesLimit: -1, // Ilimitado
    price: 0,
    curvesPerAnalysis: -1,
    features: ['basic_export', 'advanced_export', 'detailed_metrics', 'roc_chart', 'detailed_data', 'advanced_metrics', 'curve_comparison', 'optimal_cutoff', 'clinical_interpretation', 'specialty_templates', 'dev_panel', 'admin_access']
  }
};

export const hasFeature = (userPlan: UserPlan, feature: string): boolean => {
  return userPlan.features.includes(feature);
};

export const canCreateAnalysis = (userPlan: UserPlan): boolean => {
  if (userPlan.type === 'free') {
    // Verificar se já usou hoje (1 por dia)
    const today = new Date().toDateString();
    const lastUsage = localStorage.getItem('lastAnalysisDate');
    return lastUsage !== today;
  }
  return true;
};

export const getUpgradeMessage = (feature: string): string => {
  const messages = {
    'detailed_metrics': 'Upgrade para Pro (R$19/mês) para métricas detalhadas de sensibilidade e especificidade',
    'roc_chart': 'Upgrade para Pro para gráficos ROC interativos e exportação em alta qualidade',
    'detailed_data': 'Upgrade para Pro para tabela completa com busca e filtros avançados',
    'advanced_metrics': 'Upgrade para Pro para métricas científicas: intervalos de confiança, p-valores',
    'curve_comparison': 'Upgrade para Pro para comparação estatística entre curvas (teste DeLong)',
    'optimal_cutoff': 'Upgrade para Pro para cálculo do ponto de corte ótimo (3 métodos)',
    'clinical_interpretation': 'Upgrade para Pro para interpretação clínica automática',
    'specialty_templates': 'Upgrade para Pro para templates por especialidade médica',
    'unlimited_analyses': 'Plano gratuito: 1 análise por dia. Upgrade para análises ilimitadas'
  };
  return messages[feature] || 'Upgrade para Pro (R$19/mês) para desbloquear todos os recursos';
};