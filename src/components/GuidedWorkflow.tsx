import React, { useState } from 'react';
import { CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  component: React.ReactNode;
  validation?: () => boolean;
}

interface GuidedWorkflowProps {
  onComplete: (data: any) => void;
}

export function GuidedWorkflow({ onComplete }: GuidedWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [workflowData, setWorkflowData] = useState<any>({});

  const steps: WorkflowStep[] = [
    {
      id: 1,
      title: "Importar Dados",
      description: "Faça upload do seu arquivo Excel com dados de TP, FP, TN, FN",
      component: <ImportStep data={workflowData} onChange={setWorkflowData} />,
      validation: () => workflowData.file !== undefined
    },
    {
      id: 2,
      title: "Revisar e Limpar",
      description: "Verifique se os dados foram interpretados corretamente",
      component: <ReviewStep data={workflowData} onChange={setWorkflowData} />,
      validation: () => workflowData.cleanedData?.length > 0
    },
    {
      id: 3,
      title: "Configurar Análise",
      description: "Escolha o tipo de análise e parâmetros estatísticos",
      component: <ConfigStep data={workflowData} onChange={setWorkflowData} />,
      validation: () => workflowData.analysisType !== undefined
    },
    {
      id: 4,
      title: "Analisar Resultados",
      description: "Visualize curvas ROC, AUC e métricas estatísticas",
      component: <AnalysisStep data={workflowData} onChange={setWorkflowData} />
    },
    {
      id: 5,
      title: "Exportar",
      description: "Baixe gráficos e relatórios para sua pesquisa",
      component: <ExportStep data={workflowData} onChange={setWorkflowData} />
    }
  ];

  const canProceed = () => {
    const step = steps[currentStep];
    return !step.validation || step.validation();
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === steps.length - 1) {
      onComplete(workflowData);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                ${index <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  w-16 h-1 mx-2
                  ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-600 mt-1">
            {steps[currentStep].description}
          </p>
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        {steps[currentStep].component}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center px-4 py-2 text-gray-600 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </button>

        <button
          onClick={nextStep}
          disabled={!canProceed()}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}

// Componentes dos steps (implementação básica)
function ImportStep({ data, onChange }: any) {
  return (
    <div className="text-center py-8">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => onChange({ ...data, file: e.target.files?.[0] })}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="text-gray-600">
            <p className="text-lg mb-2">Clique para selecionar arquivo Excel</p>
            <p className="text-sm">Formatos aceitos: .xlsx, .xls</p>
          </div>
        </label>
        {data.file && (
          <div className="mt-4 text-green-600">
            <CheckCircle className="w-5 h-5 inline mr-2" />
            {data.file.name}
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewStep({ data, onChange }: any) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Dados Detectados</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">
          Verifique se as colunas foram detectadas corretamente:
        </p>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div><strong>TP:</strong> Verdadeiros Positivos</div>
          <div><strong>FP:</strong> Falsos Positivos</div>
          <div><strong>TN:</strong> Verdadeiros Negativos</div>
          <div><strong>FN:</strong> Falsos Negativos</div>
        </div>
      </div>
    </div>
  );
}

function ConfigStep({ data, onChange }: any) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Configurar Análise</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tipo de Análise</label>
          <select 
            className="w-full p-2 border rounded-lg"
            onChange={(e) => onChange({ ...data, analysisType: e.target.value })}
          >
            <option value="">Selecione...</option>
            <option value="single">Curva ROC Simples</option>
            <option value="comparison">Comparação de Curvas</option>
            <option value="advanced">Análise Avançada (CI + DeLong)</option>
          </select>
        </div>
        
        <div>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">Incluir intervalos de confiança (95%)</span>
          </label>
        </div>
      </div>
    </div>
  );
}

function AnalysisStep({ data }: any) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Resultados da Análise</h3>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          📊 Análise concluída! Visualize os resultados abaixo.
        </p>
      </div>
    </div>
  );
}

function ExportStep({ data }: any) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Exportar Resultados</h3>
      <div className="grid grid-cols-2 gap-4">
        <button className="p-4 border rounded-lg hover:bg-gray-50">
          📊 Gráfico PNG (Alta Qualidade)
        </button>
        <button className="p-4 border rounded-lg hover:bg-gray-50">
          📄 Relatório PDF
        </button>
        <button className="p-4 border rounded-lg hover:bg-gray-50">
          📈 Dados Excel
        </button>
        <button className="p-4 border rounded-lg hover:bg-gray-50">
          📋 Tabela CSV
        </button>
      </div>
    </div>
  );
}