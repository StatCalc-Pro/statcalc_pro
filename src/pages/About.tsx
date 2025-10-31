import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

      <div>
        <h2 className="text-3xl font-bold mb-6">Agradecimentos e Avisos Legais</h2>
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="acknowledgements" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Agradecimentos
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-2">
              <p>
                Gostaríamos de agradecer à comunidade open-source e aos inúmeros colaboradores que
                tornaram este projeto possível. Reconhecimento especial às bibliotecas estatísticas
                e frameworks que alimentam nossos cálculos.
              </p>
              <p>
                Somos gratos aos profissionais médicos que forneceram feedback valioso durante
                o processo de desenvolvimento, garantindo que nossa ferramenta atenda às necessidades
                reais de provedores de saúde e pesquisadores.
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
