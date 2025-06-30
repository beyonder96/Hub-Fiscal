import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Undo2 } from "lucide-react";

export default function DevolucaoPage() {
  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center text-center gap-4 mb-8">
            <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-xl">
                <Undo2 className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight font-headline text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
              Como Fazer Devolução
            </h1>
            <p className="max-w-md text-muted-foreground">
              Esta página está em construção. Volte em breve para guias detalhados sobre processos de devolução.
            </p>
        </div>
        <Card className="max-w-xl mx-auto shadow-lg border">
          <CardHeader>
            <CardTitle>Em Breve</CardTitle>
            <CardDescription>
              Estamos preparando um conteúdo completo para te ajudar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Agradecemos sua paciência!
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
