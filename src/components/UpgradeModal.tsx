import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Check } from "lucide-react";
import { Link } from "react-router-dom";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  title?: string;
  description?: string;
}

export const UpgradeModal = ({ 
  isOpen, 
  onClose, 
  feature,
  title = "Upgrade Necessário",
  description = "Você atingiu o limite do plano gratuito. Faça upgrade para continuar."
}: UpgradeModalProps) => {
  const proFeatures = [
    "Análises ilimitadas",
    "Exportação avançada (Excel, PDF)",
    "Gráficos interativos",
    "Compartilhamento em equipe",
    "Suporte prioritário"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-6 w-6 text-primary" />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">StatCalc Pro inclui:</h4>
            <ul className="space-y-2">
              {proFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Continuar Gratuito
            </Button>
            <Button asChild className="flex-1">
              <Link to="/pricing">
                Fazer Upgrade
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};