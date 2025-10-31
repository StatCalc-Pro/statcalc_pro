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
      title: "Carregando Dados",
      description: "Aprenda sobre formatos de arquivo suportados e como estruturar seus dados para análise.",
      link: "#"
    },
    {
      icon: Calculator,
      title: "Executando Cálculos",
      description: "Instruções passo a passo sobre seleção e aplicação de fórmulas estatísticas.",
      link: "#"
    },
    {
      icon: BarChart3,
      title: "Interpretando Resultados",
      description: "Entenda as saídas, gráficos e métricas principais dos seus cálculos.",
      link: "#"
    },
    {
      icon: FileText,
      title: "Exportando Relatórios",
      description: "Como salvar, exportar e compartilhar suas descobertas em vários formatos.",
      link: "#"
    }
  ];

  const faqs = [
    {
      question: "Quais tipos de arquivo são suportados para upload de dados?",
      answer: "O StatCalc Pro suporta uma variedade de formatos de arquivo incluindo Excel (.xlsx, .xls). Para melhores resultados, recomendamos usar um arquivo Excel bem estruturado com cabeçalhos na primeira linha contendo as colunas: id, tp, fp, tn, fn."
    },
    {
      question: "Como meus dados de pacientes são protegidos?",
      answer: "Levamos a segurança de dados a sério. Todos os dados são processados localmente no seu navegador, sem envio para servidores externos. Isso garante total privacidade e segurança dos seus dados sensíveis de pesquisa."
    },
    {
      question: "O que significa AUC nos meus resultados?",
      answer: "AUC (Área Sob a Curva ROC) é uma medida estatística que avalia a capacidade de um teste diagnóstico distinguir entre casos positivos e negativos. Valores próximos a 1.0 indicam excelente desempenho, enquanto 0.5 indica desempenho equivalente ao acaso."
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
                    <Button variant="link" className="p-0 h-auto">
                      Ver Guia <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
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
                Novo no StatCalc Pro? Nosso guia de primeiros passos fornece uma visão geral
                do propósito da aplicação e recursos principais para você começar rapidamente.
              </p>
              <Button className="w-full">
                Ler visão geral <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ainda Precisa de Ajuda?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Se você não conseguir encontrar a resposta que procura, nossa equipe de suporte está aqui para ajudar.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Suporte por Email</p>
                    <p className="text-muted-foreground">suporte@statcalcpro.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Suporte por Telefone</p>
                    <p className="text-muted-foreground">Seg-Sex, 9h - 17h BRT</p>
                  </div>
                </div>
              </div>
              <Button className="w-full" variant="default">
                <Ticket className="mr-2 h-4 w-4" />
                Abrir Chamado
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;
