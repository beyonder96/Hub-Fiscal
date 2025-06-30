"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";

export function CalculoIcmsSt() {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-4">
          <Wrench className="h-8 w-8 text-primary" />
        </div>
        <CardTitle>Cálculo de ICMS-ST</CardTitle>
        <CardDescription>
          Este recurso está em desenvolvimento e será implementado em breve.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          Agradecemos a sua paciência.
        </p>
      </CardContent>
    </Card>
  );
}
