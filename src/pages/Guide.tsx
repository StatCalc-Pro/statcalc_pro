import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileUp, Calculator, BarChart3, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const Guide = () => {
  const { guideId } = useParams();

  const guides = {
    "formato-dados": {
      title: "Formato dos Dados",
      icon: FileUp,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Estrutura do Arquivo Excel</h3>
            <p className="text-muted-foreground mb-4">
              Seu arquivo Excel deve conter exatamente estas colunas na primeira linha:
            </p>
            <Card className="bg-muted/30">
              <CardContent className="pt-4">
                <div className="grid grid-cols-5 gap-4 text-center font-mono text-sm">
                  <div className="p-2 bg-primary/10 rounded">id</div>
                  <div className="p-2 bg-primary/10 rounded">tp</div>
                  <div className="p-2 bg-primary/10 rounded">fp</div>
                  <div className="p-2 bg-primary/10 rounded">tn</div>
                  <div className="p-2 bg-primary/10 rounded">fn</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Significado das Colunas</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline">id</Badge>
                <div>
                  <p className="font-medium">Identificador do Estudo</p>
                  <p className="text-sm text-muted-foreground">Número ou nome único para cada linha de dados</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline">tp</Badge>
                <div>
                  <p className="font-medium">Verdadeiros Positivos</p>
                  <p className="text-sm text-muted-foreground">Casos corretamente identificados como positivos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline">fp</Badge>
                <div>
                  <p className="font-medium">Falsos Positivos</p>
                  <p className="text-sm text-muted-foreground">Casos incorretamente identificados como positivos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline">tn</Badge>
                <div>
                  <p className="font-medium">Verdadeiros Negativos</p>
                  <p className="text-sm text-muted-foreground">Casos corretamente identificados como negativos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline">fn</Badge>
                <div>
                  <p className="font-medium">Falsos Negativos</p>
                  <p className="text-sm text-muted-foreground">Casos incorretamente identificados como negativos</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Exemplo Prático</h3>
            <Card>
              <CardContent className="pt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">id</th>
                        <th className="text-left p-2">tp</th>
                        <th className="text-left p-2">fp</th>
                        <th className="text-left p-2">tn</th>
                        <th className="text-left p-2">fn</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Estudo_1</td>
                        <td className="p-2">85</td>
                        <td className="p-2">12</td>
                        <td className="p-2">78</td>
                        <td className="p-2">15</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Estudo_2</td>
                        <td className="p-2">92</td>
                        <td className="p-2">8</td>
                        <td className="p-2">82</td>
                        <td className="p-2">18</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">Dica</p>
              <p className="text-sm text-green-700">
                O sistema aceita variações nos nomes das colunas, mas usar exatamente estes nomes evita problemas de reconhecimento.
              </p>
            </div>
          </div>
        </div>
      )
    },
    "calculos-roc": {
      title: "Cálculos ROC/AUC",
      icon: Calculator,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Métricas Calculadas</h3>
            <p className="text-muted-foreground mb-4">
              O StatCalc Pro calcula automaticamente as seguintes métricas para cada estudo:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sensibilidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-sm mb-2">TP / (TP + FN)</p>
                  <p className="text-sm text-muted-foreground">
                    Proporção de casos positivos corretamente identificados
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Especificidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-sm mb-2">TN / (TN + FP)</p>
                  <p className="text-sm text-muted-foreground">
                    Proporção de casos negativos corretamente identificados
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">TPR (Taxa de Verdadeiros Positivos)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-sm mb-2">= Sensibilidade</p>
                  <p className="text-sm text-muted-foreground">
                    Usado para construir a curva ROC (eixo Y)
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">FPR (Taxa de Falsos Positivos)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-sm mb-2">1 - Especificidade</p>
                  <p className="text-sm text-muted-foreground">
                    Usado para construir a curva ROC (eixo X)
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Cálculo da AUC</h3>
            <p className="text-muted-foreground mb-4">
              A Área Sob a Curva (AUC) é calculada usando o método do trapézio:
            </p>
            <Card className="bg-muted/30">
              <CardContent className="pt-4">
                <p className="font-mono text-sm text-center">
                  AUC = Σ [(FPR₂ - FPR₁) × (TPR₁ + TPR₂) / 2]
                </p>
              </CardContent>
            </Card>
            <p className="text-sm text-muted-foreground mt-2">
              Este método fornece uma estimativa precisa da área sob a curva ROC, representando a capacidade discriminatória do teste.
            </p>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">Interpretação</p>
              <p className="text-sm text-blue-700">
                Todos os cálculos são feitos automaticamente. Você só precisa fornecer os dados de TP, FP, TN e FN.
              </p>
            </div>
          </div>
        </div>
      )
    },
    "curva-roc": {
      title: "Curva ROC Interativa",
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Visualização da Curva ROC</h3>
            <p className="text-muted-foreground mb-4">
              A curva ROC (Receiver Operating Characteristic) é um gráfico que mostra a performance de um teste diagnóstico:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Eixo X (FPR)</h4>
                <p className="text-sm text-muted-foreground">
                  Taxa de Falsos Positivos - representa a proporção de casos negativos incorretamente classificados como positivos.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Eixo Y (TPR)</h4>
                <p className="text-sm text-muted-foreground">
                  Taxa de Verdadeiros Positivos (Sensibilidade) - representa a proporção de casos positivos corretamente identificados.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Recursos Interativos</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Tooltip Detalhado</p>
                  <p className="text-sm text-muted-foreground">
                    Passe o mouse sobre qualquer ponto para ver valores exatos de TPR, FPR e identificador do estudo.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Linha de Referência</p>
                  <p className="text-sm text-muted-foreground">
                    A linha diagonal representa performance aleatória (AUC = 0.5).
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Área Sombreada</p>
                  <p className="text-sm text-muted-foreground">
                    A área sob a curva é destacada visualmente para facilitar a interpretação.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Interpretação da Curva</h3>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <p className="font-medium text-green-700">Curva Ideal</p>
                <p className="text-sm text-muted-foreground">
                  Passa pelo canto superior esquerdo (0,1) - alta sensibilidade, baixa taxa de falsos positivos.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="font-medium text-yellow-700">Curva Aceitável</p>
                <p className="text-sm text-muted-foreground">
                  Fica acima da linha diagonal - melhor que performance aleatória.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="font-medium text-red-700">Curva Problemática</p>
                <p className="text-sm text-muted-foreground">
                  Próxima ou abaixo da linha diagonal - performance similar ao acaso.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "exportacao": {
      title: "Exportação",
      icon: FileText,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Formatos de Exportação</h3>
            <p className="text-muted-foreground mb-4">
              O StatCalc Pro oferece múltiplas opções para exportar seus resultados:
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Excel (.xlsx)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Planilha completa com todos os dados calculados
                  </p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Dados originais</li>
                    <li>• Métricas calculadas</li>
                    <li>• Formatação profissional</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">CSV</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Formato universal para análises adicionais
                  </p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Compatível com R, Python</li>
                    <li>• Importação em outros softwares</li>
                    <li>• Arquivo leve</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">PNG (Gráfico)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Imagem da curva ROC para publicações
                  </p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Alta resolução</li>
                    <li>• Pronto para artigos</li>
                    <li>• Fundo transparente</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Conteúdo Exportado</h3>
            <p className="text-muted-foreground mb-4">
              Os arquivos exportados incluem:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Dados Originais</p>
                  <p className="text-sm text-muted-foreground">
                    ID, TP, FP, TN, FN conforme fornecidos no upload
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Métricas Calculadas</p>
                  <p className="text-sm text-muted-foreground">
                    Sensibilidade, Especificidade, TPR, FPR para cada estudo
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Resumo Estatístico</p>
                  <p className="text-sm text-muted-foreground">
                    AUC total, número de estudos, data da análise
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Como Exportar</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <p className="text-sm">Complete sua análise e visualize os resultados</p>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <p className="text-sm">Clique no botão "Exportar" na página de resultados</p>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <p className="text-sm">Escolha o formato desejado (Excel, CSV ou PNG)</p>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <p className="text-sm">O arquivo será baixado automaticamente</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">Dica para Publicações</p>
              <p className="text-sm text-green-700">
                Para artigos científicos, exporte o gráfico em PNG (alta resolução) e os dados em Excel para tabelas suplementares.
              </p>
            </div>
          </div>
        </div>
      )
    }
  };

  const currentGuide = guides[guideId as keyof typeof guides];

  if (!currentGuide) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Guia não encontrado</h1>
        <Link to="/help">
          <Button>Voltar para Ajuda</Button>
        </Link>
      </div>
    );
  }

  const GuideIcon = currentGuide.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/help">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Ajuda
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/10 rounded-lg">
          <GuideIcon className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{currentGuide.title}</h1>
          <p className="text-muted-foreground">Guia completo passo a passo</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {currentGuide.content}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-6">
        <Link to="/help">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Ajuda
          </Button>
        </Link>
        <Link to="/calculator">
          <Button>
            Começar Análise
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Guide;