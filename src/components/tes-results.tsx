import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TesCode } from "@/lib/definitions";
import { CheckCircle2, SearchX, XCircle, ArrowRightLeft, ReceiptText, Landmark } from "lucide-react";

interface TesResultsProps {
  results: TesCode[];
  operation: "compra" | "venda" | null;
}

export function TesResults({ results, operation }: TesResultsProps) {
  if (results.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg border border-dashed">
        <CardContent className="p-10 text-center">
            <SearchX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Nenhum TES Encontrado</h3>
            <p className="text-muted-foreground mt-2">
                Não encontramos um código TES para os critérios selecionados. Por favor, tente uma nova pesquisa.
            </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border">
      <CardHeader>
        <CardTitle>Códigos TES Encontrados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.map((tes) => (
          <div key={tes.code} className="p-4 border rounded-lg bg-background/50">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-primary">TES: {tes.code}</h3>
                <p className="text-sm text-muted-foreground mt-1">{tes.description}</p>
              </div>
              <div className="flex items-center gap-2 pt-1 flex-shrink-0 flex-wrap justify-end">
                {operation === 'compra' ? (
                  <>
                    <Badge variant={tes.calculaIcms ? "default" : "secondary"}>
                      {tes.calculaIcms ? <CheckCircle2 className="mr-1 h-4 w-4" /> : <XCircle className="mr-1 h-4 w-4" />}
                      ICMS
                    </Badge>
                    <Badge variant={tes.calculaIpi ? "default" : "secondary"}>
                      {tes.calculaIpi ? <CheckCircle2 className="mr-1 h-4 w-4" /> : <XCircle className="mr-1 h-4 w-4" />}
                      IPI
                    </Badge>
                    <Badge variant={tes.atualizaEstoque ? "default" : "secondary"}>
                      {tes.atualizaEstoque ? <CheckCircle2 className="mr-1 h-4 w-4" /> : <XCircle className="mr-1 h-4 w-4" />}
                      Estoque
                    </Badge>
                  </>
                ) : (
                  <>
                    <Badge variant={tes.calculaIcms ? "default" : "secondary"}>
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      ICMS
                    </Badge>
                    {tes.calculaDifal && (
                        <Badge variant="default">
                            <ArrowRightLeft className="mr-1 h-4 w-4" />
                            DIFAL
                        </Badge>
                    )}
                     {tes.calculaIcmsSt && (
                        <Badge variant="default">
                            <ReceiptText className="mr-1 h-4 w-4" />
                            ICMS-ST
                        </Badge>
                    )}
                     {tes.calculaFecap && (
                        <Badge variant="default">
                            <Landmark className="mr-1 h-4 w-4" />
                            FECAP
                        </Badge>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
