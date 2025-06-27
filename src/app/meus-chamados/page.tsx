import { Header } from "@/components/header";
import { MeusChamadosList } from "@/components/meus-chamados-list";
import { UserCheck } from "lucide-react";

export default function MeusChamadosPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30 dark:bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center gap-4 mb-8">
            <UserCheck className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight font-headline">Meus Chamados</h1>
        </div>
        <MeusChamadosList />
      </main>
    </div>
  );
}
