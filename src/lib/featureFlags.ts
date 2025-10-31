// Feature flags para controle de produção
export const FEATURE_FLAGS = {
  // Monetização
  ENABLE_SUBSCRIPTION_LIMITS: false, // true = limita uso, false = uso livre
  SHOW_PRICING_PAGE: false, // true = mostra preços, false = esconde
  REQUIRE_AUTH: false, // true = obriga login, false = opcional
  
  // UI/UX
  SHOW_UPGRADE_PROMPTS: false, // true = mostra modais de upgrade, false = esconde
  SHOW_PLAN_BADGES: false, // true = mostra badges de plano, false = esconde
  
  // Admin
  ENABLE_DEV_PANEL: true, // sempre true para GOD MASTER
} as const;

export const isFeatureEnabled = (flag: keyof typeof FEATURE_FLAGS): boolean => {
  return FEATURE_FLAGS[flag];
};

// Helper para verificar se está em modo produção livre
export const isProductionFreeMode = (): boolean => {
  return !FEATURE_FLAGS.ENABLE_SUBSCRIPTION_LIMITS && !FEATURE_FLAGS.REQUIRE_AUTH;
};