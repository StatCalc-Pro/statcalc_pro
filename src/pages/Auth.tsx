import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { Eye, EyeOff, Mail } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  useEffect(() => {
    // Processar token de confirmação de email da URL
    const hashParams = new URLSearchParams(location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (accessToken && type === 'signup') {
      // Definir sessão com o token
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: hashParams.get('refresh_token') || ''
      }).then(() => {
        // Limpar URL
        window.history.replaceState({}, document.title, '/auth');
        // Redirecionar para onboarding ou dashboard
        if (isFeatureEnabled('SHOW_ONBOARDING_FOR_NEW_USERS')) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      });
    }
  }, [location.hash, navigate]);

  // Se usuário já está logado, redirecionar
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Perform Supabase sign-in
    ;(async () => {
      const { data, error } = await signIn(loginEmail, loginPassword)
      if (error) {
        alert(error.message || 'Erro ao efetuar login')
        return
      }
      
      // Verificar se é primeira vez do usuário (criado recentemente)
      const isNewUser = data.user && new Date(data.user.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000 // 24h
      
      if (isNewUser && isFeatureEnabled('SHOW_ONBOARDING_FOR_NEW_USERS')) {
        navigate('/onboarding')
      } else {
        navigate('/dashboard')
      }
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
      
      // Mostrar tela de confirmação de email
      if (data.user && !data.user.email_confirmed_at) {
        setPendingEmail(signupEmail)
        setShowEmailConfirmation(true)
        return
      }
      
      // Se confirmação automática, redirecionar para onboarding se for novo usuário
      if (isFeatureEnabled('SHOW_ONBOARDING_FOR_NEW_USERS')) {
        navigate('/onboarding')
      } else {
        navigate('/dashboard')
      }
    })()
  };

  if (showEmailConfirmation) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">S</span>
          </div>
          <span className="text-2xl font-bold">StatCalc Pro</span>
        </Link>

        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Confirme seu email</CardTitle>
            <CardDescription>
              Enviamos um link de confirmação para <strong>{pendingEmail}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Clique no link do email para ativar sua conta. Após a confirmação, você será redirecionado automaticamente.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setShowEmailConfirmation(false)}
              className="w-full"
            >
              Voltar ao login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

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
