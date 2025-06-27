import { z } from "zod";

export const taxFormSchema = z.object({
  origin: z.enum(["ES", "SP"], {
    required_error: "Selecione um estado de origem.",
  }),
  destination: z.string({
    required_error: "Selecione um estado de destino.",
  }).min(2, { message: "Selecione um estado de destino." }),
});

export type TaxFormData = z.infer<typeof taxFormSchema>;

export interface TaxRateData {
  destinationStateName: string;
  destinationStateCode: string;
  interstateRate: {
    ES: number;
    SP: number;
  };
  importedRate: number;
  internalDestinationRate: number;
  suframa: boolean;
  protocol: boolean;
}

export interface CalculatedRates {
  origin: "ES" | "SP";
  destination: TaxRateData;
}

export const ChamadoTitles = ["Cadastro", "Cálculo de ST", "Validação de Nota", "Lançamento de Nota"] as const;

export const chamadoFormSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  title: z.enum(ChamadoTitles, { required_error: "Por favor, selecione um título." }),
  description: z.string().min(1, { message: "Por favor, adicione uma descrição." }),
  file: z.any().optional(),
});

export type ChamadoFormData = z.infer<typeof chamadoFormSchema>;

export type ChamadoStatus = "Aberto" | "Em Andamento" | "Resolvido";

export interface Chamado {
  id: string;
  name: string;
  title: (typeof ChamadoTitles)[number];
  description?: string;
  fileName?: string;
  status: ChamadoStatus;
  createdAt: string; // ISO string
}

export const notaFiscalSchema = z.object({
  number: z.string().min(1, { message: "O número da nota é obrigatório." }),
  issueDate: z.date({ required_error: "A data de emissão é obrigatória." }),
  notes: z.string().optional(),
  reminderDate: z.date().optional(),
});

export type NotaFiscalFormData = z.infer<typeof notaFiscalSchema>;

export interface NotaFiscal {
  id: string;
  number: string;
  issueDate: string; // ISO string
  notes?: string;
  reminderDate?: string; // ISO string
  status: "Pendente" | "Concluída";
}

export const NfeInputTypes = ["Revenda", "Consumo", "Devolução", "Garantia", "Outro"] as const;
export type NfeInputType = (typeof NfeInputTypes)[number];

export interface NfeData {
  fileName: string;
  emitCnpj?: string;
  destCnpj?: string;
  nNf?: string;
  vNf?: string;
  dhEmi?: string;
  cfop?: string;
  version?: string;
}

export interface ValidationResult {
  id: string; // unique id for the result
  fileName: string;
  status: 'valid' | 'invalid';
  errors: string[];
  nfeData: NfeData | null;
  selectedInputType?: NfeInputType;
  otherInputType?: string;
}

export interface ValidationHistoryItem {
  id: string;
  fileName: string;
  date: string; // ISO string
  status: 'valid' | 'invalid';
}
