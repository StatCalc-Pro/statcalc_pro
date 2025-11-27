// Gerador de relatórios científicos em PDF e LaTeX
export interface ReportData {
  title: string;
  studies: Array<{id: string, tp: number, fp: number, tn: number, fn: number, sensitivity: number, specificity: number}>;
  summary: {auc: number, avg_sensitivity: number, avg_specificity: number};
  advanced?: any;
  interpretation?: string;
}

export function generateLatexReport(data: ReportData): string {
  const latex = `
\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[portuguese]{babel}
\\usepackage{amsmath,amsfonts,amssymb}
\\usepackage{graphicx}
\\usepackage{booktabs}
\\usepackage{geometry}
\\geometry{margin=2.5cm}

\\title{Análise de Curva ROC - ${data.title}}
\\author{StatCalc Pro}
\\date{\\today}

\\begin{document}
\\maketitle

\\section{Resumo}
Este relatório apresenta a análise estatística de ${data.studies.length} estudos para avaliação de performance diagnóstica através da curva ROC (Receiver Operating Characteristic).

\\section{Metodologia}
A análise foi realizada utilizando os seguintes métodos estatísticos:
\\begin{itemize}
    \\item Cálculo da Área Sob a Curva (AUC) pelo método do trapézio
    \\item Intervalos de confiança de 95\\% pelo método de Hanley \\& McNeil (1982)
    \\item Teste de significância estatística (H\\textsubscript{0}: AUC = 0.5)
    \\item Determinação do ponto de corte ótimo pelo Índice de Youden
\\end{itemize}

\\section{Resultados}

\\subsection{Estatísticas Resumidas}
\\begin{table}[h]
\\centering
\\begin{tabular}{@{}lc@{}}
\\toprule
Métrica & Valor \\\\
\\midrule
Número de Estudos & ${data.studies.length} \\\\
Sensibilidade Média & ${(data.summary.avg_sensitivity * 100).toFixed(1)}\\% \\\\
Especificidade Média & ${(data.summary.avg_specificity * 100).toFixed(1)}\\% \\\\
Área Sob a Curva (AUC) & ${data.summary.auc.toFixed(3)} \\\\
${data.advanced ? `
Intervalo de Confiança 95\\% & [${data.advanced.ci_lower.toFixed(3)}, ${data.advanced.ci_upper.toFixed(3)}] \\\\
p-valor & ${data.advanced.p_value < 0.001 ? '<0.001' : data.advanced.p_value.toFixed(3)} \\\\
` : ''}
\\bottomrule
\\end{tabular}
\\caption{Estatísticas resumidas da análise ROC}
\\end{table}

${data.advanced ? `
\\subsection{Ponto de Corte Ótimo}
O ponto de corte ótimo, determinado pelo Índice de Youden, apresentou:
\\begin{itemize}
    \\item Sensibilidade: ${(data.advanced.optimal_cutoff.sensitivity * 100).toFixed(1)}\\%
    \\item Especificidade: ${(data.advanced.optimal_cutoff.specificity * 100).toFixed(1)}\\%
    \\item Índice de Youden: ${data.advanced.optimal_cutoff.youden_index.toFixed(3)}
    \\item Valor Preditivo Positivo: ${(data.advanced.optimal_cutoff.ppv * 100).toFixed(1)}\\%
    \\item Valor Preditivo Negativo: ${(data.advanced.optimal_cutoff.npv * 100).toFixed(1)}\\%
\\end{itemize}
` : ''}

\\subsection{Dados Individuais}
\\begin{table}[h]
\\centering
\\scriptsize
\\begin{tabular}{@{}lcccccc@{}}
\\toprule
Estudo & VP & FP & VN & FN & Sensibilidade & Especificidade \\\\
\\midrule
${data.studies.map(s => 
  `${s.id} & ${s.tp} & ${s.fp} & ${s.tn} & ${s.fn} & ${(s.sensitivity * 100).toFixed(1)}\\% & ${(s.specificity * 100).toFixed(1)}\\% \\\\`
).join('\n')}
\\bottomrule
\\end{tabular}
\\caption{Dados individuais dos estudos analisados}
\\end{table}

\\section{Interpretação}
${data.interpretation || 'A análise ROC fornece uma avaliação quantitativa da capacidade discriminatória do teste diagnóstico.'}

${data.advanced && data.advanced.auc >= 0.8 ? `
A área sob a curva de ${data.advanced.auc.toFixed(3)} indica boa capacidade discriminatória do teste.
` : data.advanced && data.advanced.auc >= 0.7 ? `
A área sob a curva de ${data.advanced.auc.toFixed(3)} indica capacidade discriminatória aceitável do teste.
` : `
A área sob a curva requer interpretação cuidadosa no contexto clínico específico.
`}

\\section{Referências}
\\begin{enumerate}
    \\item Hanley, J. A., \\& McNeil, B. J. (1982). The meaning and use of the area under a receiver operating characteristic (ROC) curve. \\textit{Radiology}, 143(1), 29-36.
    \\item DeLong, E. R., DeLong, D. M., \\& Clarke-Pearson, D. L. (1988). Comparing the areas under two or more correlated receiver operating characteristic curves. \\textit{Biometrics}, 44(3), 837-845.
    \\item Youden, W. J. (1950). Index for rating diagnostic tests. \\textit{Cancer}, 3(1), 32-35.
\\end{enumerate}

\\end{document}
`;

  return latex.trim();
}

export function generatePDFReport(data: ReportData): string {
  // HTML que pode ser convertido para PDF
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Relatório ROC - ${data.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin: 20px 0; }
        .metrics-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .metrics-table th, .metrics-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .metrics-table th { background-color: #f2f2f2; }
        .highlight { background-color: #e8f4fd; padding: 15px; border-left: 4px solid #2196F3; }
        .interpretation { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
        @media print { body { margin: 20px; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>Análise de Curva ROC</h1>
        <h2>${data.title}</h2>
        <p>Gerado por StatCalc Pro em ${new Date().toLocaleDateString('pt-BR')}</p>
    </div>

    <div class="section">
        <h3>Resumo Executivo</h3>
        <div class="highlight">
            <p><strong>AUC:</strong> ${data.summary.auc.toFixed(3)} ${data.advanced ? `(IC 95%: ${data.advanced.ci_lower.toFixed(3)} - ${data.advanced.ci_upper.toFixed(3)})` : ''}</p>
            <p><strong>Sensibilidade Média:</strong> ${(data.summary.avg_sensitivity * 100).toFixed(1)}%</p>
            <p><strong>Especificidade Média:</strong> ${(data.summary.avg_specificity * 100).toFixed(1)}%</p>
            ${data.advanced ? `<p><strong>Significância:</strong> p = ${data.advanced.p_value < 0.001 ? '<0.001' : data.advanced.p_value.toFixed(3)}</p>` : ''}
        </div>
    </div>

    <div class="section">
        <h3>Metodologia</h3>
        <p>A análise foi realizada com ${data.studies.length} estudos utilizando:</p>
        <ul>
            <li>Cálculo da AUC pelo método do trapézio</li>
            <li>Intervalos de confiança de 95% (Hanley & McNeil, 1982)</li>
            <li>Teste de significância estatística (H₀: AUC = 0.5)</li>
            <li>Ponto de corte ótimo pelo Índice de Youden</li>
        </ul>
    </div>

    ${data.advanced ? `
    <div class="section">
        <h3>Ponto de Corte Ótimo</h3>
        <table class="metrics-table">
            <tr><th>Métrica</th><th>Valor</th></tr>
            <tr><td>Sensibilidade</td><td>${(data.advanced.optimal_cutoff.sensitivity * 100).toFixed(1)}%</td></tr>
            <tr><td>Especificidade</td><td>${(data.advanced.optimal_cutoff.specificity * 100).toFixed(1)}%</td></tr>
            <tr><td>Índice de Youden</td><td>${data.advanced.optimal_cutoff.youden_index.toFixed(3)}</td></tr>
            <tr><td>PPV</td><td>${(data.advanced.optimal_cutoff.ppv * 100).toFixed(1)}%</td></tr>
            <tr><td>NPV</td><td>${(data.advanced.optimal_cutoff.npv * 100).toFixed(1)}%</td></tr>
        </table>
    </div>
    ` : ''}

    <div class="section">
        <h3>Dados dos Estudos</h3>
        <table class="metrics-table">
            <thead>
                <tr><th>Estudo</th><th>VP</th><th>FP</th><th>VN</th><th>FN</th><th>Sensibilidade</th><th>Especificidade</th></tr>
            </thead>
            <tbody>
                ${data.studies.map(s => `
                    <tr>
                        <td>${s.id}</td>
                        <td>${s.tp}</td>
                        <td>${s.fp}</td>
                        <td>${s.tn}</td>
                        <td>${s.fn}</td>
                        <td>${(s.sensitivity * 100).toFixed(1)}%</td>
                        <td>${(s.specificity * 100).toFixed(1)}%</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h3>Interpretação Clínica</h3>
        <div class="interpretation">
            ${data.interpretation || `
                <p>A área sob a curva ROC de ${data.summary.auc.toFixed(3)} indica ${
                  data.summary.auc >= 0.9 ? 'excelente capacidade discriminatória' :
                  data.summary.auc >= 0.8 ? 'boa capacidade discriminatória' :
                  data.summary.auc >= 0.7 ? 'capacidade discriminatória aceitável' :
                  'capacidade discriminatória limitada'
                } do teste diagnóstico.</p>
            `}
        </div>
    </div>

    <div class="section">
        <h3>Referências</h3>
        <ol>
            <li>Hanley, J. A., & McNeil, B. J. (1982). The meaning and use of the area under a receiver operating characteristic (ROC) curve. <em>Radiology</em>, 143(1), 29-36.</li>
            <li>DeLong, E. R., DeLong, D. M., & Clarke-Pearson, D. L. (1988). Comparing the areas under two or more correlated receiver operating characteristic curves. <em>Biometrics</em>, 44(3), 837-845.</li>
            <li>Youden, W. J. (1950). Index for rating diagnostic tests. <em>Cancer</em>, 3(1), 32-35.</li>
        </ol>
    </div>
</body>
</html>
`;

  return html;
}

export function downloadLatexReport(data: ReportData) {
  const latex = generateLatexReport(data);
  const blob = new Blob([latex], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `relatorio-roc-${data.title.replace(/[^a-zA-Z0-9]/g, '-')}.tex`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadPDFReport(data: ReportData) {
  const html = generatePDFReport(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `relatorio-roc-${data.title.replace(/[^a-zA-Z0-9]/g, '-')}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}