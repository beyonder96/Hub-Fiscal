
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import type { NotaFiscal, NotaFiscalFormData } from "@/lib/definitions";
import { notaFiscalSchema } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format, isPast, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BellRing, Calendar as CalendarIcon, Check, FilePlus, Receipt, Trash2 } from "lucide-react";

export function AdminNotasFiscais() {
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("notasFiscais");
      if (stored) {
        setNotas(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load notas fiscais", error);
    }
  }, []);

  const saveNotas = (updatedNotas: NotaFiscal[]) => {
    setNotas(updatedNotas);
    localStorage.setItem("notasFiscais", JSON.stringify(updatedNotas));
    window.dispatchEvent(new Event('storage')); // Notify other components of change
  };

  const form = useForm<NotaFiscalFormData>({
    resolver: zodResolver(notaFiscalSchema),
    defaultValues: {
      number: "",
      notes: "",
    },
  });

  const onSubmit = (data: NotaFiscalFormData) => {
    const newNota: NotaFiscal = {
      id: new Date().getTime().toString(),
      number: data.number,
      issueDate: data.issueDate.toISOString(),
      notes: data.notes,
      reminderDate: data.reminderDate?.toISOString(),
      status: "Pendente",
    };

    const updatedNotas = [...notas, newNota];
    saveNotas(updatedNotas);

    toast({ title: "Nota Fiscal adicionada com sucesso!" });
    setIsDialogOpen(false);
    form.reset();
  };
  
  const toggleStatus = (id: string) => {
    const updated = notas.map(n => n.id === id ? {...n, status: n.status === "Pendente" ? "Concluída" : "Pendente"}: n);
    saveNotas(updated);
  };

  const deleteNota = (id: string) => {
    saveNotas(notas.filter(n => n.id !== id));
    toast({ variant: "destructive", title: "Nota Fiscal excluída." });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Acompanhamento de Notas Fiscais</CardTitle>
            <CardDescription>Adicione e gerencie notas fiscais e seus lembretes.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><FilePlus className="mr-2"/>Adicionar Nota</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Nota Fiscal</DialogTitle>
              <DialogDescription>Preencha os dados da nota para acompanhamento.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormField control={form.control} name="number" render={({ field }) => (
                     <FormItem>
                         <FormLabel>Número da Nota</FormLabel>
                         <FormControl><Input placeholder="Ex: 123456" {...field} /></FormControl>
                         <FormMessage />
                     </FormItem>
                 )} />
                 <FormField control={form.control} name="issueDate" render={({ field }) => (
                     <FormItem className="flex flex-col">
                         <FormLabel>Data de Emissão</FormLabel>
                         <Popover>
                             <PopoverTrigger asChild>
                                 <FormControl>
                                     <Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                         {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                                         <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                     </Button>
                                 </FormControl>
                             </PopoverTrigger>
                             <PopoverContent className="w-auto p-0" align="start">
                                 <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                             </PopoverContent>
                         </Popover>
                         <FormMessage />
                     </FormItem>
                 )} />
                  <FormField control={form.control} name="reminderDate" render={({ field }) => (
                     <FormItem className="flex flex-col">
                         <FormLabel>Data do Lembrete (Opcional)</FormLabel>
                         <Popover>
                             <PopoverTrigger asChild>
                                 <FormControl>
                                     <Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                         {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                                         <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                     </Button>
                                 </FormControl>
                             </PopoverTrigger>
                             <PopoverContent className="w-auto p-0" align="start">
                                 <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                             </PopoverContent>
                         </Popover>
                         <FormMessage />
                     </FormItem>
                 )} />
                 <FormField control={form.control} name="notes" render={({ field }) => (
                     <FormItem>
                         <FormLabel>Anotações (Opcional)</FormLabel>
                         <FormControl><Textarea placeholder="Detalhes importantes, pendências, etc." {...field} /></FormControl>
                         <FormMessage />
                     </FormItem>
                 )} />
                 <DialogFooter>
                     <Button type="submit">Salvar</Button>
                 </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
         <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Emissão</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Lembrete</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                   {notas.length > 0 ? notas.map(nota => {
                       const reminderDate = nota.reminderDate ? parseISO(nota.reminderDate) : null;
                       const isReminderPast = reminderDate ? isPast(reminderDate) && nota.status === 'Pendente' : false;
                       return (
                         <TableRow key={nota.id} className={cn(isReminderPast && "bg-red-500/10")}>
                           <TableCell className="font-medium">{nota.number}</TableCell>
                           <TableCell>{format(parseISO(nota.issueDate), "dd/MM/yyyy")}</TableCell>
                           <TableCell>
                             <Badge variant={nota.status === 'Concluída' ? 'outline' : 'default'}>{nota.status}</Badge>
                           </TableCell>
                           <TableCell>
                             {reminderDate ? (
                                <div className={cn("flex items-center gap-2", isReminderPast && "font-bold text-destructive")}>
                                   <BellRing className="h-4 w-4" />
                                   {format(reminderDate, "dd/MM/yyyy")}
                                </div>
                             ) : '-'}
                           </TableCell>
                           <TableCell className="text-right space-x-2">
                                <Button size="icon" variant="outline" onClick={() => toggleStatus(nota.id)} title={nota.status === 'Pendente' ? 'Marcar como Concluída' : 'Marcar como Pendente'}>
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="destructive" onClick={() => deleteNota(nota.id)} title="Excluir Nota">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                           </TableCell>
                         </TableRow>
                       )
                   }) : (
                     <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            <Receipt className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            Nenhuma nota fiscal adicionada ainda.
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
