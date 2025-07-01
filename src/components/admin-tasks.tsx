
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import type { Task, TaskFormData } from "@/lib/definitions";
import { taskSchema } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ListChecks, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
      console.error("Failed to load tasks", error);
    }
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    const sortedTasks = updatedTasks.sort((a, b) => {
        if (a.status === b.status) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return a.status === 'Pendente' ? -1 : 1;
    });
    setTasks(sortedTasks);
    localStorage.setItem("adminTasks", JSON.stringify(sortedTasks));
  };

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = (data: TaskFormData) => {
    const newTask: Task = {
      id: new Date().getTime().toString(),
      title: data.title,
      status: "Pendente",
      createdAt: new Date().toISOString(),
    };

    saveTasks([...tasks, newTask]);
    toast({ title: "Tarefa adicionada com sucesso!" });
    form.reset();
  };
  
  const toggleStatus = (id: string) => {
    const updated = tasks.map(t => t.id === id ? {...t, status: t.status === "Pendente" ? "Concluída" : "Pendente"}: t);
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
    toast({ variant: "destructive", title: "Tarefa excluída." });
  }

  const clearCompleted = () => {
    const pendingTasks = tasks.filter(t => t.status === "Pendente");
    if (pendingTasks.length === tasks.length) {
        toast({ title: "Nenhuma tarefa concluída para limpar." });
        return;
    }
    saveTasks(pendingTasks);
    toast({ title: "Tarefas concluídas foram removidas." });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciador de Tarefas</CardTitle>
        <CardDescription>Adicione, gerencie e conclua suas tarefas diárias.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-start">
             <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input placeholder="Adicionar uma nova tarefa..." {...field} />
                    </FormControl>
                    <FormMessage className="mt-1" />
                  </FormItem>
                )}
              />
            <Button type="submit" disabled={form.formState.isSubmitting}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar
            </Button>
          </form>
        </Form>
         <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Tarefa</TableHead>
                        <TableHead className="hidden md:table-cell w-[150px]">Criada em</TableHead>
                        <TableHead className="text-right w-[120px]">
                            <Button variant="ghost" size="sm" onClick={clearCompleted} disabled={!tasks.some(t => t.status === 'Concluída')}>
                                <Trash2 className="mr-2 h-4 w-4" /> Limpar
                            </Button>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                   {tasks.length > 0 ? tasks.map(task => (
                     <TableRow key={task.id} className={cn(task.status === 'Concluída' && 'bg-muted/50')}>
                       <TableCell>
                          <Checkbox
                            checked={task.status === 'Concluída'}
                            onCheckedChange={() => toggleStatus(task.id)}
                            aria-label="Marcar como concluída"
                          />
                       </TableCell>
                       <TableCell className={cn("font-medium", task.status === 'Concluída' && 'line-through text-muted-foreground')}>
                            {task.title}
                       </TableCell>
                       <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                         {format(new Date(task.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                       </TableCell>
                       <TableCell className="text-right">
                            <Button size="icon" variant="ghost" onClick={() => deleteTask(task.id)} title="Excluir Tarefa">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                       </TableCell>
                     </TableRow>
                   )) : (
                     <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            <ListChecks className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            Nenhuma tarefa por aqui. Adicione uma acima!
                        </TableCell>
                    </TableRow>
                   )}
                </TableBody>
            </Table>
         </div>
      </CardContent>
    </Card>
  )
}
