import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Brain, Microscope, Stethoscope, Eye, Baby } from "lucide-react";

interface Template {
  id: string;
  name: string;
  specialty: string;
  icon: React.ComponentType<any>;
  description: string;
  sampleData: {
    context: string;
    interpretation: string;
    references: string[];
  };
  isPro: boolean;
}

const templates: Template[] = [
  {
    id: "cardiology-troponin",
    name: "Troponina para IAM",
    specialty: "Cardiologia",
    icon: Heart,
    description: "Avaliação da troponina como marcador de infarto agudo do miocárdio",
    sampleData: {
      context: "Pacientes com dor torácica suspeita de IAM. Troponina coletada na admissão.",
      interpretation: "AUC > 0.90 indica excelente capacidade discriminatória para IAM. Ponto de corte ótimo balanceia sensibilidade e especificidade para triagem em emergência.",
      references: [
        "Thygesen K, et al. Fourth Universal Definition of Myocardial Infarction (2018). Circulation. 2018;138(20):e618-e651.",
        "Collet JP, et al. 2020 ESC Guidelines for ACS. Eur Heart J. 2021;42(14):1289-1367."
      ]
    },
    isPro: true
  },
  {
    id: "radiology-mammography",
    name: "BI-RADS Mamografia",
    specialty: "Radiologia",
    icon: Eye,
    description: "Classificação BI-RADS para detecção de câncer de mama",
    sampleData: {
      context: "Classificação BI-RADS em mamografias de rastreamento. Correlação com biópsia.",
      interpretation: "Curva ROC demonstra capacidade discriminatória do sistema BI-RADS. Categorias 4 e 5 mostram alta especificidade para malignidade.",
      references: [
        "D'Orsi CJ, et al. ACR BI-RADS Atlas, Breast Imaging Reporting and Data System. 5th ed. 2013.",
        "Sickles EA, et al. ACR BI-RADS Mammography. In: ACR BI-RADS Atlas. 5th ed. 2013."
      ]
    },
    isPro: true
  },
  {
    id: "laboratory-psa",
    name: "PSA para Câncer de Próstata",
    specialty: "Laboratório",
    icon: Microscope,
    description: "Antígeno prostático específico como marcador tumoral",
    sampleData: {
      context: "Homens > 50 anos com suspeita de câncer de próstata. PSA total sérico.",
      interpretation: "AUC moderada reflete limitações do PSA isolado. Combinação com outros marcadores melhora performance diagnóstica.",
      references: [
        "Wolf AMD, et al. American Cancer Society Guideline for Prostate Cancer Screening. CA Cancer J Clin. 2010;60(2):70-98.",
        "Mottet N, et al. EAU-EANM-ESTRO-ESUR-SIOG Guidelines on Prostate Cancer. Eur Urol. 2021;79(2):243-262."
      ]
    },
    isPro: true
  },
  {
    id: "pediatrics-appendicitis",
    name: "Escore de Apendicite Pediátrica",
    specialty: "Pediatria",
    icon: Baby,
    description: "Escores clínicos para diagnóstico de apendicite em crianças",
    sampleData: {
      context: "Crianças com dor abdominal suspeita de apendicite. Aplicação de escore clínico.",
      interpretation: "Curva ROC valida utilidade do escore clínico. Ponto de corte otimizado reduz exames desnecessários mantendo sensibilidade.",
      references: [
        "Samuel M. Pediatric appendicitis score. J Pediatr Surg. 2002;37(6):877-881.",
        "Kharbanda AB, et al. Validation of a Clinical Score for Pediatric Appendicitis. Acad Emerg Med. 2012;19(1):56-62."
      ]
    },
    isPro: true
  },
  {
    id: "neurology-stroke",
    name: "NIHSS para AVC",
    specialty: "Neurologia",
    icon: Brain,
    description: "Escala NIHSS para predição de desfecho em AVC",
    sampleData: {
      context: "Pacientes com AVC isquêmico agudo. NIHSS na admissão vs desfecho funcional em 90 dias.",
      interpretation: "AUC demonstra capacidade preditiva do NIHSS. Escores mais altos correlacionam com pior prognóstico funcional.",
      references: [
        "Brott T, et al. Measurements of acute cerebral infarction: a clinical examination scale. Stroke. 1989;20(7):864-870.",
        "Adams HP Jr, et al. Classification of subtype of acute ischemic stroke. Stroke. 1993;24(1):35-41."
      ]
    },
    isPro: true
  },
  {
    id: "emergency-sepsis",
    name: "qSOFA para Sepse",
    specialty: "Emergência",
    icon: Stethoscope,
    description: "Quick SOFA para identificação de sepse em emergência",
    sampleData: {
      context: "Pacientes com suspeita de infecção em departamento de emergência. qSOFA vs desfecho.",
      interpretation: "Curva ROC avalia performance do qSOFA para predição de mortalidade. Simplicidade favorece uso em triagem.",
      references: [
        "Singer M, et al. The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3). JAMA. 2016;315(8):801-810.",
        "Seymour CW, et al. Assessment of Clinical Criteria for Sepsis. JAMA. 2016;315(8):762-774."
      ]
    },
    isPro: true
  }
];

interface SpecialtyTemplatesProps {
  onSelectTemplate: (template: Template) => void;
  userHasPro: boolean;
}

export const SpecialtyTemplates = ({ onSelectTemplate, userHasPro }: SpecialtyTemplatesProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Templates por Especialidade</h2>
        <p className="text-muted-foreground">
          Casos clínicos reais com interpretação científica e referências
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => {
          const Icon = template.icon;
          const isLocked = template.isPro && !userHasPro;
          
          return (
            <Card 
              key={template.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isLocked ? 'opacity-60' : 'hover:border-primary'
              }`}
              onClick={() => !isLocked && onSelectTemplate(template)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {template.specialty}
                      </Badge>
                    </div>
                  </div>
                  {isLocked && (
                    <Badge variant="outline" className="text-xs">
                      PRO
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
                {isLocked && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground">
                      Upgrade para Pro para acessar templates especializados
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!userHasPro && (
        <div className="text-center p-6 bg-muted/30 rounded-lg border">
          <h3 className="font-semibold mb-2">Desbloqueie Todos os Templates</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Acesse casos clínicos reais de todas as especialidades com interpretação científica
          </p>
          <Button>
            Upgrade para Pro - R$19/mês
          </Button>
        </div>
      )}
    </div>
  );
};

export default SpecialtyTemplates;