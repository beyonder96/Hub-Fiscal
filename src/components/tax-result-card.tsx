import type { CalculatedRates } from "@/lib/definitions";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";

interface TaxResultCardProps {
  result: CalculatedRates | null;
  notFound: boolean;
}

export function TaxResultCard({ result, notFound }: TaxResultCardProps) {
  if (notFound) {
    return (
      <Card className="w-full border-destructive/50 bg-destructive/20 glass-effect">
        <div className="p-6">
          <h3 className="text-destructive flex items-center gap-2 font-bold">
            <AlertTriangle />
            Combinação não encontrada
          </h3>
          <p className="text-destructive/90 mt-2">
            Não encontramos uma alíquota para a combinação de origem e destino
            informada. Por favor, verifique os dados e tente novamente.
          </p>
        </div>
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
    
      <div className="p-4 rounded-lg shadow-sm bg-background/30">
          <p className="text-sm text-muted-foreground">Rota Consultada</p>
          <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                  {origin} → {destination.destinationStateCode}
              </span>
              <p className="font-semibold text-muted-foreground">{destination.destinationStateName}</p>
          </div>
      </div>
      
      <div className={cn(
        "p-4 rounded-lg shadow-sm",
        destination.protocol ? "bg-cyan-500/20" : "bg-slate-500/20"
      )}>
          <p className={cn(
            "text-sm",
            destination.protocol ? "text-cyan-800/80 dark:text-cyan-200/80" : "text-slate-800/80 dark:text-slate-200/80"
          )}>Protocolo/Convênio entre Estados</p>
          <div className={cn(
            "flex items-center gap-2 text-2xl font-bold",
            destination.protocol ? "text-cyan-600 dark:text-cyan-300" : "text-slate-600 dark:text-slate-300"
          )}>
            {destination.protocol ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
            <span>{destination.protocol ? "Sim" : "Não"}</span>
          </div>
      </div>

      <div className="p-4 rounded-lg shadow-sm bg-green-500/20">
          <p className="text-sm text-green-800/80 dark:text-green-200/80">Alíquota Interestadual ICMS</p>
          <p className="text-4xl font-bold text-green-600 dark:text-green-300">{interstateRate}%</p>
      </div>

      <div className="p-4 rounded-lg shadow-sm bg-orange-500/20">
          <p className="text-sm text-orange-800/80 dark:text-orange-200/80">Alíquota Itens Importados (Origem {origin})</p>
          <p className="text-4xl font-bold text-orange-600 dark:text-orange-300">4% <span className="text-lg font-medium">(Fixa)</span></p>
      </div>

      <div className="p-4 rounded-lg shadow-sm bg-purple-500/20">
          <p className="text-sm text-purple-800/80 dark:text-purple-200/80">Alíquota Interna do Destino</p>
          <p className="text-4xl font-bold text-purple-600 dark:text-purple-300">{destination.internalDestinationRate}%</p>
      </div>
  </div>
  );
}
