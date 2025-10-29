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
      title: "Uploading Data",
      description: "Learn about supported file formats and how to structure your data for analysis.",
      link: "#"
    },
    {
      icon: Calculator,
      title: "Running Calculations",
      description: "Step-by-step instructions on selecting and applying statistical formulas.",
      link: "#"
    },
    {
      icon: BarChart3,
      title: "Interpreting Results",
      description: "Understand the output, charts, and key metrics from your calculations.",
      link: "#"
    },
    {
      icon: FileText,
      title: "Exporting Reports",
      description: "How to save, export, and share your findings in various formats.",
      link: "#"
    }
  ];

  const faqs = [
    {
      question: "What file types are supported for data upload?",
      answer: "StatCalc Pro supports a variety of file formats including CSV (.csv), Excel (.xlsx, .xls), and JSON (.json). For best results, we recommend using a well-structured CSV file with headers in the first row."
    },
    {
      question: "How is my patient data secured?",
      answer: "We take data security seriously. All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. We are HIPAA compliant and follow strict data protection protocols. Your data is never shared with third parties and is automatically deleted after 30 days of inactivity."
    },
    {
      question: "What does the 'p-value' in my results mean?",
      answer: "The p-value is a statistical measure that helps you determine the significance of your results. A p-value less than 0.05 typically indicates statistical significance, meaning the results are unlikely to have occurred by chance. However, always consider the context of your specific study when interpreting p-values."
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Help & Support Center
        </h1>
        <p className="text-muted-foreground text-lg mb-6">
          How can we help you today?
        </p>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for common questions..."
            className="pl-12 h-12 text-base"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">How-to Guides</h2>
              <div className="text-sm text-muted-foreground">
                <Link to="/" className="hover:text-primary">Home</Link>
                <span className="mx-2">/</span>
                <span>Guides</span>
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
                      View Guide <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
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
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                New to StatCalc Pro? Our getting started guide provides a brief overview of the
                application's purpose and core features to get you up and running quickly.
              </p>
              <Button className="w-full">
                Read the overview <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Still Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If you can't find the answer you're looking for, our support team is here to help.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-muted-foreground">support@statcalcpro.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-muted-foreground">Mon-Fri, 9am - 5pm EST</p>
                  </div>
                </div>
              </div>
              <Button className="w-full" variant="default">
                <Ticket className="mr-2 h-4 w-4" />
                Submit a Ticket
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;
