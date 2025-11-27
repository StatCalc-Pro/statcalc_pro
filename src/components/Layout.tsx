import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { BarChart3, Bell, Settings, User, LogOut } from "lucide-react";
import { DevPanel } from "./DevPanel";
import { useAuth } from "@/lib/auth";
import { Badge } from "./ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { isFeatureEnabled } from "@/lib/featureFlags";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { userPlan, hasFeature } = useSubscription();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">StatCalc Pro</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            <Link to="/dashboard">
              <Button
                variant={isActive("/dashboard") ? "default" : "ghost"}
                className="font-medium"
              >
                Início
              </Button>
            </Link>
            <Link to="/calculator">
              <Button
                variant={isActive("/calculator") ? "default" : "ghost"}
                className="font-medium"
              >
                Nova Análise
              </Button>
            </Link>
            <Link to="/results">
              <Button
                variant={isActive("/results") ? "default" : "ghost"}
                className="font-medium"
              >
                Resultados
              </Button>
            </Link>
            <Link to="/help">
              <Button
                variant={isActive("/help") ? "default" : "ghost"}
                className="font-medium"
              >
                Ajuda
              </Button>
            </Link>
            <Link to="/validation">
              <Button
                variant={isActive("/validation") ? "default" : "ghost"}
                className="font-medium"
              >
                Validação
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant={isActive("/about") ? "default" : "ghost"}
                className="font-medium"
              >
                Sobre
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user && isFeatureEnabled('SHOW_PLAN_BADGES') && (
              <div className="flex items-center gap-2 mr-2">
                <Badge variant={userPlan.type === 'free' ? 'secondary' : userPlan.type === 'god_master' ? 'destructive' : 'default'}>
                  {userPlan.type === 'free' ? 'Gratuito' : 
                   userPlan.type === 'pro' ? 'Pro' : 
                   userPlan.type === 'enterprise' ? 'Enterprise' :
                   userPlan.type === 'god_master' ? 'GOD MASTER' : userPlan.type}
                </Badge>
                <span className="text-sm text-muted-foreground hidden md:block">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </div>
            )}
            
            {isFeatureEnabled('REQUIRE_AUTH') ? (
              user ? (
                <>
                  <Link to="/account">
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      console.log('Logout clicked');
                      signOut().then(() => {
                        console.log('Logout successful');
                        window.location.href = '/';
                      }).catch(err => {
                        console.error('Logout error:', err);
                        window.location.href = '/';
                      });
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button>Entrar</Button>
                </Link>
              )
            ) : (
              user && (
                <>
                  <Link to="/account">
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      signOut().then(() => {
                        window.location.href = '/';
                      }).catch(() => {
                        window.location.href = '/';
                      });
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              )
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">{children}</main>
      
      {/* Dev Panel - apenas para GOD MASTER */}
      {isFeatureEnabled('ENABLE_DEV_PANEL') && user && hasFeature('dev_panel') && <DevPanel />}

      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 StatCalc Pro. All Rights Reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary">
                Termos de Serviço
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                Política de Privacidade
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                Contato
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
