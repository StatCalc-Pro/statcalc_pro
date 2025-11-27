// Feature flags para controle de produção
export const FEATURE_FLAGS = {
  // Monetização
  ENABLE_SUBSCRIPTION_LIMITS: true, // true = limita uso, false = uso livre
  SHOW_PRICING_PAGE: true, // true = mostra preços, false = esconde
  REQUIRE_AUTH: true, // true = obriga login, false = opcional
  
  // UI/UX
  SHOW_UPGRADE_PROMPTS: true, // true = mostra modais de upgrade, false = esconde
  SHOW_PLAN_BADGES: true, // true = mostra badges de plano, false = esconde
  
  // Admin
  ENABLE_DEV_PANEL: true, // sempre true para GOD MASTER
  
  // Onboarding
  ENABLE_ONBOARDING: true, // true = mostra onboarding, false = esconde
  SHOW_ONBOARDING_FOR_NEW_USERS: true, // true = mostra onboarding para novos usuários
} as const;

export const isFeatureEnabled = (flag: keyof typeof FEATURE_FLAGS): boolean => {
  return FEATURE_FLAGS[flag];
};

  // Helper para verificar se está em modo produção livre
  export const isProductionFreeMode = (): boolean => {
  return !FEATURE_FLAGS.ENABLE_SUBSCRIPTION_LIMITS && !FEATURE_FLAGS.REQUIRE_AUTH;
};