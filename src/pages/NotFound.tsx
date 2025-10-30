import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-bold">Página Não Encontrada</h2>
          <p className="text-muted-foreground text-lg">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild size="lg">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/help">
              <Search className="mr-2 h-4 w-4" />
              Central de Ajuda
            </Link>
          </Button>
        </div>

        <div className="pt-8">
          <p className="text-sm text-muted-foreground">
            Se você acredita que isso é um erro, por favor{" "}
            <Link to="/help" className="text-primary hover:underline">
              entre em contato conosco
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
