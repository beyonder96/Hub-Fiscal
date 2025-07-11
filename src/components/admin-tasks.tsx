
"use client";

import { useState, useEffect } from "react";
import type { Chamado, ChamadoStatus } from "@/lib/definitions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AdminChamadosManagement } from "@/components/admin-chamados-management";
import { AdminStatCard } from "./admin-stat-card";
import { ListTodo, Loader, CheckCircle, AlertCircle } from "lucide-react";

export function AdminTasks() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadChamados = () => {
    setIsLoading(true);
    try {
      const storedChamados = localStorage.getItem("chamados");
      if (storedChamados) {
        setChamados(JSON.parse(storedChamados));
      }
    } catch (error) {
      console.error("Failed to load chamados:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar chamados",
        description: "Não foi possível carregar os dados dos chamados.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChamados();
    // Listen for changes from other tabs
    window.addEventListener("storage", loadChamados);
    return () => {
      window.removeEventListener("storage", loadChamados);
    };
  }, []);

  const handleUpdateStatus = (chamadoId: string, newStatus: ChamadoStatus) => {
    const updatedChamados = chamados.map(c =>
      c.id === chamadoId ? { ...c, status: newStatus } : c
    );
    setChamados(updatedChamados);
    localStorage.setItem("chamados", JSON.stringify(updatedChamados));
    toast({
      title: "Status do chamado atualizado!",
      description: `O chamado foi movido para "${newStatus}".`,
    });
  };

  const stats = {
    aberto: chamados.filter(c => c.status === "Aberto").length,
    emAndamento: chamados.filter(c => c.status === "Em Andamento").length,
    resolvido: chamados.filter(c => c.status === "Resolvido").length,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciador de Trabalhos</CardTitle>
        <CardDescription>
          Acompanhe e gerencie todos os chamados em um painel Kanban.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
            <AdminStatCard title="Abertos" value={stats.aberto} description="Chamados aguardando início." icon={AlertCircle} color="red" />
            <AdminStatCard title="Em Andamento" value={stats.emAndamento} description="Chamados sendo trabalhados." icon={Loader} color="yellow" />
            <AdminStatCard title="Resolvidos" value={stats.resolvido} description="Chamados finalizados." icon={CheckCircle} color="green" />
        </div>
        <AdminChamadosManagement chamados={chamados} onUpdateStatus={handleUpdateStatus} />
      </CardContent>
    </Card>
  );
}
