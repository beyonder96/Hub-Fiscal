import type { TesCode, SalePurpose, Company } from "./definitions";

interface VendaConsumoBranch {
  normal?: TesCode[];
  zfm?: TesCode[];
}
interface VendaRevendaBranch {
  normal?: TesCode[];
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
      return vendaBranch.revenda.normal;
    }
    if (saleType === 'zfm') {
      return hasSuframa ? vendaBranch.revenda.zfm.com_suframa : vendaBranch.revenda.zfm.sem_suframa;
    }
  }
  
  return undefined;
}
