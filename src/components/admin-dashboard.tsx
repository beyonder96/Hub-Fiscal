
"use client";

import { ChangePasswordDialog } from "./change-password-dialog";
import { AdminTasks } from "./admin-tasks";
import { AdminAliquotas } from "./admin-aliquotas";
import { AdminNotasFiscais } from "./admin-notas-fiscais";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BookOpen } from "lucide-react";


export function AdminDashboard() {
    
    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <header className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Painel Administrativo</h1>
                    <p className="text-muted-foreground">Gerencie as ferramentas administrativas do sistema.</p>
                </div>
                <ChangePasswordDialog />
            </header>
            
             <Tabs defaultValue="tarefas" className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="tarefas">Tarefas</TabsTrigger>
                    <TabsTrigger value="notas">Acompanhar Boletos</TabsTrigger>
                    <TabsTrigger value="aliquotas">Alíquotas</TabsTrigger>
                    <TabsTrigger value="manuais">Manuais</TabsTrigger>
                </TabsList>
                 <TabsContent value="tarefas">
                     <AdminTasks />
                </TabsContent>
                <TabsContent value="notas">
                    <AdminNotasFiscais />
                </TabsContent>
                <TabsContent value="aliquotas">
                    <AdminAliquotas />
                </TabsContent>
                <TabsContent value="manuais">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manuais e Documentação</CardTitle>
                            <CardDescription>Esta área será desenvolvida em breve.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center text-center p-10">
                            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Em breve, você encontrará manuais e guias aqui.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
