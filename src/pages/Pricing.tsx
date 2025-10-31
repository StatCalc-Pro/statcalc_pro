import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Teste Gratuito",
      description: "Para indivíduos começando.",
      price: "R$0",
      period: "/ 14 dias",
      features: [
        "Fórmulas estatísticas básicas",
        "Até 10 uploads de dados",
        "Visualização padrão de dados",
        "Suporte por email"
      ],
      buttonText: "Iniciar Teste Gratuito",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Profissional",
      description: "Para pesquisadores ativos e pequenas equipes.",
      price: "R$149",
      period: "/ mês",
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
    },
    {
      name: "Empresarial",
      description: "Para grandes instituições e clínicas.",
      price: "R$299",
      period: "/ usuário / mês",
      features: [
        "Todos os recursos Profissionais",
        "Construtor de fórmulas personalizado",
        "Acesso à API e integrações",
        "Conformidade HIPAA",
        "Suporte telefônico dedicado"
      ],
      buttonText: "Contatar Vendas",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Posso cancelar minha assinatura a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura a qualquer momento nas configurações da sua conta. Seu acesso continuará até o final do período de cobrança atual."
    },
    {
      question: "O que acontece no final do meu teste gratuito?",
      answer: "No final do seu teste gratuito, você será solicitado a escolher um plano pago. Seus dados serão preservados e você pode fazer upgrade facilmente para continuar usando todos os recursos."
    },
    {
      question: "Meus dados de pacientes estão seguros?",
      answer: "Absolutamente. Usamos criptografia padrão da indústria e seguimos diretrizes de conformidade HIPAA para garantir que seus dados de pacientes estejam seguros e protegidos o tempo todo."
    },
    {
      question: "Vocês oferecem descontos para instituições acadêmicas?",
      answer: "Sim, oferecemos preços especiais para instituições acadêmicas e organizações de pesquisa. Entre em contato com nossa equipe de vendas para discutir suas necessidades específicas e elegibilidade."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold">StatCalc Pro</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </Link>
            <Link to="/pricing" className="text-foreground font-medium">
              Preços
            </Link>
          </nav>

          <Link to="/Auth">
            <Button>Entrar</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Análise Estatística Poderosa, Simplificada para Pesquisa Médica
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Escolha o plano que melhor se adapta às suas necessidades de pesquisa e comece a tomar decisões baseadas em dados com confiança. Todos os planos são seguros e construídos para profissionais.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Escolha Seu Plano</h2>
            <p className="text-muted-foreground text-lg">
              Preços simples e transparentes para equipes de todos os tamanhos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
                  >
                    {plan.buttonText}
                  </Button>

                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
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

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card border rounded-lg px-6">
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold mb-6">Pronto para Elevar Sua Pesquisa?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Junte-se a milhares de profissionais médicos que confiam no StatCalc Pro para análise de dados precisa, eficiente e segura.
          </p>
          <Button size="lg" className="text-lg px-8">
            Comece Seu Teste Gratuito Hoje
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="text-sm text-muted-foreground">© 2024 StatCalc Pro. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground transition-colors">Termos de Serviço</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">Política de Privacidade</Link>
            <Link to="/help" className="hover:text-foreground transition-colors">Contato</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
