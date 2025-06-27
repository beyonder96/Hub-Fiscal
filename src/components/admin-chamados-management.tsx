
"use client";

import { useState, useMemo } from 'react';
import type { Chamado, ChamadoStatus } from '@/lib/definitions';
import { ChamadoTopics } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { format } from "date-fns";

interface AdminChamadosManagementProps {
    chamados: Chamado[];
    onUpdateStatus: (chamadoId: string, newStatus: ChamadoStatus) => void;
}

const statusTabMap: Record<string, ChamadoStatus> = {
    "A Fazer": "Aberto",
    "Em Progresso": "Em Andamento",
    "Concluído": "Resolvido",
};

const statusDisplayMap: Record<ChamadoStatus, string> = {
    "Aberto": "Aberto",
    "Em Andamento": "Em Andamento",
    "Resolvido": "Resolvido",
}

const statusOrder: ChamadoStatus[] = ["Aberto", "Em Andamento", "Resolvido"];

export function AdminChamadosManagement({ chamados, onUpdateStatus }: AdminChamadosManagementProps) {
    const [activeTab, setActiveTab] = useState<string>("A Fazer");
    const [topicFilter, setTopicFilter] = useState<string>("all");

    const filteredChamados = useMemo(() => {
        const statusToFilter = statusTabMap[activeTab];
        return chamados
            .filter(c => c.status === statusToFilter)
            .filter(c => topicFilter === 'all' || c.topic === topicFilter)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }, [chamados, activeTab, topicFilter]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gerenciamento de Chamados</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <TabsList>
                            <TabsTrigger value="A Fazer">A Fazer</TabsTrigger>
                            <TabsTrigger value="Em Progresso">Em Progresso</TabsTrigger>
                            <TabsTrigger value="Concluído">Concluído</TabsTrigger>
                        </TabsList>
                        <Select value={topicFilter} onValueChange={setTopicFilter}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Todos os tópicos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os tópicos</SelectItem>
                                {ChamadoTopics.map(topic => (
                                    <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Tópico</TableHead>
                                    <TableHead className="hidden md:table-cell">Data</TableHead>
                                    <TableHead className="w-[180px]">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredChamados.length > 0 ? (
                                    filteredChamados.map(chamado => (
                                        <TableRow key={chamado.id}>
                                            <TableCell>
                                                <div className="font-medium">{chamado.name}</div>
                                                <div className="text-xs text-muted-foreground truncate max-w-xs">{chamado.description}</div>
                                            </TableCell>
                                            <TableCell><Badge variant="outline">{chamado.topic}</Badge></TableCell>
                                            <TableCell className="hidden md:table-cell">{format(new Date(chamado.createdAt), "dd/MM/yy HH:mm")}</TableCell>
                                            <TableCell>
                                                <Select
                                                    value={chamado.status}
                                                    onValueChange={(newStatus: ChamadoStatus) => onUpdateStatus(chamado.id, newStatus)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {statusOrder.map(status => (
                                                            <SelectItem key={status} value={status}>{statusDisplayMap[status]}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            Nenhum chamado encontrado para esta visualização.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
}
