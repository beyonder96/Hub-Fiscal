import type { TaxRateData } from "@/lib/definitions";

export const taxRates: TaxRateData[] = [
    { destinationStateName: "Acre", destinationStateCode: "AC", interstateRate: { ES: 12, SP: 7 }, importedRate: 4, internalDestinationRate: 19, suframa: true, protocol: false },
    { destinationStateName: "Alagoas", destinationStateCode: "AL", interstateRate: { ES: 12, SP: 7 }, importedRate: 4, internalDestinationRate: 19, suframa: false, protocol: false },
    { destinationStateName: "Amapá", destinationStateCode: "AP", interstateRate: { ES: 12, SP: 7 }, importedRate: 4, internalDestinationRate: 18, suframa: true, protocol: false },
    { destinationStateName: "Amazonas", destinationStateCode: "AM", interstateRate: { ES: 12, SP: 7 }, importedRate: 4, internalDestinationRate: 20, suframa: true, protocol: false },
    { destinationStateName: "Bahia", destinationStateCode: "BA", interstateRate: { ES: 12, SP: 7 }, importedRate: 4, internalDestinationRate: 20.5, suframa: false, protocol: false },
    { destinationStateName: "Ceará", destinationStateCode: "CE", interstateRate: { ES: 12, SP: 7 }, importedRate: 4, internalDestinationRate: 20, suframa: false, protocol: false },
    { destinationStateName: "Distrito Federal", destinationStateCode: "DF", interstateRate: { ES: 12, SP: 7 }, importedRate: 4, internalDestinationRate: 20, suframa: false, protocol: false },
    { destinationStateName: "Espírito Santo", destinationStateCode: "ES", interstateRate: { ES: 17, SP: 7 }, importedRate: 4, internalDestinationRate: 17, suframa: false, protocol: true },
    { destinationStateName: "Goiás", destinationStateCode: "GO", interstateRate: { ES: 12, SP: 7 }, importedRate: 4, internalDestinationRate: 19, suframa: false, protocol: false },
    { destinationStateName: "Maranhão", destinationStateCode: "MA", interstateRate: { ES: 12, SP: 7 }, importedRate: 4, internalDestinationRate: 23, suframa: false, protocol: false },
    { destinationStateName: "Mato Grosso", destinationStateCode: "MT", interstateRate: { ES: 12, SP: 7 }, importedRate: 4, internalDestinationRate: 17, suframa: false, protocol: false },
    { destinationStateName: "Mato Grosso do Sul", destinationStateCode: "MS", interstateRate: { ES: 12, SP: 7 }, importedRate: 4, internalDestinationRate: 17, suframa: false, protocol: false },
    { destinationStateName: "Minas Gerais", destinationStateCode: "MG", interstateRate: { ES: 12, SP: 12 }, importedRate: 4, internalDestinationRate: 18, suframa: false, protocol: true },
    { destinationStateName: "Pará", destinationStateCode: "PA", interstateRate: { ES: 12, SP: 7 }, importedRate: 4, internalDestinationRate: 19, suframa: false, protocol: false },
    { destinationStateName: "Paraíba", destinationStateCode: "PB", interstateRate: { ES: 12, SP: 7 }, importedRate: 4, internalDestinationRate: 20, suframa: false, protocol: false },
    { destinationStateName: "Paraná", destinationStateCode: "PR", interstateRate: { ES: 12, SP: 12 }, importedRate: 4, internalDestinationRate: 19.5, suframa: false, protocol: true },
    { destinationStateName: "Pernambuco", destinationStateCode: "PE", interstateRate: { ES: 12, SP: 7 }, importedRate: 4, internalDestinationRate: 20.5, suframa: false, protocol: false },
    { destinationStateName: "Piauí", destinationStateCode: "PI", interstateRate: { ES: 12, SP: 7 }, importedRate: 4, internalDestinationRate: 22.5, suframa: false, protocol: false },
    { destinationStateName: "Rio de Janeiro", destinationStateCode: "RJ", interstateRate: { ES: 12, SP: 12 }, importedRate: 4, internalDestinationRate: 22, suframa: false, protocol: true },
    { destinationStateName: "Rio Grande do Norte", destinationStateCode: "RN", interstateRate: { ES: 12, SP: 7 }, importedRate: 4, internalDestinationRate: 20, suframa: false, protocol: false },
    { destinationStateName: "Rio Grande do Sul", destinationStateCode: "RS", interstateRate: { ES: 12, SP: 12 }, importedRate: 4, internalDestinationRate: 17, suframa: false, protocol: true },
    { destinationStateName: "Rondônia", destinationStateCode: "RO", interstateRate: { ES: 12, SP: 7 }, importedRate: 4, internalDestinationRate: 19.5, suframa: true, protocol: false },
    { destinationStateName: "Roraima", destinationStateCode: "RR", interstateRate: { ES: 12, SP: 7 }, importedRate: 4, internalDestinationRate: 20, suframa: true, protocol: false },
    { destinationStateName: "Santa Catarina", destinationStateCode: "SC", interstateRate: { ES: 12, SP: 12 }, importedRate: 4, internalDestinationRate: 17, suframa: false, protocol: true },
    { destinationStateName: "São Paulo", destinationStateCode: "SP", interstateRate: { ES: 12, SP: 18 }, importedRate: 4, internalDestinationRate: 18, suframa: false, protocol: true },
    { destinationStateName: "Sergipe", destinationStateCode: "SE", interstateRate: { ES: 12, SP: 7 }, importedRate: 4, internalDestinationRate: 19, suframa: false, protocol: false },
    { destinationStateName: "Tocantins", destinationStateCode: "TO", interstateRate: { ES: 12, SP: 7 }, importedRate: 4, internalDestinationRate: 20, suframa: false, protocol: false },
];

export function findTaxRate(destinationCode: string): TaxRateData | undefined {
    return taxRates.find(rate => rate.destinationStateCode === destinationCode);
}
