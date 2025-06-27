"use client";

import type { Chamado } from "@/lib/definitions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, SearchX, RotateCw, ChevronsRight } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface MeusChamadosListProps {
  chamados: Chamado[];
  queuePositions: Record<string, number>;
  isLoading: boolean;
  noResults: boolean;
  userName: string;
  onClearSearch: () => void;
}

export function MeusChamadosList({ 
  chamados, 
  queuePositions, 
  isLoading,
  noResults,
  userName,
  onClearSearch 
}: MeusChamadosListProps) {

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

  if (isLoading) {
    return (
        <div className="space-y-4">
            <Card><CardHeader><Skeleton className="h-6 w-1/2 rounded-md" /></CardHeader><CardContent><Skeleton className="h-4 w-full rounded-md" /><Skeleton className="h-4 w-3/4 mt-2 rounded-md" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-1/2 rounded-md" /></CardHeader><CardContent><Skeleton className="h-4 w-full rounded-md" /><Skeleton className="h-4 w-3/4 mt-2 rounded-md" /></CardContent></Card>
        </div>
    )
  }
  
  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
            <p className="text-sm text-muted-foreground">Exibindo chamados para</p>
            <h1 className="text-3xl font-bold tracking-tight font-headline">{userName}</h1>
        </div>
        <Button variant="outline" onClick={onClearSearch}>
          <RotateCw className="h-4 w-4 mr-2" />
          Nova Busca
        </Button>
    </div>
  );


  if (noResults) {
    return (
      <>
        {renderHeader()}
        <div className="flex flex-col items-center justify-center text-center p-10 rounded-lg bg-card border border-dashed h-full">
            <div className="p-4 bg-muted rounded-full mb-4">
            <SearchX className="h-10 w-10 text-muted-foreground/70" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
            Nenhum chamado encontrado
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Não encontramos chamados para o nome informado. Tente novamente ou vá para a página de {" "}
            <a href="/chamados" className="text-primary hover:underline font-semibold">
                abrir chamado
            </a>
            {" "} para criar um.
            </p>
        </div>
      </>
    );
  }

  return (
    <>
      {renderHeader()}
      <div className="space-y-6">
        {chamados.map((chamado) => (
          <Card key={chamado.id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-xl font-headline">{chamado.topic}</CardTitle>
                <Badge variant={getStatusVariant(chamado.status)} className="flex-shrink-0">{chamado.status}</Badge>
              </div>
              <CardDescription>
                Aberto em{" "}
                {format(new Date(chamado.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chamado.description && (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4">{chamado.description}</p>
              )}
              {queuePositions[chamado.id] ? (
                <div className="flex items-center text-sm font-semibold p-3 rounded-md bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300">
                    <ChevronsRight className="h-5 w-5 mr-2" />
                    <span>Sua posição na fila de atendimento é: <span className="font-bold text-lg">{queuePositions[chamado.id]}ª</span></span>
                </div>
              ) : (
                chamado.status === "Resolvido" && (
                    <div className="flex items-center text-sm font-semibold p-3 rounded-md bg-green-100 dark:bg-green-500/10 text-green-800 dark:text-green-300">
                        <span>Este chamado já foi resolvido.</span>
                    </div>
                )
              )}
            </CardContent>
            {chamado.fileName && (
                <CardFooter className="text-sm text-muted-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Anexo: {chamado.fileName}
                </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}
