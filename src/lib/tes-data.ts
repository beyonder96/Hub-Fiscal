
import type { TesCode, SalePurpose, Company, ContributorType } from "./definitions";
import { taxRates } from "./tax-data";

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
      { code: '006', calculaIcms: true, calculaIpi: false, atualizaEstoque: true, description: 'Compra para Revenda ou Industrialização (Isenta IPI)' },
      { code: '008', calculaIcms: true, calculaIpi: true, atualizaEstoque: true, description: 'Compra p/ Uso, Consumo ou Ativo (Tributada)' },
      { code: '010', calculaIcms: true, calculaIpi: false, atualizaEstoque: true, description: 'Compra p/ Uso, Consumo ou Ativo (Isenta IPI)' },
    ],
    venda: {
      consumo: {
        zfm: [{ code: '525', calculaIcms: true, calculaIpi: true, atualizaEstoque: true, description: 'Venda p/ Consumo em Zona Franca (Filial ES)' }]
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
        zfm: [{ code: '586', calculaIcms: true, calculaIpi: true, atualizaEstoque: true, description: 'Venda p/ Consumo em Zona Franca (Matriz)' }]
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


export function findVendaNormalTesForMatriz(
  purpose: SalePurpose,
  destinationState: string,
  contributorType: ContributorType,
  hasSt: boolean | null
): TesCode[] | undefined {

  const stateData = taxRates.find(r => r.destinationStateCode === destinationState);
  if (!stateData) return undefined;

  const baseTES = (code: string, description: string): TesCode[] => [{ code, calculaIcms: true, calculaIpi: true, atualizaEstoque: true, description }];

  if (purpose === 'revenda') {
    if (destinationState === 'SP') {
      return [
        { code: '526', calculaIcms: true, calculaIpi: true, atualizaEstoque: true, description: 'Venda p/ Revenda dentro de SP (Simples Nacional)' },
        { code: '523', calculaIcms: true, calculaIpi: true, atualizaEstoque: true, description: 'Venda p/ Revenda dentro de SP (Regime Normal)' }
      ];
    }
    if (destinationState === 'AM') return baseTES('708', 'Venda para Revenda - Amazonas');

    const protocolStatesWith509 = ['AP', 'MT', 'MS', 'MG', 'PR', 'RJ'];
    if (protocolStatesWith509.includes(destinationState)) {
        return baseTES('509', `Venda para Revenda - ${destinationState}`);
    }

    if (stateData.protocol) {
      if (hasSt === true) return baseTES('509', `Venda para Revenda com ST - ${destinationState}`);
      if (hasSt === false) return baseTES('585', `Venda para Revenda sem ST - ${destinationState}`);
      return undefined; // Must select ST
    } else {
      // Non-protocol states default
      return baseTES('585', `Venda para Revenda - ${destinationState}`);
    }
  }

  if (purpose === 'consumo') {
    if (destinationState === 'SP') {
       return [
        { code: '526', calculaIcms: true, calculaIpi: true, atualizaEstoque: true, description: 'Venda p/ Consumo dentro de SP (Simples Nacional)' },
        { code: '523', calculaIcms: true, calculaIpi: true, atualizaEstoque: true, description: 'Venda p/ Consumo dentro de SP (Regime Normal)' }
      ];
    }
    
    // States with specific Consumption TES codes
    const consumoEspeciais: Record<string, string> = { AM: '586', MT: '581', MS: '581', MG: '581', PR: '581', RJ: '581', RS: '581' };
    if (consumoEspeciais[destinationState]) {
      const code = consumoEspeciais[destinationState];
      return baseTES(code, `Venda p/ Consumo (DIFAL) - ${destinationState}`);
    }

    if (destinationState === 'AP') {
      if (contributorType === 'contribuinte') return baseTES('581', 'Venda p/ Consumo (DIFAL Contribuinte) - AP');
      if (contributorType === 'isento') return baseTES('591', 'Venda p/ Consumo (DIFAL Isento) - AP');
      return undefined;
    }
    
    // Default for all others
    return baseTES('585', `Venda p/ Consumo (DIFAL) - ${destinationState}`);
  }

  return undefined;
}

    