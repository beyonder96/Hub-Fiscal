
"use client";

import { useEffect, useState, useMemo } from "react";
import type { Chamado, ChamadoStatus } from "@/lib/definitions";
import { AdminStatCard } from "./admin-stat-card";
import { AdminChamadosManagement } from "./admin-chamados-management";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { TrendingUp, CheckCircle, Clock, AlertTriangle, BarChartHorizontal, Users, Trash2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AdminNotasFiscais } from "./admin-notas-fiscais";
import { AdminPrestadorLookup } from "./admin-prestador-lookup";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChangePasswordDialog } from "./change-password-dialog";


export function AdminDashboard() {
    const [chamados, setChamados] = useState<Chamado[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const refreshChamados = () => {
        try {
            const storedChamados = localStorage.getItem("chamados");
            if (storedChamados) {
                setChamados(JSON.parse(storedChamados));
            }
        } catch (error) {
            console.error("Failed to load chamados from localStorage", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        refreshChamados();
         window.addEventListener('storage', refreshChamados);
         return () => {
            window.removeEventListener('storage', refreshChamados);
        };
    }, []);

    const updateChamadoStatus = (chamadoId: string, newStatus: ChamadoStatus) => {
        const updatedChamados = chamados.map(c => 
            c.id === chamadoId ? { ...c, status: newStatus } : c
        );
        setChamados(updatedChamados);
        localStorage.setItem("chamados", JSON.stringify(updatedChamados));
    };

    const handleClearCompleted = () => {
        const completedCount = chamados.filter(c => c.status === "Resolvido").length;
        if (completedCount === 0) {
            toast({
                title: "Nenhum chamado concluído",
                description: "Não há chamados para limpar.",
            });
            return;
        }

        const remainingChamados = chamados.filter(c => c.status !== "Resolvido");
        setChamados(remainingChamados);
        localStorage.setItem("chamados", JSON.stringify(remainingChamados));
        toast({
            title: "Chamados concluídos limpos!",
            description: `${completedCount} chamado(s) foram removidos da lista.`,
        });
    };

    const stats = useMemo(() => {
        const total = chamados.length;
        const concluidos = chamados.filter(c => c.status === "Resolvido").length;
        const emProgresso = chamados.filter(c => c.status === "Em Andamento").length;
        const pendentes = chamados.filter(c => c.status === "Aberto").length;
        const taxaConclusao = total > 0 ? (concluidos / total) * 100 : 0;
        const taxaEmProgresso = total > 0 ? (emProgresso / total) * 100 : 0;

        const chamadosPorTitulo = chamados.reduce((acc, chamado) => {
            acc[chamado.title] = (acc[chamado.title] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return { total, concluidos, emProgresso, pendentes, taxaConclusao, taxaEmProgresso, chamadosPorTitulo };
    }, [chamados]);

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 md:p-8 space-y-8">
                <header>
                    <Skeleton className="h-9 w-1/3 rounded-md" />
                    <Skeleton className="h-4 w-1/2 mt-2 rounded-md" />
                </header>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-28 rounded-lg" />
                    <Skeleton className="h-28 rounded-lg" />
                    <Skeleton className="h-28 rounded-lg" />
                    <Skeleton className="h-28 rounded-lg" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Skeleton className="h-48 rounded-lg" />
                    <Skeleton className="h-48 rounded-lg" />
                </div>
                 <Skeleton className="h-96 rounded-lg" />
            </div>
        )
    }
    
    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <header className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Painel Administrativo</h1>
                    <p className="text-muted-foreground">Gerencie chamados fiscais e monitore o desempenho da equipe.</p>
                </div>
                <ChangePasswordDialog />
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <AdminStatCard title="Total de Chamados" value={stats.total} description="Chamados registrados" icon={TrendingUp} color="blue" />
                <AdminStatCard title="Concluídos" value={stats.concluidos} description={`${stats.taxaConclusao.toFixed(0)}% do total`} icon={CheckCircle} color="green" />
                <AdminStatCard title="Em Progresso" value={stats.emProgresso} description={`${stats.taxaEmProgresso.toFixed(0)}% do total`} icon={Clock} color="yellow" />
                <AdminStatCard title="Pendentes" value={stats.pendentes} description="Aguardando atendimento" icon={AlertTriangle} color="red" />
            </div>

            <div className="grid gap-4 md:grid-cols-5">
                <Card className="md:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><BarChartHorizontal className="h-5 w-5" />Progresso Geral</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Taxa de Conclusão</span>
                                <span className="font-semibold text-primary">{stats.taxaConclusao.toFixed(0)}%</span>
                            </div>
                            <Progress value={stats.taxaConclusao} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-primary" />
                        </div>
                        <div className="space-y-1">
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Em Progresso</span>
                                <span className="font-semibold text-yellow-500">{stats.taxaEmProgresso.toFixed(0)}%</span>
                            </div>
                            <Progress value={stats.taxaEmProgresso} className="h-2 [&>div]:bg-yellow-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><Users className="h-5 w-5" />Chamados por Título</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-2">
                        {Object.entries(stats.chamadosPorTitulo).length > 0 ? Object.entries(stats.chamadosPorTitulo).map(([title, count]) => (
                            <div key={title} className="flex items-center justify-between text-sm">
                                <span className="font-medium">{title}</span>
                                <div className="flex items-center gap-4">
                                    <Progress value={(count / (stats.total || 1)) * 100} className="w-24 h-2 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-primary" />
                                    <span className="font-bold w-4 text-right">{count}</span>
                                </div>
                            </div>
                        )) : <p className="text-sm text-muted-foreground text-center py-4">Nenhum chamado registrado.</p>}
                    </CardContent>
                </Card>
            </div>
            
             <Tabs defaultValue="chamados">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="chamados">Gerenciar Chamados</TabsTrigger>
                    <TabsTrigger value="notas">Acompanhar Boletos</TabsTrigger>
                    <TabsTrigger value="prestador">Consulta Prestador</TabsTrigger>
                </TabsList>
                <TabsContent value="chamados">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Gerenciamento de Chamados</CardTitle>
                                <CardDescription>Visualize e gerencie todos os chamados.</CardDescription>
                            </div>
                            <Button variant="outline" onClick={handleClearCompleted} disabled={stats.concluidos === 0}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Limpar Concluídos
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <AdminChamadosManagement 
                                chamados={chamados} 
                                onUpdateStatus={updateChamadoStatus} 
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="notas">
                    <AdminNotasFiscais />
                </TabsContent>
                <TabsContent value="prestador">
                     <AdminPrestadorLookup />
                </TabsContent>
            </Tabs>
        </div>
    );
}
