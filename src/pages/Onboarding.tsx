import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Upload, BarChart3, Download, ArrowRight, ArrowLeft, Lightbulb, Target, FileSpreadsheet, FileImage, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      title: "Bem-vindo ao StatCalc Pro!",
      description: "Vamos te mostrar como usar nossa plataforma em poucos minutos",
      content: (
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <BarChart3 className="h-12 w-12 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Análise Estatística Simplificada</h3>
            <p className="text-muted-foreground">
              Transforme seus dados clínicos em insights poderosos com apenas alguns cliques.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Passos simples</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">&lt; 30s</div>
              <div className="text-sm text-muted-foreground">Para resultados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Seguro</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Passo 1: Prepare seus Dados",
      description: "Formato esperado para o arquivo Excel",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Upload className="mx-auto h-16 w-16 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Formato do Arquivo Excel</h3>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Colunas Necessárias</CardTitle>
              <CardDescription>Seu arquivo deve conter estas colunas:</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2 text-center text-sm">
                <div className="p-2 bg-primary/10 rounded font-mono">id</div>
                <div className="p-2 bg-green-100 rounded font-mono">tp</div>
                <div className="p-2 bg-red-100 rounded font-mono">fp</div>
                <div className="p-2 bg-green-100 rounded font-mono">tn</div>
                <div className="p-2 bg-red-100 rounded font-mono">fn</div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                <p><strong>tp:</strong> Verdadeiros Positivos | <strong>fp:</strong> Falsos Positivos</p>
                <p><strong>tn:</strong> Verdadeiros Negativos | <strong>fn:</strong> Falsos Negativos</p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2"><Lightbulb className="h-4 w-4 mr-2" />Dica</h4>
            <p className="text-blue-700 text-sm">
              Nosso sistema aceita variações nos nomes das colunas (ex: "VP", "FP", "VN", "FN"), 
              mas usar os nomes exatos evita problemas.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Passo 2: Upload e Processamento",
      description: "Como fazer upload e interpretar os resultados",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <BarChart3 className="mx-auto h-16 w-16 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Processamento Automático</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Métricas Calculadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Sensibilidade:</span>
                  <Badge variant="secondary">TP/(TP+FN)</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Especificidade:</span>
                  <Badge variant="secondary">TN/(TN+FP)</Badge>
                </div>
                <div className="flex justify-between">
                  <span>AUC:</span>
                  <Badge variant="secondary">Área sob ROC</Badge>
                </div>
                <div className="flex justify-between">
                  <span>TPR/FPR:</span>
                  <Badge variant="secondary">Para curva ROC</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Visualizações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mb-2 mx-auto text-primary" />
                    <div className="text-sm text-muted-foreground">Curva ROC Interativa</div>
                  </div>
                </div>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Gráfico interativo com tooltip
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Tabela de dados detalhada
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Métricas resumidas
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Passo 3: Exportar Resultados",
      description: "Salve seus resultados para publicações",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Download className="mx-auto h-16 w-16 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Opções de Exportação</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <FileSpreadsheet className="h-8 w-8 mb-2 mx-auto text-primary" />
                <h4 className="font-semibold mb-2">Excel (.xlsx)</h4>
                <p className="text-sm text-muted-foreground">
                  Dados completos com todas as métricas calculadas
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <FileText className="h-8 w-8 mb-2 mx-auto text-primary" />
                <h4 className="font-semibold mb-2">CSV</h4>
                <p className="text-sm text-muted-foreground">
                  Formato universal para análises adicionais
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <FileImage className="h-8 w-8 mb-2 mx-auto text-primary" />
                <h4 className="font-semibold mb-2">PNG</h4>
                <p className="text-sm text-muted-foreground">
                  Gráfico ROC em alta qualidade para publicações
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2"><Target className="h-4 w-4 mr-2" />Pronto para Publicar</h4>
            <p className="text-green-700 text-sm">
              Todos os resultados são formatados seguindo padrões científicos, 
              prontos para serem incluídos em artigos e apresentações.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Você está pronto!",
      description: "Comece a usar o StatCalc Pro agora",
      content: (
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Tudo Configurado!</h3>
            <p className="text-muted-foreground mb-6">
              Agora você sabe como usar o StatCalc Pro. Que tal fazer sua primeira análise?
            </p>
          </div>
          
          <div className="space-y-4">
            <Link to="/calculator">
              <Button size="lg" className="w-full">
                Fazer Primeira Análise
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="w-full">
                Ir para Dashboard
              </Button>
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Precisa de ajuda? Acesse nossa <Link to="/help" className="text-primary hover:underline">central de ajuda</Link></p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">StatCalc Pro</span>
          </Link>
          
          <Button variant="ghost" onClick={skipOnboarding}>
            Pular Tutorial
          </Button>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso do Tutorial</span>
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} de {steps.length}
            </span>
          </div>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{steps[currentStep].title}</h1>
          <p className="text-lg text-muted-foreground">{steps[currentStep].description}</p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            {steps[currentStep].content}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button onClick={nextStep}>
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Link to="/calculator">
              <Button>
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;