import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Lock, Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock password reset
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xl">S</span>
        </div>
        <span className="text-2xl font-bold">StatCalc Pro</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold">Esqueceu sua senha?</CardTitle>
            <CardDescription className="text-base">
              {isSubmitted
                ? "Verifique seu e-mail para o link de recuperação."
                : "Insira seu e-mail abaixo e enviaremos um link para redefinir sua senha."}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Enviar link de recuperação
              </Button>

              <div className="text-center">
                <Link
                  to="/auth"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  Lembrou a senha? Voltar para o Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-muted-foreground">
                Um e-mail foi enviado para <strong>{email}</strong> com instruções para redefinir sua senha.
              </p>
              <Button asChild className="w-full" size="lg">
                <Link to="/auth">Voltar para o Login</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
