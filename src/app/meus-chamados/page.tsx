import { Header } from "@/components/header";
import { UserCheck } from "lucide-react";

export default function MeusChamadosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center bg-background text-center p-4">
        <div className="p-4 bg-muted rounded-full mb-4">
          <UserCheck className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Meus Chamados</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Esta página está em construção.
        </p>
      </main>
    </div>
  );
}
