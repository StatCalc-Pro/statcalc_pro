import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const Success = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold">StatCalc Pro</span>
          </Link>
          
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm">👤</span>
          </div>
        </div>
      </header>

      {/* Success Content */}
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card>
          <CardHeader className="text-center space-y-6 pt-12">
            <div className="mx-auto w-20 h-20 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Assinatura Ativa!</h1>
              <p className="text-lg text-muted-foreground">
                Sua assinatura foi confirmada e todos os recursos premium estão agora disponíveis para você.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pb-12">
            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Plano</span>
                <span className="font-semibold">Plano Profissional</span>
              </div>
              <Separator />
              
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Valor</span>
                <span className="font-semibold">R$ 99,90 / mês</span>
              </div>
              <Separator />
              
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Vigência</span>
                <span className="font-semibold">Válida até 23/10/2025</span>
              </div>
              <Separator />
              
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Próxima Cobrança</span>
                <span className="font-semibold">24/10/2025</span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button asChild className="w-full" size="lg">
                <Link to="/">Ir para o Dashboard</Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full" size="lg">
                <a href="mailto:suporte@statcalcpro.com">
                  Enviar recibo por e-mail
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Precisa de ajuda?{" "}
            <Link to="/help" className="text-primary hover:underline">
              Entre em contato com o suporte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
