"use client";

import { useState, useEffect } from "react";
import type { Chamado } from "@/lib/definitions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, Inbox } from "lucide-react";

export function MeusChamadosList() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedChamados = localStorage.getItem("chamados");
      if (storedChamados) {
        setChamados(JSON.parse(storedChamados).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } catch (error) {
      console.error("Failed to parse chamados from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatusVariant = (status: Chamado["status"]) => {
    switch (status) {
      case "Aberto":
        return "default";
      case "Em Andamento":
        return "secondary";
      case "Resolvido":
        return "outline";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
        <div className="space-y-4">
            <Card><CardHeader><div className="h-6 w-1/2 bg-muted animate-pulse rounded-md" /></CardHeader><CardContent><div className="h-4 w-full bg-muted animate-pulse rounded-md" /></CardContent></Card>
            <Card><CardHeader><div className="h-6 w-1/2 bg-muted animate-pulse rounded-md" /></CardHeader><CardContent><div className="h-4 w-full bg-muted animate-pulse rounded-md" /></CardContent></Card>
        </div>
    )
  }

  if (chamados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 rounded-lg bg-card border border-dashed h-full">
        <div className="p-4 bg-muted rounded-full mb-4">
          <Inbox className="h-10 w-10 text-muted-foreground/70" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Nenhum chamado encontrado
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Você ainda não abriu nenhum chamado. Vá para a página de {" "}
          <a href="/chamados" className="text-primary hover:underline font-semibold">
            abrir chamado
          </a>
          {" "} para criar um.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {chamados.map((chamado) => (
        <Card key={chamado.id} className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl font-headline">{chamado.topic}</CardTitle>
              <Badge variant={getStatusVariant(chamado.status)}>{chamado.status}</Badge>
            </div>
            <CardDescription>
              Aberto por {chamado.name} em{" "}
              {format(new Date(chamado.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
            </CardDescription>
          </CardHeader>
          {chamado.description && (
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{chamado.description}</p>
            </CardContent>
          )}
          {chamado.fileName && (
              <CardFooter className="text-sm text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Anexo: {chamado.fileName}
              </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
