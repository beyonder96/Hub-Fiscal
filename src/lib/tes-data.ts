import type { TesCode } from "./definitions";

type Company = "matriz" | "filial_es";
type Operation = "compra" | "venda";

interface TesDatabase {
    filial_es: {
        compra: TesCode[];
        venda?: TesCode[];
    };
    matriz?: {
        compra?: TesCode[];
        venda?: TesCode[];
    }
}

export const tesData: TesDatabase = {
  filial_es: {
    compra: [
      { code: '002', calculaIcms: true, calculaIpi: true, atualizaEstoque: true, description: 'Compra para Revenda ou Industrialização (Tributada)' },
      { code: '006', calculaIcms: true, calculaIpi: false, atualizaEstoque: true, description: 'Compra para Revenda ou Industrialização (Isenta IPI)' },
      { code: '008', calculaIcms: true, calculaIpi: true, atualizaEstoque: true, description: 'Compra p/ Uso, Consumo ou Ativo (Tributada)' },
      { code: '010', calculaIcms: true, calculaIpi: false, atualizaEstoque: true, description: 'Compra p/ Uso, Consumo ou Ativo (Isenta IPI)' },
    ]
  }
}

export function findTesCodes(company: Company, operation: Operation): TesCode[] | undefined {
  if (tesData[company] && tesData[company][operation]) {
    return tesData[company][operation];
  }
  return undefined;
}
