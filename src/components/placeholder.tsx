
import { Search } from "lucide-react";

export function Placeholder() {
  return (
    <div className="w-full space-y-4">
        <h2 className="text-2xl font-bold font-headline text-foreground">Resultado da Consulta</h2>
        <div className="flex flex-col items-center justify-center text-center p-10 rounded-lg bg-card border border-dashed h-full">
            <div className="p-4 bg-muted rounded-full mb-4">
              <Search className="h-10 w-10 text-muted-foreground/70" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Aguardando consulta
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Preencha os dados ao lado para ver o resultado da consulta de alíquotas.
            </p>
        </div>
    </div>
  );
}
