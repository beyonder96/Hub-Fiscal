import { Header } from "@/components/header";
import { Shield } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center bg-background text-center p-4">
        <div className="p-4 bg-muted rounded-full mb-4">
          <Shield className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Página de Admin</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Esta página está em construção.
        </p>
      </main>
    </div>
  );
}
