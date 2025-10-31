export type PlanType = 'free' | 'pro' | 'enterprise' | 'god_master';

export interface UserPlan {
  type: PlanType;
  analysesUsed: number;
  analysesLimit: number;
  features: string[];
}

export const PLAN_FEATURES = {
  free: {
    analysesLimit: 5,
    features: ['basic_export', 'basic_charts']
  },
  pro: {
    analysesLimit: -1, // unlimited
    features: ['basic_export', 'advanced_export', 'advanced_charts', 'team_sharing']
  },
  enterprise: {
    analysesLimit: -1,
    features: ['basic_export', 'advanced_export', 'advanced_charts', 'team_sharing', 'api_access', 'priority_support']
  },
  god_master: {
    analysesLimit: -1,
    features: ['basic_export', 'advanced_export', 'advanced_charts', 'team_sharing', 'api_access', 'priority_support', 'dev_panel', 'admin_access']
  }
};

export const hasFeature = (userPlan: UserPlan, feature: string): boolean => {
  return userPlan.features.includes(feature);
};

export const canCreateAnalysis = (userPlan: UserPlan): boolean => {
  if (userPlan.type === 'free') {
    return userPlan.analysesUsed < userPlan.analysesLimit;
  }
  return true;
};

export const getUpgradeMessage = (feature: string): string => {
  const messages = {
    'advanced_export': 'Upgrade para Pro para exportar em formatos avançados',
    'advanced_charts': 'Upgrade para Pro para gráficos interativos avançados',
    'team_sharing': 'Upgrade para Pro para compartilhar com sua equipe',
    'unlimited_analyses': 'Upgrade para Pro para análises ilimitadas'
  };
  return messages[feature] || 'Upgrade para desbloquear este recurso';
};