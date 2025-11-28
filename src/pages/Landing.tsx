import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, BarChart3, ArrowRight, Zap, Shield, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { STRIPE_PRICES } from "@/lib/stripe";
import { toast } from "@/hooks/use-toast";

const Landing = () => {
  const { user } = useAuth();
  const { createCheckoutSession, loading } = useStripeCheckout();

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para assinar um plano",
        variant: "destructive"
      });
      return;
    }

    try {
      await createCheckoutSession(priceId);
    } catch (error) {
      toast({
        title: "Erro no checkout",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">StatCalc Pro</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link to="/auth">
                  <Button>Começar</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-6" variant="secondary">
            <Sparkles className="h-4 w-4 mr-2" />Alternativa ao GraphPad Prism
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Análise ROC/AUC
            <span className="text-primary block">Científica</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Calcule curvas ROC, AUC e métricas estatísticas com precisão científica. 
            Gratuito para sempre ou Pro por R$19/mês.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8">
                Começar Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <a href="#pricing">Ver Preços</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Por que StatCalc Pro?</h2>
            <p className="text-muted-foreground">Simples, rápido e científico</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Zap className="h-6 w-6" />
                </div>
                <CardTitle>Resultados Instantâneos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Upload Excel → Resultados em segundos</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Shield className="h-6 w-6" />
                </div>
                <CardTitle>100% Seguro</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Processamento local, dados não saem do seu navegador</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>Feito por Médicos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Desenvolvido com feedback de pesquisadores</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Preços Honestos</h2>
            <p className="text-muted-foreground">
              GraphPad custa $395 - nós cobramos R$19/mês ou gratuito para sempre
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Gratuito</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$0</span>
                  <span className="text-muted-foreground">/ sempre</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Link to="/auth">
                  <Button className="w-full" variant="outline" size="lg">
                    Começar Grátis
                  </Button>
                </Link>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm">1 análise por dia</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm">AUC básico</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Exportação PNG/CSV</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Student */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Estudante</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$9</span>
                  <span className="text-muted-foreground">/ mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button 
                  className="w-full" 
                  variant="outline"
                  size="lg"
                  onClick={() => handleSubscribe(STRIPE_PRICES.STUDENT_MONTHLY)}
                  disabled={loading}
                >
                  {loading ? "Processando..." : "Plano Estudante"}
                </Button>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm">50 análises/mês</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Até 3 curvas</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Métricas avançadas</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="border-primary border-2 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Mais Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$19</span>
                  <span className="text-muted-foreground">/ mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => handleSubscribe(STRIPE_PRICES.PRO_MONTHLY)}
                  disabled={loading}
                >
                  {loading ? "Processando..." : "Upgrade para Pro"}
                </Button>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Análises ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Curvas ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Comparação de curvas</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Templates médicos</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Processamento em lote</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Junte-se a pesquisadores que confiam no StatCalc Pro
          </p>
          <Link to="/auth">
            <Button size="lg" className="text-lg px-8">
              Começar Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <BarChart3 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">StatCalc Pro</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 StatCalc Pro. Análise estatística simplificada.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;