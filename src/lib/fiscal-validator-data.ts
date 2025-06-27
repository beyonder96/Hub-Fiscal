// This file simulates external data sources and company-specific rules for the XML validator.

export interface CompanyProfile {
  cnpj: string;
  razaoSocial: string;
  ie: string;
  endereco: string; // Simplified for this example
}

// The two valid company profiles for the destination
export const companyProfiles: CompanyProfile[] = [
  {
    cnpj: '12.345.678/0001-99',
    razaoSocial: 'EMPRESA DESTINO MODELO LTDA',
    ie: '123.456.789.111',
    endereco: 'Rua Exemplo, 123, Centro, São Paulo, SP',
  },
  {
    cnpj: '98.765.432/0001-00',
    razaoSocial: 'FILIAL DESTINO MODELO SA',
    ie: '987.654.321.111',
    endereco: 'Avenida Teste, 456, Bairro, Rio de Janeiro, RJ',
  },
];

// Simplified mapping of CRT to allowed CST/CSOSN starts
// CRT: 1-Simples Nacional, 2-Simples Nacional (excesso), 3-Regime Normal
export const cstValidationRules: Record<string, { allowed: string[], description: string, type: 'CST' | 'CSOSN' }> = {
  '1': { // Simples Nacional
    allowed: ['101', '102', '103', '201', '202', '203', '300', '400', '500', '900'],
    description: 'Emitente do Simples Nacional deve usar CSOSN.',
    type: 'CSOSN',
  },
  '3': { // Regime Normal
    allowed: ['00', '10', '20', '30', '40', '41', '50', '51', '60', '70', '90'],
    description: 'Emitente de Regime Normal deve usar CST.',
    type: 'CST',
  }
};
