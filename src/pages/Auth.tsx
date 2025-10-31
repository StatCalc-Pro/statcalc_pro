import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Perform Supabase sign-in
    ;(async () => {
      const { error } = await signIn(loginEmail, loginPassword)
      if (error) {
        alert(error.message || 'Erro ao efetuar login')
        return
      }
      navigate('/')
    })()
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      alert("Você precisa aceitar os Termos de Uso para continuar.");
      return;
    }
    ;(async () => {
      const { data, error } = await signUp(signupEmail, signupPassword, { full_name: signupName })
      if (error) {
        alert(error.message || 'Erro ao cadastrar')
        return
      }
      // Supabase may require email confirmation depending on settings.
      navigate('/')
    })()
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
        <Tabs defaultValue="login" className="w-full">
          <CardHeader className="space-y-1 pb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value="login" className="space-y-4 mt-0">
              <div className="space-y-2 text-center mb-6">
                <CardTitle className="text-2xl">Faça login</CardTitle>
                <CardDescription>
                  Entre com suas credenciais para acessar sua conta.
                </CardDescription>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">E-mail</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Entrar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-0">
              <div className="space-y-2 text-center mb-6">
                <CardTitle className="text-2xl">Crie sua conta</CardTitle>
                <CardDescription>
                  Preencha os campos abaixo para começar.
                </CardDescription>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nome Completo</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Insira seu nome completo"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">E-mail</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Crie uma senha forte"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Eu li e aceito os{" "}
                    <Link to="/about" className="text-primary hover:underline">
                      Termos de Uso
                    </Link>
                    .
                  </label>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Cadastrar
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Já tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      const loginTab = document.querySelector('[value="login"]') as HTMLElement;
                      loginTab?.click();
                    }}
                    className="text-primary hover:underline"
                  >
                    Faça login
                  </button>
                </p>
              </form>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
