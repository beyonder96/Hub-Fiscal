
import { Calculator } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export function Placeholder() {
  return (
    <Card className="h-full flex items-center justify-center">
      <CardContent className="flex flex-col items-center justify-center text-center p-10">
        <div className="p-4 bg-muted rounded-full mb-4">
          <Calculator className="h-10 w-10 text-muted-foreground/70" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          Resultado da Consulta
        </h3>
        <p className="mt-2 max-w-sm text-base text-muted-foreground">
          Selecione os estados de origem e destino e clique em "Consultar Alíquotas" para ver o resultado
        </p>
      </CardContent>
    </Card>
  );
}
