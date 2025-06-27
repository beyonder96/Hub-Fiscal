import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function PesquisaTesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30 dark:bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center text-center gap-4 mb-8">
            <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-xl">
                <Search className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight font-headline text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
              Pesquisa de TES
            </h1>
            <p className="max-w-md text-muted-foreground">
              Esta funcionalidade está em desenvolvimento e estará disponível em breve.
            </p>
        </div>
        <Card className="max-w-xl mx-auto shadow-lg border">
          <CardHeader>
            <CardTitle>Página em Construção</CardTitle>
            <CardDescription>
              Estamos trabalhando para trazer a melhor ferramenta de pesquisa de TES para você.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Agradecemos a sua compreensão.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
