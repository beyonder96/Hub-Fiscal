
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArchiveX, Home } from "lucide-react";
import Link from "next/link";

export default function CalculadoraRemovedPage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="w-full max-w-lg text-center shadow-lg border">
        <CardHeader>
          <div className="mx-auto bg-destructive/10 rounded-full p-3 w-fit mb-4">
              <ArchiveX className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle>Recurso Desativado</CardTitle>
          <CardDescription>A página da calculadora foi desativada.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
              Este recurso agora está disponível como um pop-up acessível pelo cabeçalho do site.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
              <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Voltar para a Página Inicial
              </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
