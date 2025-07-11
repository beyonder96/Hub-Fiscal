
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

// --- XML VALIDATOR DEFINITIONS ---

export const NfeInputTypes = ["Revenda", "Consumo", "Conserto"] as const;
export type NfeInputType = (typeof NfeInputTypes)[number];

export interface NfeProductData {
    item: string;
    cProd?: string;
    xProd?: string;
    ncm?: string;
    cfop?: string;
    cst?: string; // combined
    vProd?: string;
    vFrete?: string;
    icms: {
        vBC?: string;
        pICMS?: string;
        vICMS?: string;
        pRedBC?: string;
    };
    ipi: {
        cst?: string;
        vBC?: string;
        pIPI?: string;
        vIPI?: string;
    };
    icmsSt: {
        vBCST?: string;
        pMVAST?: string;
        pICMSST?: string;
        vICMSST?: string;
        pRedBCST?: string;
    };
}

export interface NfeData {
  fileName: string;
  versao?: string;
  chave?: string;
  natOp?: string;
  // Emitter
  emitRazaoSocial?: string;
  emitCnpj?: string;
  emitUf?: string;
  emitCrt?: string;
  // Destination
  destRazaoSocial?: string;
  destCnpj?: string;
  destUf?: string;
  // Totals
  nNf?: string;
  dhEmi?: string;
  vNF?: string;
  vFrete?: string;
  // Totals from ICMSTot
  total: {
      vBC?: string;
      vICMS?: string;
      vBCST?: string;
      vICMSST?: string;
      vIPI?: string;
  }
  // Products
  products: NfeProductData[];
}

export type ValidationState = 'valid' | 'divergent' | 'not_applicable';

export interface ValidationMessage {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  details?: string;
}

export interface CalculationValidation {
    check: ValidationState;
    message: string;
}

export interface ValidationResult {
  id: string;
  fileName: string;
  status: 'error' | 'warning' | 'success'; // File read status
  nfeData: NfeData | null;
  selectedInputType: NfeInputType;
  // Basic structural validations
  messages: ValidationMessage[];
  // Calculation validations
  calculationValidations: {
      vBC: CalculationValidation;
      vICMS: CalculationValidation;
      vIPI: CalculationValidation;
      vBCST: CalculationValidation;
      vICMSST: CalculationValidation;
  }
}

export interface ValidationHistoryItem {
  id: string;
  fileName: string;
  date: string; // ISO string
  status: 'error' | 'warning' | 'success'; // File read status
  overallValidation: 'Validada' | 'Divergente' | 'N/A';
  icmsStStatus: ValidationState;
}

// --- TES Search Definitions ---
export type Company = "matriz" | "filial_es";
export type SalePurpose = "revenda" | "consumo";
export type ContributorType = "contribuinte" | "isento";

export interface TesCode {
  code: string;
  calculaIcms: boolean;
  calculaIpi: boolean;
  atualizaEstoque: boolean;
  calculaDifal?: boolean;
  calculaIcmsSt?: boolean;
  calculaFecap?: boolean;
  description: string;
}

// --- ICMS-ST Calculator Definitions ---
const numericString = (errorMessage: string) => 
  z.string().min(1, errorMessage).refine(value => {
    const n = parseFloat(value.replace(/\./g, '').replace(',', '.'));
    return !isNaN(n);
  }, { message: "Valor inválido." });

export const icmsStSchema = z.object({
  items: z.string().optional(),
  operationType: z.enum(['compra', 'transferencia', 'pecas'], { required_error: "Selecione o tipo de operação." }),
  ncm: z.string().optional(),
  fornecedor: z.string().optional(),
  valorMercadoria: numericString("Este campo é obrigatório."),
  valorFrete: numericString("Valor inválido.").optional().or(z.literal('')),
  valorIpi: numericString("Valor inválido.").optional().or(z.literal('')),
  aliqIpi: numericString("Valor inválido.").optional().or(z.literal('')),
  aliqIcms: numericString("Alíquota ICMS é obrigatória."),
  mva: numericString("IVA/MVA é obrigatório."),
  aliqIcmsSt: numericString("Alíquota ICMS-ST é obrigatória."),
  redBaseSt: numericString("Valor inválido.").optional().or(z.literal('')),
}).superRefine((data, ctx) => {
    if (data.operationType === 'pecas' && (!data.aliqIpi || parseFloat(data.aliqIpi.replace(/\./g, '').replace(',', '.')) <= 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['aliqIpi'],
            message: 'Alíquota IPI é obrigatória para esta operação.'
        });
    }
});

export type IcmsStFormData = z.infer<typeof icmsStSchema>;

// --- Prestador Lookup Definitions ---
const SimNaoEnum = z.enum(['SIM', 'NÃO', '']).optional();

export const prestadorSchema = z.object({
  id: z.string().optional(),
  empresa: z.string().min(1, 'Empresa é obrigatória.'),
  nome: z.string().min(1, 'Nome é obrigatório.'),
  fornecedor: z.string().optional(),
  descricao: z.string().optional(),
  servico: z.string().optional(),
  tes: z.string().optional(),
  conta: z.string().optional(),
  vencimento: z.string().optional(),
  municipio: z.string().optional(),
  nfts: SimNaoEnum,
  simplesNacional: SimNaoEnum,
  iss: SimNaoEnum,
  ir: SimNaoEnum,
  pcc: SimNaoEnum,
  inss: z.enum(['SIM', 'NÃO', 'PORTO', '']).optional(),
  codIr: z.string().optional(),
  codPcc: z.string().optional(),
  email: z.string().optional(),
  autenticidadeUrl: z.string().optional(),
});

export type PrestadorFormData = z.infer<typeof prestadorSchema>;

export type Prestador = PrestadorFormData & {
  id: string;
  nomeBusca: string;
};

// --- Admin Tasks Definitions ---
export const taskSchema = z.object({
  title: z.string().min(3, { message: "A tarefa deve ter pelo menos 3 caracteres." }),
});

export type TaskFormData = z.infer<typeof taskSchema>;

export interface Task {
  id: string;
  title: string;
  status: 'Pendente' | 'Concluída';
  createdAt: string; // ISO string
}
