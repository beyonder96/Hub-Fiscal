
"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

import type { RejectedNote, RejectedNoteFormData, NfeData } from "@/lib/definitions";
import { rejectedNoteFormSchema } from "@/lib/definitions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Upload, FileText, CalendarIcon, PlusCircle, Trash2, Edit, Save, XCircle, DollarSign, Receipt, AlertTriangle } from "lucide-react";


const getTagValue = (element: Element | null, tagName: string): string | undefined => element?.querySelector(tagName)?.textContent || undefined;

const parseNfeDataFromXml = (xmlString: string): Partial<NfeData> => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");
  const ide = xmlDoc.querySelector('ide');
  const emit = xmlDoc.querySelector('emit');
  const icmsTot = xmlDoc.querySelector('ICMSTot');

  return {
    nNf: getTagValue(ide, 'nNF'),
    emitRazaoSocial: getTagValue(emit, 'xNome'),
    dhEmi: getTagValue(ide, 'dhEmi'),
    vNF: getTagValue(icmsTot, 'vNF'),
  };
};

export function AdminNotasRecusadas() {
  const [notes, setNotes] = useState<RejectedNote[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("rejectedNotes");
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load rejected notes", error);
    }
  }, []);

  const saveNotes = (updatedNotes: RejectedNote[]) => {
    setNotes(updatedNotes);
    localStorage.setItem("rejectedNotes", JSON.stringify(updatedNotes));
    window.dispatchEvent(new Event('storage'));
  };

  const form = useForm<RejectedNoteFormData>({
    resolver: zodResolver(rejectedNoteFormSchema),
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "dueDates",
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const xmlString = e.target?.result as string;
      const parsedData = parseNfeDataFromXml(xmlString);
      
      form.setValue("nfeNumber", parsedData.nNf || "");
      form.setValue("supplierName", parsedData.emitRazaoSocial || "");
      form.setValue("totalValue", parsedData.vNF || "");
      if (parsedData.dhEmi) {
        form.setValue("issueDate", parseISO(parsedData.dhEmi));
      }
      toast({ title: "XML carregado!", description: "Dados da nota preenchidos." });
    };
    reader.onerror = () => toast({ variant: "destructive", title: "Erro ao ler arquivo." });
    reader.readAsText(file);
  };

  const onSubmit = (data: RejectedNoteFormData) => {
    const noteToSave: RejectedNote = {
      id: editingNoteId || `note-${Date.now()}`,
      ...data,
      issueDate: data.issueDate.toISOString(),
      rejectionDate: data.rejectionDate.toISOString(),
      dueDates: data.dueDates.map(d => ({...d, date: d.date.toISOString()}))
    };

    const updatedNotes = editingNoteId
      ? notes.map(n => n.id === editingNoteId ? noteToSave : n)
      : [...notes, noteToSave];

    saveNotes(updatedNotes);
    toast({ title: `Nota ${editingNoteId ? 'atualizada' : 'adicionada'} com sucesso!` });
    setEditingNoteId(null);
    setIsFormVisible(false);
    form.reset();
  };
  
  const handleEdit = (note: RejectedNote) => {
      setEditingNoteId(note.id);
      form.reset({
          ...note,
          issueDate: parseISO(note.issueDate),
          rejectionDate: parseISO(note.rejectionDate),
          dueDates: note.dueDates.map(d => ({ ...d, date: parseISO(d.date) })),
      });
      setIsFormVisible(true);
  };

  const handleDelete = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
    toast({ variant: "destructive", title: "Nota recusada excluída." });
  };
  
  const handleAddNew = () => {
      setEditingNoteId(null);
      form.reset({ dueDates: [{ id: `due-${Date.now()}`, date: new Date(), value: '' }] });
      setIsFormVisible(true);
  }
  
  const handleCancel = () => {
      setEditingNoteId(null);
      setIsFormVisible(false);
      form.reset();
  }

  if (isFormVisible) {
      return (
        <Card>
            <CardHeader>
                <CardTitle>{editingNoteId ? 'Editar Nota Recusada' : 'Adicionar Nova Nota Recusada'}</CardTitle>
                <CardDescription>Preencha os dados da nota que foi recusada. Você pode carregar um XML para preencher alguns campos.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                            <FileText className="h-6 w-6 text-primary" />
                            <p className="flex-grow text-sm font-medium">Carregue um arquivo XML para preencher os dados automaticamente.</p>
                            <Button asChild variant="secondary">
                                <label>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Carregar XML
                                    <input type="file" accept=".xml,text/xml" className="sr-only" onChange={handleFileUpload} />
                                </label>
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField name="nfeNumber" control={form.control} render={({field}) => (<FormItem><FormLabel>Número da Nota</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                            <FormField name="supplierName" control={form.control} render={({field}) => (<FormItem><FormLabel>Nome do Fornecedor</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                            <FormField name="totalValue" control={form.control} render={({field}) => (<FormItem><FormLabel>Valor Total</FormLabel><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input className="pl-9" {...field} /></FormControl></div><FormMessage/></FormItem>)} />
                            <FormField name="issueDate" control={form.control} render={({field}) => (<FormItem className="flex flex-col"><FormLabel>Data de Emissão</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha a data</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage/></FormItem>)} />
                            <FormField name="rejectionDate" control={form.control} render={({field}) => (<FormItem className="flex flex-col"><FormLabel>Data da Recusa</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha a data</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage/></FormItem>)} />
                        </div>

                        <FormField name="rejectionReason" control={form.control} render={({field}) => (<FormItem><FormLabel>Motivo da Recusa</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage/></FormItem>)} />
                        
                        <div>
                            <Label>Vencimento das Faturas</Label>
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-2 mt-2">
                                    <FormField name={`dueDates.${index}.date`} control={form.control} render={({field: dateField}) => (<FormItem className="flex-1"><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal w-full", !dateField.value && "text-muted-foreground")}>{dateField.value ? format(dateField.value, "PPP", { locale: ptBR }) : <span>Data</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dateField.value} onSelect={dateField.onChange} /></PopoverContent></Popover><FormMessage/></FormItem>)} />
                                    <FormField name={`dueDates.${index}.value`} control={form.control} render={({field: valueField}) => (<FormItem className="flex-1"><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input className="pl-9" placeholder="Valor" {...valueField} /></FormControl></div><FormMessage/></FormItem>)} />
                                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            ))}
                             <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ id: `due-${Date.now()}`, date: new Date(), value: '' })}><PlusCircle className="mr-2 h-4 w-4" />Adicionar Vencimento</Button>
                        </div>
                        <FormMessage>{form.formState.errors.dueDates?.root?.message}</FormMessage>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="ghost" onClick={handleCancel}>Cancelar</Button>
                            <Button type="submit"><Save className="mr-2 h-4 w-4"/>Salvar Nota</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
      );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Gerenciar Notas Recusadas</CardTitle>
            <CardDescription>Adicione, edite ou remova notas fiscais recusadas.</CardDescription>
        </div>
        <Button onClick={handleAddNew}><PlusCircle className="mr-2"/>Adicionar Nota</Button>
      </CardHeader>
      <CardContent>
         <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nº Nota</TableHead>
                        <TableHead>Fornecedor</TableHead>
                        <TableHead>Emissão</TableHead>
                        <TableHead>Recusa</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                   {notes.length > 0 ? notes.map(note => (
                         <TableRow key={note.id}>
                           <TableCell className="font-medium">{note.nfeNumber}</TableCell>
                           <TableCell className="max-w-[200px] truncate">{note.supplierName}</TableCell>
                           <TableCell>{format(parseISO(note.issueDate), "dd/MM/yyyy")}</TableCell>
                           <TableCell>{format(parseISO(note.rejectionDate), "dd/MM/yyyy")}</TableCell>
                           <TableCell>{note.totalValue}</TableCell>
                           <TableCell className="text-right space-x-2">
                                <Button size="icon" variant="outline" onClick={() => handleEdit(note)} title="Editar Nota">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="destructive" onClick={() => handleDelete(note.id)} title="Excluir Nota">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                           </TableCell>
                         </TableRow>
                   )) : (
                     <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            <Receipt className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            Nenhuma nota recusada adicionada ainda.
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
