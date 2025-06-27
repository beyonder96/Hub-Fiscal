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
}

export interface CalculatedRates {
  origin: "ES" | "SP";
  destination: TaxRateData;
}

export const chamadoFormSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  topic: z.string({ required_error: "Por favor, selecione um tópico." }),
  description: z.string().min(1, { message: "Por favor, adicione uma descrição." }),
  file: z.any().optional(),
});

export type ChamadoFormData = z.infer<typeof chamadoFormSchema>;

export type ChamadoStatus = "Aberto" | "Em Andamento" | "Resolvido";

export interface Chamado {
  id: string;
  name: string;
  topic: string;
  description?: string;
  fileName?: string;
  status: ChamadoStatus;
  createdAt: string; // ISO string
}
