import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, FileUp, Calculator, BarChart3, FileText, Mail, Phone, Ticket, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Help = () => {
  const guides = [
    {
      icon: FileUp,
      title: "Formato dos Dados",
      description: "Seu arquivo Excel deve conter as colunas: id, tp (verdadeiros positivos), fp (falsos positivos), tn (verdadeiros negativos), fn (falsos negativos).",
      link: "/guide/formato-dados"
    },
    {
      icon: Calculator,
      title: "Cálculos ROC/AUC",
      description: "O sistema calcula automaticamente sensibilidade, especificidade, TPR, FPR e estima a AUC pelo método do trapézio.",
      link: "/guide/calculos-roc"
    },
    {
      icon: BarChart3,
      title: "Curva ROC Interativa",
      description: "Visualize a curva ROC com tooltip interativo mostrando os pontos de corte e métricas correspondentes.",
      link: "/guide/curva-roc"
    },
    {
      icon: FileText,
      title: "Exportação",
      description: "Exporte resultados em Excel (.xlsx), CSV ou salve o gráfico ROC como imagem PNG para suas publicações.",
      link: "/guide/exportacao"
    }
  ];

  const faqs = [
    {
      question: "Qual o formato exato que meu arquivo Excel deve ter?",
      answer: "Seu arquivo deve conter exatamente estas colunas: 'id' (identificador do estudo), 'tp' (verdadeiros positivos), 'fp' (falsos positivos), 'tn' (verdadeiros negativos), 'fn' (falsos negativos). O sistema aceita variações nos nomes das colunas, mas usar estes nomes exatos evita problemas."
    },
    {
      question: "Meus dados ficam seguros? São enviados para algum servidor?",
      answer: "Não! Todos os cálculos são feitos localmente no seu navegador. Nenhum dado é enviado para servidores externos. Isso garante total privacidade dos seus dados de pesquisa, conforme exigências da LGPD."
    },
    {
      question: "Como interpretar os valores de AUC que o sistema calcula?",
      answer: "AUC (Área Sob a Curva ROC) varia de 0 a 1: AUC = 0.5 indica desempenho equivalente ao acaso; AUC = 0.7-0.8 indica desempenho aceitável; AUC = 0.8-0.9 indica bom desempenho; AUC > 0.9 indica excelente desempenho diagnóstico."
    },
    {
      question: "Posso usar o StatCalc Pro offline?",
      answer: "Sim! Após carregar a página uma vez, o StatCalc Pro funciona offline. Todos os cálculos são feitos no seu navegador, sem necessidade de conexão com a internet."
    },
    {
      question: "O que acontece com meu histórico de análises?",
      answer: "Seu histórico é salvo localmente no seu navegador. Os dados permanecem apenas no seu dispositivo e podem ser removidos individualmente quando desejar."
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Central de Ajuda e Suporte
        </h1>
        <p className="text-muted-foreground text-lg mb-6">
          Como podemos ajudá-lo hoje?
        </p>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar perguntas frequentes..."
            className="pl-12 h-12 text-base"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Guias Práticos</h2>
              <div className="text-sm text-muted-foreground">
                <Link to="/" className="hover:text-primary">Home</Link>
                <span className="mx-2">/</span>
                <span>Guias</span>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {guides.map((guide, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <guide.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{guide.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {guide.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link to={guide.link}>
                      <Button variant="link" className="p-0 h-auto">
                        Ver Guia <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Perguntas Frequentes</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-accent">
            <CardHeader>
              <CardTitle>Primeiros Passos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Novo no StatCalc Pro? Comece fazendo upload de um arquivo Excel com seus dados de estudo clínico e veja os cálculos estatísticos em segundos.
              </p>
              <Link to="/calculator">
                <Button className="w-full">
                  Começar Análise <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ainda Precisa de Ajuda?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Encontrou algum problema ou tem sugestões? Entre em contato conosco.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Contato</p>
                    <p className="text-muted-foreground">lucas.hcb0405@gmail.com</p>
                  </div>
                </div>
              </div>
              <Button className="w-full" variant="default" asChild>
                <a href="https://github.com/lucasxae" target="_blank" rel="noopener noreferrer">
                  <Ticket className="mr-2 h-4 w-4" />
                  Reportar Problema
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;
