
export type ChangeType = "feature" | "fix" | "improvement";

export interface Change {
  type: ChangeType;
  description: string;
}

export interface ChangelogVersion {
  version: string;
  date: string; // ISO 8601 format: YYYY-MM-DD
  changes: Change[];
}

export const changelogData: ChangelogVersion[] = [
   {
    version: "1.4.0",
    date: "2025-07-25T12:00:00",
    changes: [
      {
        type: "improvement",
        description:
          "Melhorada a Calculadora de ICMS-ST com campos para inserção manual de valores e uma lógica de cálculo específica para 'Peças'.",
      },
      {
        type: "improvement",
        description:
          "A barra lateral agora é expansível e recolhível na versão para desktop, e o efeito de desfoque foi aprimorado.",
      },
       {
        type: "fix",
        description:
          "Corrigido o campo de e-mail na Consulta de Prestador para permitir a inserção de status textuais (Ex: OK, Pendente).",
      },
    ],
  },
  {
    version: "1.3.0",
    date: "2025-07-20T12:00:00",
    changes: [
      {
        type: "feature",
        description:
          "Adicionada a ferramenta 'Notas Recusadas' para consulta pública e gerenciamento no painel administrativo.",
      },
       {
        type: "improvement",
        description:
          "Adicionado campo de pesquisa na tela de 'Notas Recusadas' para facilitar a busca por fornecedor ou número da nota.",
      },
      {
        type: "fix",
        description:
          "Corrigido um erro no painel administrativo que impedia a seleção de datas nos formulários de acompanhamento de notas.",
      },
    ],
  },
  {
    version: "1.2.0",
    date: "2025-07-15T12:00:00",
    changes: [
      {
        type: "feature",
        description:
          "Adicionada a página de 'Registro de Atualizações' para visualizar o histórico de versões do sistema.",
      },
      {
        type: "improvement",
        description:
          "Melhorada a performance da consulta de alíquotas com cache local dos dados.",
      },
    ],
  },
  {
    version: "1.1.0",
    date: "2025-07-10T12:00:00",
    changes: [
      {
        type: "feature",
        description:
          "Implementado o painel de 'Gerenciador de Trabalhos' na área administrativa para controle de tarefas.",
      },
      {
        type: "fix",
        description:
          "Corrigido um erro no Validador XML que não processava corretamente notas com múltiplos produtos.",
      },
      {
        type: "improvement",
        description:
          "Otimizado o layout da página inicial para melhor visualização em dispositivos móveis.",
      },
    ],
  },
  {
    version: "1.0.0",
    date: "2025-07-01T12:00:00",
    changes: [
      {
        type: "feature",
        description:
          "Lançamento inicial do Sistema Fiscal com as funcionalidades de Consulta de Alíquota, Pesquisa de TES e Validador de XML.",
      },
    ],
  },
];
