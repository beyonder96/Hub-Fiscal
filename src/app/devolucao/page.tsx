
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArchiveX, Home } from "lucide-react";
import Link from "next/link";

export default function DevolucaoRemovedPage() {
  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        <Card className="w-full max-w-lg text-center shadow-lg border">
          <CardHeader>
            <div className="mx-auto bg-destructive/10 rounded-full p-3 w-fit mb-4">
                <ArchiveX className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle>Recurso Desativado</CardTitle>
            <CardDescription>A funcionalidade de "Manual de Devolução" foi desativada.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
                Este recurso não está mais disponível no sistema. Utilize as outras ferramentas disponíveis no menu.
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
      </main>
    </>
  );
}
