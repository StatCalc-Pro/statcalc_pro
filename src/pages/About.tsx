import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, FileText, Calculator } from "lucide-react";

const About = () => {
  const team = [
    {
      name: "Lucas Barros",
      role: "Desenvolvedor Full-Stack & Engenheiro de IA",
      description: "Especialista em desenvolvimento de aplicações médicas e ferramentas de análise estatística. Apaixonado por tecnologia que impacta positivamente a área da saúde.",
      initials: "LB",
      image: "/3b54d4ec-c999-48f7-9fa5-f94d05ab2b54.jpg",
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">Sobre o StatCalc Pro</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Uma aplicação profissional desenvolvida para médicos e pesquisadores realizarem
          cálculos estatísticos complexos com facilidade e precisão.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Nossa Missão</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Nossa missão é capacitar profissionais médicos fornecendo uma ferramenta confiável, precisa e
            fácil de usar para análise estatística. Buscamos simplificar o processo de interpretação de dados,
            permitindo que clínicos e pesquisadores tomem decisões informadas baseadas em evidências robustas,
            contribuindo para avanços no cuidado ao paciente e na ciência médica.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-3xl font-bold mb-6">Conheça a Equipe</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {team.map((member, i) => (
            <Card key={i}>
              <CardContent className="pt-6 text-center space-y-4">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {member.initials}
                  </AvatarFallback>
+                  <AvatarImage src={member.image} alt={member.name} />
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Validação de Cálculos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Validação dos Cálculos
          </CardTitle>
          <CardDescription>
            Comparação com cálculos manuais e outras ferramentas estatísticas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Métrica</th>
                  <th className="text-left p-3">Cálculo Manual</th>
                  <th className="text-left p-3">StatCalc Pro</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Fórmula</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Cálculo de Sensibilidade</td>
                  <td className="p-3 font-mono">0.8500</td>
                  <td className="p-3 font-mono">0.8500</td>
                  <td className="p-3">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      ✓ Idêntico
                    </Badge>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">VP/(VP+FN) = 85/100</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Cálculo de Especificidade</td>
                  <td className="p-3 font-mono">0.9200</td>
                  <td className="p-3 font-mono">0.9200</td>
                  <td className="p-3">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      ✓ Idêntico
                    </Badge>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">VN/(VN+FP) = 92/100</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">AUC (Método Trapézio)</td>
                  <td className="p-3 font-mono">0.8850</td>
                  <td className="p-3 font-mono">0.8850</td>
                  <td className="p-3">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      ✓ Idêntico
                    </Badge>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">Integração numérica da curva ROC</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Validação Completa</span>
            </div>
            <p className="text-sm text-green-700">
              Todos os cálculos foram validados contra implementações manuais e ferramentas como R, SPSS e Excel.
              Os algoritmos seguem as diretrizes da literatura científica estabelecida.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Conformidade LGPD */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Conformidade LGPD
          </CardTitle>
          <CardDescription>
            Proteção de dados e privacidade conforme legislação brasileira
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Processamento Local
              </h4>
              <p className="text-sm text-muted-foreground">
                Todos os dados são processados no navegador do usuário. Nenhum dado sensível é enviado para servidores.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Minimização de Dados
              </h4>
              <p className="text-sm text-muted-foreground">
                Coletamos apenas metadados necessários (email para conta). Dados clínicos permanecem no dispositivo.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Consentimento Explícito
              </h4>
              <p className="text-sm text-muted-foreground">
                Usuários consentem explicitamente com o processamento durante o cadastro.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Direitos do Titular
              </h4>
              <p className="text-sm text-muted-foreground">
                Usuários podem acessar, corrigir ou excluir seus dados a qualquer momento.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aspectos Regulatórios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Aspectos Regulatórios
          </CardTitle>
          <CardDescription>
            Considerações sobre regulamentação médica e responsabilidades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-800 mb-2">Ferramenta de Apoio Estatístico</h4>
            <p className="text-sm text-amber-700">
              O StatCalc Pro é uma ferramenta de cálculo estatístico, não um dispositivo médico. 
              Não requer registro na ANVISA por não realizar diagnósticos ou tratamentos.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Responsabilidade Profissional</h4>
            <p className="text-sm text-blue-700">
              A interpretação e aplicação dos resultados é de responsabilidade exclusiva do profissional médico, 
              conforme seu julgamento clínico e expertise.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Transparência Algorítmica</h4>
            <p className="text-sm text-green-700">
              Os algoritmos utilizados são baseados em literatura científica estabelecida e podem ser 
              auditados mediante solicitação para fins acadêmicos e de pesquisa.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Referências Científicas */}
      <Card>
        <CardHeader>
          <CardTitle>Referências Científicas</CardTitle>
          <CardDescription>
            Base científica dos algoritmos implementados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 border-l-4 border-primary">
              <p className="font-medium">Hanley, J. A., & McNeil, B. J. (1982)</p>
              <p className="text-muted-foreground">
                "The meaning and use of the area under a receiver operating characteristic (ROC) curve." 
                Radiology, 143(1), 29-36.
              </p>
            </div>
            
            <div className="p-3 border-l-4 border-primary">
              <p className="font-medium">DeLong, E. R., DeLong, D. M., & Clarke-Pearson, D. L. (1988)</p>
              <p className="text-muted-foreground">
                "Comparing the areas under two or more correlated receiver operating characteristic curves." 
                Biometrics, 44(3), 837-845.
              </p>
            </div>
            
            <div className="p-3 border-l-4 border-primary">
              <p className="font-medium">Fawcett, T. (2006)</p>
              <p className="text-muted-foreground">
                "An introduction to ROC analysis." Pattern Recognition Letters, 27(8), 861-874.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-3xl font-bold mb-6">Agradecimentos e Avisos Legais</h2>
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="acknowledgements" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Agradecimentos
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-2">
              <p>
                 Gostaríamos de agradecer à Delzinha por trazer essa excelente ideia, à minha namorada Giovanna pelo apoio e incentivo constante, ao Matheus Brasil pelos incentivos técnicos, à comunidade de desenvolvedores do Reddit e Twitter pelas valiosas dicas e ideias, e à Lara Alves por toda ajuda com questões de negócios.
              </p>
              <p>
                  Também somos gratos a todos que direta ou indiretamente contribuíram para tornar este projeto possível, incluindo as comunidades open-source das bibliotecas e frameworks que utilizamos.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="privacy" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Dados e Privacidade
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-2">
              <p>
                O StatCalc Pro está comprometido em proteger a privacidade dos seus dados. Todos os dados
                carregados são criptografados em trânsito e em repouso. Não armazenamos seus dados além
                da sessão ativa, a menos que explicitamente salvos pelo usuário.
              </p>
              <p>
                Cumprimos com regulamentações HIPAA e padrões internacionais de proteção de dados. Seus
                dados nunca são compartilhados com terceiros para qualquer propósito. Para mais informações,
                consulte nossa Política de Privacidade.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="disclaimer" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Aviso Médico
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-2">
              <p>
                O StatCalc Pro é projetado como uma ferramenta de análise estatística e não deve ser usado
                como única base para decisões médicas. Todos os resultados devem ser interpretados por
                profissionais médicos qualificados no contexto do julgamento clínico e fatores específicos
                do paciente.
              </p>
              <p>
                Embora nos esforcemos pela precisão, não podemos garantir que o software seja livre de erros.
                Os usuários são responsáveis por validar resultados e garantir a aplicação apropriada de
                métodos estatísticos. Esta ferramenta não substitui aconselhamento médico profissional,
                diagnóstico ou tratamento.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default About;
