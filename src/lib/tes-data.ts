
import type { TesCode, SalePurpose, Company, ContributorType, TaxRateData } from "./definitions";

interface VendaConsumoBranch {
  normal?: TesCode[];
  zfm?: TesCode[];
}
interface VendaRevendaBranch {
  normal?: TesCode[] | Record<string, any>;
  zfm: {
    com_suframa: TesCode[];
    sem_suframa: TesCode[];
  };
}
interface VendaBranch {
  revenda: VendaRevendaBranch;
  consumo: VendaConsumoBranch;
}

interface TesDatabase {
  filial_es: {
    compra: TesCode[];
    venda: VendaBranch;
  };
  matriz: {
    compra: TesCode[];
    venda: VendaBranch;
  };
}

export const tesData: TesDatabase = {
  filial_es: {
    compra: [
      { code: '002', calculaIcms: true, calculaIpi: true, atualizaEstoque: true, description: 'Compra para Revenda ou Industrialização (Tributada)' },
      { code: '006', calculaIcms: true, calculaIpi: false, atualizaEstoque: true, description: 'Compra para Revenda ou Industrialização (Isenta IPI). Usado em operações internas no ES (Alíquota 17%).' },
      { code: '008', calculaIcms: true, calculaIpi: true, atualizaEstoque: true, description: 'Compra p/ Uso, Consumo ou Ativo (Tributada). Usado em operações internas no ES (Alíquota 17%).' },
      { code: '010', calculaIcms: true, calculaIpi: false, atualizaEstoque: true, description: 'Compra p/ Uso, Consumo ou Ativo (Isenta IPI)' },
    ],
    venda: {
      consumo: {
        zfm: [{ code: '525', calculaIcms: true, calculaIpi: true, atualizaEstoque: true, description: 'Venda p/ Consumo em Zona Franca (Filial ES)', calculaDifal: true }]
      },
      revenda: {
        zfm: {
          com_suframa: [{ code: '517', calculaIcms: true, calculaIpi: true, atualizaEstoque: true, description: 'Venda p/ Revenda em Zona Franca com SUFRAMA (Filial ES)' }],
          sem_suframa: []
        }
      }
    }
  },
  matriz: {
    compra: [],
    venda: {
      consumo: {
        zfm: [{ code: '586', calculaIcms: true, calculaIpi: true, atualizaEstoque: true, description: 'Venda p/ Consumo em Zona Franca (Matriz)', calculaDifal: true }]
      },
      revenda: {
        zfm: {
          com_suframa: [{ code: '723', calculaIcms: true, calculaIpi: true, atualizaEstoque: true, description: 'Venda p/ Revenda em Zona Franca com SUFRAMA (Matriz)' }],
          sem_suframa: []
        }
      }
    }
  }
};

export function findCompraTesCodes(company: Company): TesCode[] | undefined {
    return tesData[company]?.compra;
}

export function findVendaTesCodes(
  company: Company, 
  purpose: SalePurpose, 
  saleType: 'normal' | 'zfm', 
  hasSuframa: boolean | null
): TesCode[] | undefined {
  const vendaBranch = tesData[company]?.venda;
  if (!vendaBranch) return undefined;

  if (purpose === 'consumo') {
    return vendaBranch.consumo[saleType];
  }

  if (purpose === 'revenda') {
    if (saleType === 'normal') {
      return (vendaBranch.revenda.normal as TesCode[]);
    }
    if (saleType === 'zfm') {
      return hasSuframa ? vendaBranch.revenda.zfm.com_suframa : vendaBranch.revenda.zfm.sem_suframa;
    }
  }
  
  return undefined;
}


export function findVendaNormalTes(
  company: Company,
  purpose: SalePurpose,
  destinationState: string,
  contributorType: ContributorType,
  hasSt: boolean | null,
  allTaxRates: TaxRateData[]
): TesCode[] | undefined {

  const stateData = allTaxRates.find(r => r.destinationStateCode === destinationState);
  if (!stateData) return undefined;
  
  const hasFecap = destinationState === 'RJ' || destinationState === 'AL';

  const baseTES = (code: string, description: string, extras: Partial<Omit<TesCode, 'code' | 'description'>> = {}): TesCode[] => [{ 
      code, 
      calculaIcms: true, 
      calculaIpi: true,
      atualizaEstoque: true,
      description,
      calculaFecap: hasFecap,
      ...extras 
  }];

  // Handle Isento case first
  if (contributorType === 'isento') {
      if (company === 'matriz') {
          return baseTES('695', 'Venda p/ Não Contribuinte (Matriz)', { calculaDifal: true });
      }
      if (company === 'filial_es') {
          return baseTES('511', 'Venda p/ Não Contribuinte (Filial ES)', { calculaDifal: true });
      }
  }

  // --- From now on, logic is for Contribuinte only ---
  if (company === 'matriz') {
    if (purpose === 'revenda') {
      if (destinationState === 'SP') {
        return [ // This one is special, multiple results
          { code: '526', calculaIcms: true, calculaIpi: true, atualizaEstoque: true, description: 'Venda p/ Revenda dentro de SP (Simples Nacional)', calculaFecap: hasFecap },
          { code: '523', calculaIcms: true, calculaIpi: true, atualizaEstoque: true, description: 'Venda p/ Revenda dentro de SP (Regime Normal)', calculaFecap: hasFecap }
        ];
      }
      
      if (stateData.protocol) {
        if (hasSt === true) return baseTES('509', `Venda para Revenda com ST - ${destinationState}`, { calculaIcmsSt: true });
        if (hasSt === false) return baseTES('585', `Venda para Revenda sem ST - ${destinationState}`);
        return undefined; // Must select ST
      } else {
        // No protocol, no ST question
        return baseTES('585', `Venda para Revenda - ${destinationState}`);
      }
    }

    if (purpose === 'consumo') {
      if (destinationState === 'SP') {
         return [ // Special case with multiple results
          { code: '526', calculaIcms: true, calculaIpi: true, atualizaEstoque: true, description: 'Venda p/ Consumo dentro de SP (Simples Nacional)', calculaFecap: hasFecap },
          { code: '523', calculaIcms: true, calculaIpi: true, atualizaEstoque: true, description: 'Venda p/ Consumo dentro de SP (Regime Normal)', calculaFecap: hasFecap }
        ];
      }
      
      // For consumption, it's always DIFAL for interstate to contributors
      const isDifal = true; 
      
      const consumoEspeciais: Record<string, string> = { AM: '586', MT: '581', MS: '581', MG: '581', PR: '581', RJ: '581', RS: '581', AP: '581' };
      if (consumoEspeciais[destinationState]) {
        const code = consumoEspeciais[destinationState];
        return baseTES(code, `Venda p/ Consumo (DIFAL) - ${destinationState}`, { calculaDifal: isDifal });
      }
      
      return baseTES('585', `Venda p/ Consumo (DIFAL) - ${destinationState}`, { calculaDifal: isDifal });
    }
  }

  if (company === 'filial_es') {
    // Logic for Filial ES and Contribuinte can be added here later.
    return [];
  }

  return undefined;
}
