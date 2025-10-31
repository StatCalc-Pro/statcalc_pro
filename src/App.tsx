import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import Results from "./pages/Results";
import Help from "./pages/Help";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import Account from "./pages/Account";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import ForgotPassword from "./pages/ForgotPassword";
import Success from "./pages/Sucess";
import { trackPageview } from "@/lib/vercel-analytics";
import ProtectedRoute from "@/components/ProtectedRoute";

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
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/calculator" element={<Layout><Calculator /></Layout>} />
          <Route path="/results" element={<Layout><Results /></Layout>} />
          <Route path="/help" element={<Layout><Help /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/account" element={<Layout><ProtectedRoute><Account /></ProtectedRoute></Layout>} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
