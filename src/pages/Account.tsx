import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { User, CreditCard, Bell, Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { useSubscription } from "@/hooks/useSubscription";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { STRIPE_PRICES } from "@/lib/stripe";
import { supabase } from "@/lib/supabaseClient";

const Account = () => {
  const { toast } = useToast();
  const { user, updateProfile } = useAuth();
  const { userPlan, subscription, loading: subscriptionLoading } = useSubscription();
  const { createCheckoutSession, loading: checkoutLoading } = useStripeCheckout();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Personal Info State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Load user data
  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.full_name || "");
      setEmail(user.email || "");
      setPhone(user.user_metadata?.phone || "");
    }
  }, [user]);

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notifications State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [updateNotifications, setUpdateNotifications] = useState(true);

  const handleSavePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        email: email,
        data: {
          full_name: name,
          phone: phone
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Dados atualizados!",
        description: "Suas informações pessoais foram salvas com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Senha alterada!",
        description: "Sua senha foi atualizada com sucesso.",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar senha",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Preferências salvas!",
      description: "Suas configurações de notificação foram atualizadas.",
    });
  };

  const handleUpgrade = async () => {
    try {
      await createCheckoutSession(STRIPE_PRICES.PRO_MONTHLY);
    } catch (error) {
      toast({
        title: "Erro no checkout",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Tem certeza que deseja cancelar sua assinatura? Você terá acesso até o final do período atual.")) {
      return;
    }

    setCancelLoading(true);
    try {
      const { error } = await supabase.functions.invoke('stripe-webhooks', {
        body: { 
          type: 'customer.subscription.deleted',
          data: { object: { id: subscription?.stripe_subscription_id } }
        }
      });

      if (error) throw error;

      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura foi cancelada com sucesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao cancelar",
        description: error.message || "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Minha Conta</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e preferências de conta.
        </p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal" className="gap-2">
            <User className="w-4 h-4" />
            Meu Perfil
          </TabsTrigger>
          <TabsTrigger value="subscription" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Minha Assinatura
          </TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize seus dados pessoais e informações de contato.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSavePersonalInfo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Este e-mail será usado para login e notificações importantes.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>
                Mantenha sua conta segura com uma senha forte.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Alterar Senha
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>



        {/* Subscription */}
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Assinatura</CardTitle>
              <CardDescription>
                Gerencie seu plano e histórico de pagamentos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {subscriptionLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        Plano {userPlan.type === 'free' ? 'Gratuito' : 
                               userPlan.type === 'pro' ? 'Premium' : 
                               userPlan.type === 'enterprise' ? 'Enterprise' :
                               userPlan.type === 'god_master' ? 'GOD MASTER' : userPlan.type}
                      </h3>
                      <Badge variant={subscription?.status === 'active' ? 'default' : 'secondary'}>
                        {subscription?.status === 'active' ? 'Ativo' : 
                         subscription?.status === 'canceled' ? 'Cancelado' :
                         subscription?.status === 'past_due' ? 'Vencido' : 'Inativo'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {userPlan.type === 'free' ? 'Gratuito' : 'R$ 59,00 / mês'}
                    </p>
                  </div>
                  {userPlan.type === 'free' ? (
                    <Button onClick={handleUpgrade} disabled={checkoutLoading}>
                      {checkoutLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Fazer Upgrade
                    </Button>
                  ) : (
                    <Button asChild variant="outline">
                      <Link to="/pricing">Alterar Plano</Link>
                    </Button>
                  )}
                </div>
              )}

              <Separator />

              {subscription && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Detalhes da Assinatura</h4>
                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`font-medium ${
                        subscription.status === 'active' ? 'text-green-600' : 
                        subscription.status === 'canceled' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {subscription.status === 'active' ? 'Ativo' : 
                         subscription.status === 'canceled' ? 'Cancelado' :
                         subscription.status === 'past_due' ? 'Vencido' : subscription.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data de início</span>
                      <span className="font-medium">
                        {subscription.created_at ? new Date(subscription.created_at).toLocaleDateString('pt-BR') : '-'}
                      </span>
                    </div>
                    {subscription.current_period_end && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Próxima cobrança</span>
                        <span className="font-medium">
                          {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}
                    {subscription.stripe_customer_id && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID do Cliente</span>
                        <span className="font-medium font-mono text-xs">
                          {subscription.stripe_customer_id.slice(-8)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Recursos do Plano</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {userPlan.features.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
              </div>

              <Separator />

              {userPlan.type !== 'free' && subscription?.status === 'active' && (
                <div className="pt-2">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleCancelSubscription}
                    disabled={cancelLoading}
                  >
                    {cancelLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Cancelar Assinatura
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Você terá acesso até o final do período atual.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>


      </Tabs>
    </div>
  );
};

export default Account;
