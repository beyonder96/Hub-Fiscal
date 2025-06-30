import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TesCode } from "@/lib/definitions";
import { CheckCircle2, XCircle } from "lucide-react";

interface TesResultsProps {
  results: TesCode[];
  title: string;
  description: string;
}

export function TesResults({ results, title, description }: TesResultsProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.map((tes) => (
          <div key={tes.code} className="p-4 border rounded-lg bg-background/50">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-primary">TES: {tes.code}</h3>
                <p className="text-sm text-muted-foreground mt-1">{tes.description}</p>
              </div>
              <div className="flex items-center gap-3 pt-1 flex-shrink-0">
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
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
