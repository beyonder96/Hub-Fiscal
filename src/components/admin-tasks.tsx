
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Task, TaskStatus, TaskFormData } from "@/lib/definitions";
import { taskSchema } from "@/lib/definitions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AdminStatCard } from "./admin-stat-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ListTodo, Loader, CheckCircle, AlertCircle, PlusCircle } from "lucide-react";
import { format } from "date-fns";

const statusTabMap: Record<string, TaskStatus> = {
  "A Fazer": "A Fazer",
  "Em Progresso": "Em Progresso",
  "Concluído": "Concluído",
};

const statusOrder: TaskStatus[] = ["A Fazer", "Em Progresso", "Concluído"];

function TaskBoard({ tasks, onUpdateStatus }: { tasks: Task[], onUpdateStatus: (id: string, status: TaskStatus) => void }) {
    const [activeTab, setActiveTab] = useState<string>("A Fazer");

    const filteredTasks = tasks.filter(t => t.status === statusTabMap[activeTab]);

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
                <TabsTrigger value="A Fazer">A Fazer</TabsTrigger>
                <TabsTrigger value="Em Progresso">Em Progresso</TabsTrigger>
                <TabsTrigger value="Concluído">Concluído</TabsTrigger>
            </TabsList>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tarefa</TableHead>
                            <TableHead className="hidden md:table-cell">Data Criação</TableHead>
                            <TableHead className="w-[180px]">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map(task => (
                                <TableRow key={task.id}>
                                    <TableCell>
                                        <div className="font-medium">{task.title}</div>
                                        {task.description && <div className="text-xs text-muted-foreground truncate max-w-xs">{task.description}</div>}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{format(new Date(task.createdAt), "dd/MM/yy HH:mm")}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={task.status}
                                            onValueChange={(newStatus: TaskStatus) => onUpdateStatus(task.id, newStatus)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOrder.map(status => (
                                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Nenhuma tarefa encontrada para esta visualização.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </Tabs>
    );
}

function AddTaskDialog({ onTaskAdd }: { onTaskAdd: (task: Task) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<TaskFormData>({
      resolver: zodResolver(taskSchema),
      defaultValues: { title: "", description: "" },
    });
  
    const onSubmit = (data: TaskFormData) => {
      const newTask: Task = {
        id: new Date().getTime().toString(),
        title: data.title,
        description: data.description,
        status: "A Fazer",
        createdAt: new Date().toISOString(),
      };
      onTaskAdd(newTask);
      setIsOpen(false);
      form.reset();
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2" /> Nova Tarefa
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Tarefa</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da nova tarefa a ser gerenciada.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl><Input placeholder="Ex: Entrar em contato com Cliente X" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (Opcional)</FormLabel>
                    <FormControl><Textarea placeholder="Adicione detalhes sobre a tarefa..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Criar Tarefa</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

export function AdminTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("adminTasks");
      if (stored) {
        setTasks(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem("adminTasks", JSON.stringify(updatedTasks));
  };
  
  const handleAddTask = (newTask: Task) => {
    const updatedTasks = [newTask, ...tasks];
    saveTasks(updatedTasks);
    toast({ title: "Tarefa adicionada!" });
  };

  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus) => {
    const updatedTasks = tasks.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    saveTasks(updatedTasks);
    toast({
      title: "Status da tarefa atualizado!",
      description: `A tarefa foi movida para "${newStatus}".`,
    });
  };

  const stats = {
    aFazer: tasks.filter(c => c.status === "A Fazer").length,
    emProgresso: tasks.filter(c => c.status === "Em Progresso").length,
    concluido: tasks.filter(c => c.status === "Concluído").length,
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row justify-between md:items-start gap-4">
        <div>
            <CardTitle>Gerenciador de Trabalhos</CardTitle>
            <CardDescription>
              Acompanhe e gerencie todos os trabalhos em um painel Kanban.
            </CardDescription>
        </div>
        <AddTaskDialog onTaskAdd={handleAddTask} />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
            <AdminStatCard title="A Fazer" value={stats.aFazer} description="Tarefas aguardando início." icon={AlertCircle} color="red" />
            <AdminStatCard title="Em Progresso" value={stats.emProgresso} description="Tarefas sendo trabalhadas." icon={Loader} color="yellow" />
            <AdminStatCard title="Concluído" value={stats.concluido} description="Tarefas finalizadas." icon={CheckCircle} color="green" />
        </div>
        <TaskBoard tasks={tasks} onUpdateStatus={handleUpdateStatus} />
      </CardContent>
    </Card>
  );
}
