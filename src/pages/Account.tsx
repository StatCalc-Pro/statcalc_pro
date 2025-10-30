import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { User, CreditCard, Bell, Shield, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Account = () => {
  const { toast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Personal Info State
  const [name, setName] = useState("Dr. João Silva");
  const [email, setEmail] = useState("joao.silva@email.com");
  const [phone, setPhone] = useState("(11) 98765-4321");

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notifications State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [updateNotifications, setUpdateNotifications] = useState(true);

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Dados atualizados!",
      description: "Suas informações pessoais foram salvas com sucesso.",
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Senha alterada!",
      description: "Sua senha foi atualizada com sucesso.",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Preferências salvas!",
      description: "Suas configurações de notificação foram atualizadas.",
    });
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Pessoal</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Assinatura</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal">
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

                <Separator />

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar Alterações</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Gerencie sua senha e configurações de segurança.
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
                  <p className="text-xs text-muted-foreground">
                    Use pelo menos 8 caracteres com letras, números e símbolos.
                  </p>
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

                <Separator />

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                  <Button type="submit">Alterar Senha</Button>
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
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Plano Profissional</h3>
                    <Badge>Ativo</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    R$ 99,90 / mês
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link to="/pricing">Alterar Plano</Link>
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Detalhes da Assinatura</h4>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-success">Ativo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data de início</span>
                    <span className="font-medium">23/09/2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Próxima cobrança</span>
                    <span className="font-medium">24/10/2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Método de pagamento</span>
                    <span className="font-medium">•••• 4321</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Recursos do Plano</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Análises estatísticas avançadas</li>
                  <li>✓ Upload de datasets ilimitados</li>
                  <li>✓ Suporte prioritário por e-mail</li>
                  <li>✓ Colaboração em equipe</li>
                </ul>
              </div>

              <Separator />

              <div className="pt-2">
                <Button variant="destructive" className="w-full">
                  Cancelar Assinatura
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Você terá acesso até o final do período atual.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Configure suas preferências de notificação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveNotifications} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="email-notifications">
                        Notificações por E-mail
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receba atualizações e novidades por e-mail.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      id="email-notifications"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="update-notifications">
                        Atualizações de Produto
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Notificações sobre novos recursos e melhorias.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      id="update-notifications"
                      checked={updateNotifications}
                      onChange={(e) => setUpdateNotifications(e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar Preferências</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Account;
