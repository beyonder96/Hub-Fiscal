"use client";

import { useState } from "react";
import type { Chamado } from "@/lib/definitions";
import { Header } from "@/components/header";
import { MeusChamadosList } from "@/components/meus-chamados-list";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Search } from "lucide-react";

export default function MeusChamadosPage() {
  const [searchName, setSearchName] = useState("");
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [userChamados, setUserChamados] = useState<Chamado[]>([]);
  const [chamadoQueuePositions, setChamadoQueuePositions] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchName.trim()) return;

    setLoading(true);
    setNoResults(false);
    setUserChamados([]);
    setSubmittedName(searchName);

    // Simulate fetch from localStorage
    setTimeout(() => {
      try {
        const allChamados: Chamado[] = JSON.parse(localStorage.getItem("chamados") || "[]");

        const openChamados = allChamados
          .filter(c => c.status === "Aberto" || c.status === "Em Andamento")
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        const filteredChamados = allChamados
            .filter(c => c.name.trim().toLowerCase() === searchName.trim().toLowerCase())
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        if (filteredChamados.length > 0) {
          const positions: Record<string, number> = {};
          filteredChamados.forEach(chamado => {
            if (chamado.status !== "Resolvido") {
              const queueIndex = openChamados.findIndex(c => c.id === chamado.id);
              if (queueIndex !== -1) {
                positions[chamado.id] = queueIndex + 1;
              }
            }
          });
          setUserChamados(filteredChamados);
          setChamadoQueuePositions(positions);
        } else {
          setNoResults(true);
        }
      } catch (error) {
        console.error("Failed to process chamados", error);
        setNoResults(true);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleClear = () => {
    setSearchName("");
    setSubmittedName(null);
    setUserChamados([]);
    setChamadoQueuePositions({});
    setNoResults(false);
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 dark:bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {!submittedName ? (
          <>
            <div className="flex flex-col items-center text-center gap-4 mb-8">
                <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-xl">
                    <User className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight font-headline text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                  Meus Chamados
                </h1>
                <p className="max-w-md text-muted-foreground">
                  Digite seu nome para visualizar todos os seus chamados e acompanhar o status de cada solicitação.
                </p>
            </div>
            <Card className="max-w-xl mx-auto shadow-lg border">
              <CardContent className="p-6">
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="Digite seu nome completo"
                        className="pl-10 h-12 text-base"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-accent to-primary text-white font-bold" disabled={loading || !searchName.trim()}>
                      <Search className="mr-2 h-5 w-5" />
                      {loading ? "Buscando..." : "Buscar Meus Chamados"}
                    </Button>
                </form>
              </CardContent>
            </Card>
          </>
        ) : (
          <MeusChamadosList 
            chamados={userChamados}
            queuePositions={chamadoQueuePositions}
            isLoading={loading}
            noResults={noResults}
            userName={submittedName}
            onClearSearch={handleClear}
          />
        )}
      </main>
    </div>
  );
}
