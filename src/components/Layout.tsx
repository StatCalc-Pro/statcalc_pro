import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { BarChart3, Bell, Settings, User, HelpCircle } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">StatCalc Pro</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                className="font-medium"
              >
                Painel
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
            <Link to="/about">
              <Button
                variant={isActive("/about") ? "default" : "ghost"}
                className="font-medium"
              >
                Sobre
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
             <Link to="/account">
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">{children}</main>

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
