
import type { Prestador } from './definitions';

export const prestadores: Prestador[] = [
  {
    id: '79670',
    nome: 'BOA VISTA S.A.',
    nomeBusca: 'boa vista',
    servico: '03115',
    tes: '1A4',
    conta: '311213',
    vencimento: 'CONFORME BOLETO',
    nfts: 'SIM',
    iss: 'NÃO',
  },
  {
    id: '81234',
    nome: 'CONSULTORIA XYZ LTDA',
    nomeBusca: 'consultoria xyz',
    servico: '01701',
    tes: '1B2',
    conta: '456789',
    vencimento: 'DIA 15 DO MÊS SEGUINTE',
    nfts: 'SIM',
    iss: 'SIM',
  },
  {
    id: '95678',
    nome: 'LIMPEZA TOTAL SERVIÇOS',
    nomeBusca: 'limpeza total',
    servico: '07111',
    tes: '2C3',
    conta: '987654',
    vencimento: 'CONFORME BOLETO',
    nfts: 'NÃO',
    iss: 'SIM',
  },
  {
    id: '10111',
    nome: 'SOFTWARE HOUSE INOVAÇÕES',
    nomeBusca: 'software house',
    servico: '01302',
    tes: '3D5',
    conta: '112233',
    vencimento: 'CONFORME CONTRATO',
    nfts: 'SIM',
    iss: 'SIM',
  }
];

export function findPrestador(query: string): Prestador | undefined {
    if (!query) return undefined;
    const lowerCaseQuery = query.toLowerCase();
    return prestadores.find(p => p.nome.toLowerCase().includes(lowerCaseQuery) || p.nomeBusca.toLowerCase().includes(lowerCaseQuery));
}
