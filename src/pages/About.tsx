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
      role: "Back-end and AI Software Engineer",
      description: "Desenvolvedor Back-end, engenheiro de IA e Automações",
      initials: "LB",
      image: "/3b54d4ec-c999-48f7-9fa5-f94d05ab2b54.jpg",
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">About StatCalc Pro</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          A professional-grade application designed for medical professionals and researchers to
          perform complex statistical calculations with ease and precision.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Our mission is to empower medical professionals by providing a reliable, accurate, and
            user-friendly tool for statistical analysis. We aim to streamline the data
            interpretation process, enabling clinicians and researchers to make informed decisions
            based on robust evidence, ultimately contributing to advancements in patient care and
            medical science.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-3xl font-bold mb-6">Meet the Team</h2>
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
        <h2 className="text-3xl font-bold mb-6">Acknowledgements & Disclaimers</h2>
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="acknowledgements" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Acknowledgements
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-2">
              <p>
                We would like to thank the open-source community and the numerous contributors who
                have made this project possible. Special recognition goes to the statistical
                libraries and frameworks that power our calculations.
              </p>
              <p>
                We are grateful to the medical professionals who provided valuable feedback during
                the development process, ensuring our tool meets the real-world needs of healthcare
                providers and researchers.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="privacy" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Data & Privacy
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-2">
              <p>
                StatCalc Pro is committed to protecting your data privacy. All uploaded data is
                encrypted in transit and at rest. We do not store your data beyond the active
                session unless explicitly saved by the user.
              </p>
              <p>
                We comply with HIPAA regulations and international data protection standards. Your
                data is never shared with third parties for any purpose. For more information,
                please review our Privacy Policy.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="disclaimer" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Medical Disclaimer
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-2">
              <p>
                StatCalc Pro is designed as a statistical analysis tool and should not be used as
                the sole basis for medical decisions. All results should be interpreted by qualified
                medical professionals in the context of clinical judgment and patient-specific
                factors.
              </p>
              <p>
                While we strive for accuracy, we cannot guarantee that the software is error-free.
                Users are responsible for validating results and ensuring appropriate application of
                statistical methods. This tool does not replace professional medical advice,
                diagnosis, or treatment.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default About;
