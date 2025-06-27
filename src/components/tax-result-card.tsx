
import type { CalculatedRates } from "@/lib/definitions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CirclePercent, Factory, ShipWheel, Landmark, AlertTriangle } from "lucide-react";

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

  const { origin, destination, isImported } = result;
  const interstateRate = destination.interstateRate[origin];

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center justify-between">
          <span>Resultado da Consulta</span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{origin}</Badge>
            <span>→</span>
            <Badge>{destination.destinationStateCode}</Badge>
          </div>
        </CardTitle>
        <CardDescription>
          Alíquotas de ICMS para a transação de{" "}
          <span className="font-semibold text-foreground">
            {origin}
          </span>{" "}
          para{" "}
          <span className="font-semibold text-foreground">
            {destination.destinationStateName}
          </span>
          .
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isImported && (
          <div className="bg-accent/20 border-l-4 border-accent text-accent-foreground p-4 rounded-md">
            <h3 className="font-bold flex items-center gap-2">
              <ShipWheel className="h-5 w-5" />
              Alíquota para Item Importado
            </h3>
            <p className="text-3xl font-bold mt-1">
              {destination.importedRate}%
            </p>
          </div>
        )}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-3">
              <Factory className="h-6 w-6 text-muted-foreground" />
              <span className="font-medium">Alíquota Interestadual</span>
            </div>
            <span className="font-bold text-lg text-primary">
              {interstateRate}%
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <Landmark className="h-6 w-6 text-muted-foreground" />
              <span className="font-medium">Alíquota Interna de Destino</span>
            </div>
            <span className="font-bold text-lg text-primary">
              {destination.internalDestinationRate}%
            </span>
          </div>
        </div>

        {destination.suframa && (
          <Badge variant="outline" className="w-fit border-amber-500 text-amber-700 dark:text-amber-400">
            Destino com benefício SUFRAMA
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
