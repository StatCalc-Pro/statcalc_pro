import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Admin from "./pages/Admin";
import Calculator from "./pages/Calculator";
import Results from "./pages/Results";
import Help from "./pages/Help";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import Account from "./pages/Account";
import Auth from "./pages/Auth";

import ForgotPassword from "./pages/ForgotPassword";
import Success from "./pages/Sucess";
import { trackPageview } from "@/lib/vercel-analytics";
import ProtectedRoute from "@/components/ProtectedRoute";
import { isFeatureEnabled } from "@/lib/featureFlags";

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();

  // Track a pageview on every route change (no-op if the Vercel snippet
  // hasn't been added to index.html). This is intentionally silent so
  // analytics won't break the app if missing.
  useEffect(() => {
    trackPageview(location.pathname + location.search);
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={isFeatureEnabled('ENABLE_ONBOARDING') ? <Landing /> : <Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
          <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
          {isFeatureEnabled('ENABLE_ONBOARDING') && <Route path="/landing" element={<Landing />} />}
          {(isFeatureEnabled('ENABLE_ONBOARDING') || isFeatureEnabled('SHOW_ONBOARDING_FOR_NEW_USERS')) && <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />}
          <Route path="/admin" element={<Layout><ProtectedRoute><Admin /></ProtectedRoute></Layout>} />
          <Route path="/calculator" element={<Layout><ProtectedRoute><Calculator /></ProtectedRoute></Layout>} />
          <Route path="/results" element={<Layout><ProtectedRoute><Results /></ProtectedRoute></Layout>} />
          <Route path="/help" element={<Layout><Help /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/account" element={<Layout><ProtectedRoute><Account /></ProtectedRoute></Layout>} />
          {isFeatureEnabled('SHOW_PRICING_PAGE') && <Route path="/pricing" element={<Pricing />} />}
          <Route path="/auth" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
