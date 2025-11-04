import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, BarChart3, Shield, Zap, Users, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { STRIPE_PRICES } from "@/lib/stripe";
import { isFeatureEnabled } from "@/lib/featureFlags";
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

  const features = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Análise Estatística Avançada",
      description: "Calcule ROC, AUC, sensibilidade e especificidade com precisão científica"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Segurança LGPD",
      description: "Processamento local no navegador, seus dados nunca saem do seu dispositivo"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Resultados Instantâneos",
      description: "Upload de Excel e resultados em segundos, com gráficos interativos"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Feito por Médicos",
      description: "Desenvolvido com feedback de profissionais da área médica"
    }
  ];

  const testimonials = [
    {
      name: "Dra. Maria Silva",
      role: "Cardiologista",
      content: "Revolucionou minha pesquisa. Antes levava horas para calcular ROC, agora são segundos.",
      rating: 5
    },
    {
      name: "Dr. João Santos",
      role: "Epidemiologista",
      content: "Interface intuitiva e resultados precisos. Essencial para qualquer pesquisador.",
      rating: 5
    }
  ];

  const plans = [
    {
      name: "Teste Gratuito",
      description: "Para testar a plataforma.",
      price: "R$0",
      period: "/ mês",
      priceId: STRIPE_PRICES.TEST_FREE,
      features: [
        "Fórmulas estatísticas básicas",
        "Até 10 uploads de dados",
        "Visualização padrão de dados",
        "Suporte por email"
      ],
      buttonText: "Testar Grátis",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Premium",
      description: "Para pesquisadores ativos e pequenas equipes.",
      price: "R$59",
      period: "/ mês",
      priceId: STRIPE_PRICES.PRO_MONTHLY,
      features: [
        "Fórmulas estatísticas avançadas",
        "Uploads ilimitados de dados",
        "Visualização avançada de dados",
        "Recursos de colaboração em equipe",
        "Suporte prioritário por email"
      ],
      buttonText: "Começar Agora",
      buttonVariant: "default" as const,
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">StatCalc Pro</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              Sobre
            </a>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/dashboard">
                <Button>Ir para Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link to="/auth">
                  <Button>Cadastrar</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge className="mb-4" variant="secondary">
            Usado por mais de 1.000 pesquisadores
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Análise Estatística
            <span className="text-primary block">Simplificada</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transforme seus dados clínicos em insights poderosos. Calcule ROC, AUC e métricas estatísticas 
            com a precisão que sua pesquisa merece.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
            >
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Por que StatCalc Pro?</h2>
            <p className="text-xl text-muted-foreground">
              Desenvolvido especificamente para profissionais da área médica
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <Card key={i} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / Onboarding */}
      {isFeatureEnabled('ENABLE_ONBOARDING') && <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Como Funciona</h2>
            <p className="text-xl text-muted-foreground">
              Em 3 passos simples, transforme seus dados em insights poderosos
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-4">Upload dos Dados</h3>
              <div className="mb-4 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 bg-muted/20">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-sm text-muted-foreground">Arquivo Excel (.xlsx)</p>
              </div>
              <p className="text-muted-foreground">
                Faça upload do seu arquivo Excel com as colunas: id, tp, fp, tn, fn. 
                Nosso sistema reconhece automaticamente o formato.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-4">Processamento Automático</h3>
              <div className="mb-4 rounded-lg border p-4 bg-card">
                <div className="space-y-2 text-left">
                  <div className="flex justify-between text-sm">
                    <span>Sensibilidade:</span>
                    <span className="font-mono">0.8500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Especificidade:</span>
                    <span className="font-mono">0.9200</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>AUC:</span>
                    <span className="font-mono">0.8850</span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">
                Cálculos instantâneos de todas as métricas estatísticas com precisão científica validada.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-4">Resultados e Exportação</h3>
              <div className="mb-4 rounded-lg border p-4 bg-card">
                <div className="w-full h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center">
                  <div className="text-2xl">📈</div>
                </div>
                <div className="mt-2 flex gap-2 justify-center">
                  <Badge variant="secondary" className="text-xs">Excel</Badge>
                  <Badge variant="secondary" className="text-xs">CSV</Badge>
                  <Badge variant="secondary" className="text-xs">PNG</Badge>
                </div>
              </div>
              <p className="text-muted-foreground">
                Visualize a curva ROC interativa e exporte resultados em múltiplos formatos para suas publicações.
              </p>
            </div>
          </div>

          {/* Demo CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              ⚡ Processamento em segundos
            </div>
            <h3 className="text-2xl font-bold mb-4">Veja o StatCalc Pro em Ação</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Experimente nossa ferramenta com dados de exemplo e veja como é simples e rápido 
              obter resultados precisos para suas pesquisas.
            </p>
            <Link to="/auth">
              <Button size="lg" className="mr-4">
                Testar Gratuitamente
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => {
                // Scroll to pricing section
                document.getElementById('pricing')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
            >
              Ver Preços
            </Button>
          </div>
        </div>
      </section>}

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">O que dizem nossos usuários</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Escolha Seu Plano</h2>
            <p className="text-xl text-muted-foreground">
              Preços transparentes para pesquisadores de todos os níveis
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative ${plan.popular ? 'border-primary border-2 shadow-lg' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Mais Popular</Badge>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Button 
                    className="w-full" 
                    variant={plan.buttonVariant}
                    size="lg"
                    onClick={() => {
                      if (plan.priceId) {
                        handleSubscribe(plan.priceId);
                      }
                    }}
                    disabled={loading}
                  >
                    {loading ? "Processando..." : plan.buttonText}
                  </Button>

                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nossa História</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Nascido da Necessidade Real</h3>
              <p className="text-muted-foreground mb-6">
                O StatCalc Pro surgiu quando uma médica pesquisadora precisava de uma ferramenta 
                rápida e confiável para calcular curvas ROC e métricas estatísticas para suas 
                publicações científicas.
              </p>
              <p className="text-muted-foreground mb-6">
                Frustrada com planilhas complexas e softwares caros, ela nos procurou para 
                criar uma solução simples, segura e acessível para toda a comunidade médica.
              </p>
              <p className="text-muted-foreground">
                Hoje, mais de 1.000 pesquisadores confiam no StatCalc Pro para suas análises 
                estatísticas, economizando horas de trabalho e garantindo precisão científica.
              </p>
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                  <p className="text-muted-foreground">Pesquisadores ativos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">50k+</div>
                  <p className="text-muted-foreground">Análises realizadas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                  <p className="text-muted-foreground">Precisão validada</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold mb-6">Pronto para Revolucionar sua Pesquisa?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Junte-se a milhares de profissionais que já transformaram sua forma de analisar dados clínicos.
          </p>
          <Link to="/auth">
            <Button size="lg" className="text-lg px-8">
              Começar Gratuitamente Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
                  <BarChart3 className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">StatCalc Pro</span>
              </div>
              <p className="text-muted-foreground">
                Análise estatística simplificada para profissionais da saúde.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Recursos</a></li>
                <li><a href="#pricing" className="hover:text-foreground">Preços</a></li>
                <li><Link to="/help" className="hover:text-foreground">Ajuda</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground">Sobre</Link></li>
                <li><a href="#" className="hover:text-foreground">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Termos de Serviço</a></li>
                <li><a href="#" className="hover:text-foreground">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>© 2024 StatCalc Pro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;