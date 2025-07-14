
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
    version: "1.2.0",
    date: "2024-07-15",
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
    date: "2024-07-10",
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
    date: "2024-07-01",
    changes: [
      {
        type: "feature",
        description:
          "Lançamento inicial do Sistema Fiscal com as funcionalidades de Consulta de Alíquota, Pesquisa de TES e Validador de XML.",
      },
    ],
  },
];
