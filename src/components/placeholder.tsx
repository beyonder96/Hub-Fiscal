
import { BarChart3 } from "lucide-react";

export function Placeholder() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg text-muted-foreground animate-in fade-in-50">
      <div className="p-4 bg-muted rounded-full mb-4">
        <BarChart3 className="h-10 w-10 text-muted-foreground/70" />
      </div>
      <h3 className="text-xl font-semibold font-headline text-foreground">
        Aguardando sua consulta
      </h3>
      <p className="mt-2 max-w-sm text-base">
        Preencha o formulário acima para ver os resultados detalhados das
        alíquotas e um gráfico comparativo.
      </p>
    </div>
  );
}
