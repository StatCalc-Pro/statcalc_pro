# StatCalc Pro

StatCalc Pro é uma ferramenta cliente (rodando no navegador) para análise estatística rápida de estudos clínicos — criada para responder a um pedido de uma médica que precisava calcular curvas ROC, AUC e métricas resumidas a partir de dados tabulares para suas pesquisas científicas.

Este projeto transforma um fluxo manual (planilhas e cálculos) em uma interface simples: faça upload do seu arquivo Excel (.xlsx/.xls), o aplicativo calcula sensibilidade, especificidade, TPR, FPR, estima a AUC, gera a curva ROC e permite exportar os resultados (XLSX/CSV) e o gráfico.

Motivação
---------
Uma médica de pesquisa precisava de uma ferramenta leve, segura e que rodasse offline no navegador para processar resultados de estudos (VP, FP, VN, FN) sem enviar dados a servidores externos. Este projeto fornece exatamente isso: processamento no cliente, preservando privacidade dos dados e simplicidade de uso.

Funcionalidades principais
-------------------------
- Upload de arquivos Excel (.xlsx / .xls)
- Cálculo automático de sensibilidade, especificidade, TPR (sensibilidade) e FPR (1 - especificidade)
- Estimativa de AUC pelo método do trapézio
- Geração de gráfico ROC interativo (com tooltip) e opção de exportar como PNG
- Exportar resultados filtrados para Excel (.xlsx) ou CSV
- Histórico local de análises (armazenado em localStorage) com opção de remover entradas
- Roda totalmente no cliente — compatível com GitHub Pages

Formato esperado
----------------
O arquivo Excel deve conter, por estudo, as colunas: `id`, `tp`, `fp`, `tn`, `fn`. O parser tenta aceitar variações comuns de nomes de colunas, mas usar estes nomes exatos evita problemas.

Como usar localmente
--------------------
Pré-requisitos: Node.js (recomendo usar nvm) e npm

```bash
git clone <SEU_REPO>
cd StatCalc-Pro
npm install
npm run dev
# abra http://localhost:8080 e faça upload do .xlsx
```

Ao processar um arquivo, o resultado final é salvo temporariamente em `sessionStorage` e também é registrado em `localStorage` como histórico de análises.

Deploy (GitHub Pages)
---------------------
O aplicativo é 100% client-side, então é compatível com GitHub Pages. Antes de publicar, certifique-se que em `vite.config.ts` o `base` está configurado para o caminho correto do repositório (por exemplo `"/StatCalc-Pro/"`).

Exemplo rápido de deploy (usando Actions ou gh-pages):

1. Atualize o lockfile localmente: `npm install` e `git add package-lock.json`.
2. Commit + push para `main`.
3. A Action `gh-pages` (se estiver configurada) fará o build e publicará `dist/` na branch `gh-pages`.

Privacidade e segurança
----------------------
Todos os cálculos são feitos no navegador. Nenhum dado é enviado a servidores externos por padrão. Isso torna a ferramenta adequada para dados sensíveis de pesquisa, desde que você não compartilhe o arquivo resultante sem anonimização quando necessário.

Contribuições e contato
-----------------------
Se você quiser melhorar a ferramenta, abrir issues ou enviar pull requests é bem-vindo. Se precisar que eu personalize algum comportamento (nomes de colunas diferentes, formatos de export, integração com repositórios privados), me avise.

Desenvolvedor
-------------
Projeto mantido por Lucas (GitHub: `lucasxae`).

Licença
-------
Este projeto está disponível sob a licença MIT — sinta-se livre para usar e adaptar para propósitos de pesquisa.

