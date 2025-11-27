import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, BarChart3, CreditCard, Trash2, Edit, Search, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata: any;
  subscription?: {
    type: string;
    status: string;
    created_at: string;
  };
  usage?: {
    analyses_count: number;
    exports_count: number;
  };
}

interface Metrics {
  totalUsers: number;
  activeSubscriptions: number;
  totalAnalyses: number;
  recentSignups: number;
}

const Admin = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalAnalyses: 0,
    recentSignups: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Verificar se é GOD MASTER pelo plano
  const { userPlan } = useSubscription();
  const isGodMaster = userPlan.type === 'god_master';

  useEffect(() => {
    if (userPlan.type === 'god_master') {
      loadData();
    }
  }, [userPlan.type]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Buscar usuários da tabela auth.users diretamente
      const { data: authUsers } = await supabase
        .from('auth.users')
        .select('id, email, created_at, raw_user_meta_data');

      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*');

      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('*');

      // Combinar dados
      const usersWithData = authUsers?.map(authUser => {
        const userSub = subscriptions?.find(sub => sub.user_id === authUser.id);
        const userUsage = usage?.find(u => u.user_id === authUser.id);
        
        return {
          id: authUser.id,
          email: authUser.email,
          created_at: authUser.created_at,
          user_metadata: authUser.raw_user_meta_data,
          subscription: userSub,
          usage: userUsage
        };
      }) || [];

      const data = usersWithData;

      // Dados processados das tabelas
      setUsers(usersWithData);

      // Calcular métricas
      const totalUsers = usersWithData.length;
      const activeSubscriptions = usersWithData.filter(u => u.subscription?.status === 'active').length;
      const totalAnalyses = usersWithData.reduce((sum, u) => sum + (u.usage?.analyses_count || 0), 0);
      const recentSignups = usersWithData.filter(u => 
        new Date(u.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
      ).length;

      setMetrics({
        totalUsers,
        activeSubscriptions,
        totalAnalyses,
        recentSignups
      });

    } catch (error: any) {
      console.error('Erro completo:', error);
      toast({
        title: "Erro",
        description: error.message || 'Erro ao carregar dados',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserPlan = async (userId: string, newPlan: string) => {
    try {
      // Atualizar diretamente na tabela subscriptions
      const { error } = await supabase
        .from('subscriptions')
        .update({ plan_type: newPlan })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Plano atualizado",
        description: "Plano do usuário foi alterado com sucesso"
      });

      loadData();
      setEditDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Deletar registros relacionados primeiro
      await supabase.from('subscriptions').delete().eq('user_id', userId);
      await supabase.from('usage_tracking').delete().eq('user_id', userId);
      
      toast({
        title: "Dados do usuário removidos",
        description: "Registros do usuário foram limpos (auth permanece)"
      });

      loadData();
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const impersonateUser = async (userId: string) => {
    if (!userId) return;
    
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;
    
    const confirmMsg = `ATENÇÃO: Você será redirecionado como ${targetUser.email}. Para voltar à sua conta GOD MASTER, faça logout e login novamente. Continuar?`;
    if (!confirm(confirmMsg)) return;
    
    try {
      // Salvar informações para poder voltar
      localStorage.setItem('admin_impersonation', JSON.stringify({
        originalUserId: user?.id,
        targetUserId: userId,
        targetEmail: targetUser.email,
        timestamp: Date.now()
      }));
      
      // Simular mudança de usuário via localStorage
      localStorage.setItem('impersonating_user_id', userId);
      
      toast({
        title: "Impersonação ativada",
        description: `Agora você está logado como ${targetUser.email}`
      });
      
      // Redirecionar para dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
      
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao impersonar usuário",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_metadata?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isGodMaster) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl text-center">
        <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
        <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Painel Administrativo</h1>
        <p className="text-muted-foreground">Gerencie usuários e visualize métricas da plataforma</p>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>

        {/* Métricas */}
        <TabsContent value="metrics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.activeSubscriptions}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Análises</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalAnalyses}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Novos (7 dias)</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.recentSignups}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Usuários */}
        <TabsContent value="users">
          {/* Impersonação de Usuário */}
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">🎭 Impersonar Usuário (GOD MASTER)</CardTitle>
              <CardDescription className="text-red-700">
                Faça login como qualquer usuário para testar funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Select onValueChange={(userId) => impersonateUser(userId)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um usuário para impersonar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.email} ({user.subscription?.plan_type || 'free'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-xs text-red-600 mt-2">
                ⚠️ Você será redirecionado como o usuário selecionado. Para voltar à sua conta, faça logout e login novamente.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Usuários</CardTitle>
              <CardDescription>
                Visualize e gerencie todos os usuários da plataforma
              </CardDescription>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por email ou nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Análises</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.user_metadata?.full_name || 'Sem nome'}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.subscription?.plan_type === 'free' ? 'secondary' : 'default'}>
                          {user.subscription?.plan_type === 'free' ? 'Gratuito' :
                           user.subscription?.plan_type === 'pro' ? 'Premium' :
                           user.subscription?.plan_type === 'enterprise' ? 'Enterprise' :
                           user.subscription?.plan_type === 'god_master' ? 'GOD MASTER' :
                           user.subscription?.plan_type || 'Sem plano'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.subscription?.status === 'active' ? 'default' : 'destructive'}>
                          {user.subscription?.status || 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.usage?.analyses_count || 0}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => impersonateUser(user.id)}
                            title="Impersonar usuário"
                          >
                            🔄
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedUser(user);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para editar usuário */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Altere o plano do usuário {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              defaultValue={selectedUser?.subscription?.plan_type || 'free'}
              onValueChange={(value) => {
                if (selectedUser) {
                  updateUserPlan(selectedUser.id, value);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Gratuito</SelectItem>
                <SelectItem value="pro">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
                <SelectItem value="god_master">GOD MASTER</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para deletar usuário */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar Usuário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar o usuário {selectedUser?.email}? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedUser && deleteUser(selectedUser.id)}
            >
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;