
import type { CalculatedRates } from "@/lib/definitions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface TaxResultCardProps {
  result: CalculatedRates | null;
  notFound: boolean;
}

export function TaxResultCard({ result, notFound }: TaxResultCardProps) {
  if (notFound) {
    return (
      <Card className="w-full border-destructive/50 bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle />
            Combinação não encontrada
          </CardTitle>
          <CardDescription className="text-destructive/90">
            Não encontramos uma alíquota para a combinação de origem e destino
            informada. Por favor, verifique os dados e tente novamente.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  const { origin, destination } = result;
  const interstateRate = destination.interstateRate[origin];

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold font-headline text-foreground">Resultado da Consulta</h2>
    
      <div className="p-4 rounded-lg shadow-sm bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 dark:from-slate-800/50 dark:via-slate-800/20 dark:to-background">
          <p className="text-sm text-muted-foreground">Rota Consultada</p>
          <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                  {origin} → {destination.destinationStateCode}
              </span>
              <p className="font-semibold text-muted-foreground">{destination.destinationStateName}</p>
          </div>
      </div>

      <div className="p-4 rounded-lg shadow-sm bg-green-100 dark:bg-green-500/10">
          <p className="text-sm text-green-800/80 dark:text-green-200/80">Alíquota Interestadual ICMS</p>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">{interstateRate}%</p>
      </div>

      <div className="p-4 rounded-lg shadow-sm bg-orange-100 dark:bg-orange-500/10">
          <p className="text-sm text-orange-800/80 dark:text-orange-200/80">Alíquota Itens Importados</p>
          <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">{destination.importedRate}%</p>
      </div>

      <div className="p-4 rounded-lg shadow-sm bg-purple-100 dark:bg-purple-500/10">
          <p className="text-sm text-purple-800/80 dark:text-purple-200/80">Alíquota Interna do Destino</p>
          <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{destination.internalDestinationRate}%</p>
      </div>
  </div>
  );
}
