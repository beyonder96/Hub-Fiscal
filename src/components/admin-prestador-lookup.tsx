
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Prestador, PrestadorFormData, Notebook } from "@/lib/definitions";
import { prestadorSchema } from "@/lib/definitions";
import { initialPrestadores } from "@/lib/prestador-data";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Building, SearchX, PlusCircle, Pencil, Trash2, Link as LinkIcon, Briefcase, FileText, Landmark, Percent, CalendarDays, Key, MapPin, Mail, FileCheck2, User, Users, ShieldQuestion, Edit, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";

const InfoBox = ({ label, value, icon, className }: { label: string; value?: string; icon: React.ElementType; className?: string }) => {
  const Icon = icon;
  return (
    <div className={cn("flex items-start gap-3 rounded-lg bg-muted/50 p-3", className)}>
        <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
        <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-base font-medium text-foreground mt-1 break-words">{value || '---'}</p>
        </div>
    </div>
  )
};

const BooleanBadge = ({ label, value }: { label: string, value?: string }) => {
  if (!value) return null;
  const isYes = value === 'SIM';
  return (
    <Badge variant={isYes ? 'default' : 'secondary'} className="text-xs">
      {label}: {value}
    </Badge>
  )
};

export function PrestadorLookup() {
  const [query, setQuery] = useState("");
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [manuals, setManuals] = useState<Notebook[]>([]);
  const [selectedPrestador, setSelectedPrestador] = useState<Prestador | null>(null);
  const [searched, setSearched] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrestador, setEditingPrestador] = useState<Prestador | null>(null);
  const [manualPageId, setManualPageId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("prestadores");
      if (stored) {
        setPrestadores(JSON.parse(stored));
      } else {
        const fullInitialData = initialPrestadores.map((p, index) => ({
          ...p,
          id: p.fornecedor || `gen_${index}`,
          nomeBusca: p.nome.toLowerCase()
        }));
        setPrestadores(fullInitialData);
        localStorage.setItem("prestadores", JSON.stringify(fullInitialData));
      }

      const storedManuals = localStorage.getItem("manualsNotebooks");
      if (storedManuals) {
        setManuals(JSON.parse(storedManuals));
      }

    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  const savePrestadores = (updatedPrestadores: Prestador[]) => {
    setPrestadores(updatedPrestadores);
    localStorage.setItem("prestadores", JSON.stringify(updatedPrestadores));
  };

  const form = useForm<PrestadorFormData>({
    resolver: zodResolver(prestadorSchema),
    defaultValues: {
      empresa: 'MATRIZ',
      nome: '',
      fornecedor: '',
      descricao: '',
      servico: '',
      tes: '',
      conta: '',
      vencimento: '',
      municipio: '',
      nfts: 'NÃO',
      simplesNacional: 'NÃO',
      iss: 'NÃO',
      ir: 'NÃO',
      pcc: 'NÃO',
      inss: 'NÃO',
      codIr: '',
      codPcc: '',
      email: '',
      autenticidadeUrl: '',
    }
  });

  const findManualPageForPrestador = (prestadorName: string): string | null => {
    const normalizedName = prestadorName.toUpperCase();
    for (const notebook of manuals) {
      for (const page of notebook.pages) {
        if (page.title.toUpperCase() === normalizedName || page.title.toUpperCase() === 'VIVO' && normalizedName.includes('VIVO')) {
           return page.id;
        }
        if (page.title.toUpperCase() === 'ENEL SP' && normalizedName.includes('ENEL')) {
          return page.id;
        }
      }
    }
    return null;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) {
      setSelectedPrestador(null);
      setSearched(false);
      setManualPageId(null);
      return;
    }
    const lowerCaseQuery = query.toLowerCase();
    const found = prestadores.find(p => p.nome.toLowerCase().includes(lowerCaseQuery) || p.nomeBusca.toLowerCase().includes(lowerCaseQuery));
    setSelectedPrestador(found || null);
    setSearched(true);
    
    if (found) {
        const pageId = findManualPageForPrestador(found.nome);
        setManualPageId(pageId);
    } else {
        setManualPageId(null);
    }
  };
  
  const handleOpenForm = (prestador: Prestador | null) => {
    setEditingPrestador(prestador);
    if (prestador) {
      form.reset(prestador);
    } else {
      form.reset({
        empresa: 'MATRIZ',
        nome: '',
        fornecedor: '',
        descricao: '',
        servico: '',
        tes: '',
        conta: '',
        vencimento: '',
        municipio: '',
        nfts: 'NÃO',
        simplesNacional: 'NÃO',
        iss: 'NÃO',
        ir: 'NÃO',
        pcc: 'NÃO',
        inss: 'NÃO',
        codIr: '',
        codPcc: '',
        email: '',
        autenticidadeUrl: '',
      });
    }
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = prestadores.filter(p => p.id !== id);
    savePrestadores(updated);
    toast({ variant: 'destructive', title: 'Prestador excluído com sucesso!' });
    if (selectedPrestador?.id === id) {
      setSelectedPrestador(null);
    }
  };

  const onSubmit = (data: PrestadorFormData) => {
    let updatedPrestadores;
    const auditInfo = {
        lastModifiedBy: "Admin", // Placeholder for actual user logic
        lastModifiedAt: new Date().toISOString()
    };

    if (editingPrestador) {
      const updatedPrestador: Prestador = { ...editingPrestador, ...data, ...auditInfo };
      updatedPrestadores = prestadores.map(p => p.id === editingPrestador.id ? updatedPrestador : p);
      setSelectedPrestador(updatedPrestador);
      toast({ title: "Prestador atualizado com sucesso!" });
    } else {
      const newPrestador: Prestador = {
        ...data,
        id: data.fornecedor || `gen_${new Date().getTime()}`,
        nomeBusca: data.nome.toLowerCase(),
        ...auditInfo,
      };
      updatedPrestadores = [newPrestador, ...prestadores];
      toast({ title: "Prestador adicionado com sucesso!" });
    }
    savePrestadores(updatedPrestadores);
    setIsFormOpen(false);
    setEditingPrestador(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Cadastro de Prestadores</CardTitle>
            <CardDescription>
              Pesquise, adicione, edite ou exclua prestadores de serviço.
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenForm(null)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Prestador
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-grow">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Digite o nome da empresa para pesquisar..."
              className="pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" />
            Pesquisar
          </Button>
        </form>

        {searched && !selectedPrestador && (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <SearchX className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="font-semibold">Nenhum prestador encontrado</p>
            <p className="text-sm text-muted-foreground">Verifique o nome digitado e tente novamente.</p>
          </div>
        )}

        {selectedPrestador && (
          <Card className="border-primary/20 shadow-lg animate-in fade-in-50 duration-500">
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-2xl text-primary">{selectedPrestador.nome}</CardTitle>
                  <CardDescription>Fornecedor: {selectedPrestador.fornecedor}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleOpenForm(selectedPrestador)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá permanentemente o prestador
                          "{selectedPrestador.nome}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(selectedPrestador.id)}>
                          Sim, excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoBox label="Empresa" value={selectedPrestador.empresa} icon={Briefcase} />
                  <InfoBox label="Descrição do Serviço" value={selectedPrestador.descricao} icon={FileText} className="md:col-span-2" />
                  <InfoBox label="Produto/Serviço" value={selectedPrestador.servico} icon={Key} />
                  <InfoBox label="TES" value={selectedPrestador.tes} icon={Key} />
                  <InfoBox label="Conta" value={selectedPrestador.conta} icon={Landmark} />
                  <InfoBox label="Vencimento" value={selectedPrestador.vencimento} icon={CalendarDays} />
                  <InfoBox label="Município" value={selectedPrestador.municipio} icon={MapPin} />
                  <InfoBox label="Email" value={selectedPrestador.email} icon={Mail} />
                  <div className="flex items-center gap-2 md:col-span-3">
                    <BooleanBadge label="NFTS" value={selectedPrestador.nfts} />
                    <BooleanBadge label="Simples Nacional" value={selectedPrestador.simplesNacional} />
                  </div>
              </div>
              <div>
                  <h4 className="font-semibold mb-2 text-primary flex items-center gap-2"><Percent className="h-4 w-4"/>Retenções</h4>
                  <div className="p-4 rounded-lg bg-muted/50 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <Label>ISS</Label>
                      <p className="font-mono font-semibold">{selectedPrestador.iss || 'NÃO'}</p>
                    </div>
                     <div className="space-y-1">
                      <Label>IR</Label>
                      <p className="font-mono font-semibold">{selectedPrestador.ir || 'NÃO'}</p>
                    </div>
                     <div className="space-y-1">
                      <Label>PCC</Label>
                      <p className="font-mono font-semibold">{selectedPrestador.pcc || 'NÃO'}</p>
                    </div>
                     <div className="space-y-1">
                      <Label>INSS</Label>
                      <p className="font-mono font-semibold">{selectedPrestador.inss || 'NÃO'}</p>
                    </div>
                    <div className="space-y-1">
                      <Label>Cód. IR</Label>
                      <p className="font-mono font-semibold">{selectedPrestador.codIr || '---'}</p>
                    </div>
                     <div className="space-y-1">
                      <Label>Cód. PCC</Label>
                      <p className="font-mono font-semibold">{selectedPrestador.codPcc || '---'}</p>
                    </div>
                  </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {selectedPrestador.autenticidadeUrl && selectedPrestador.autenticidadeUrl !== '-' && (
                   <Button asChild variant="outline" className="w-full">
                    <a href={selectedPrestador.autenticidadeUrl} target="_blank" rel="noopener noreferrer">
                      <LinkIcon className="mr-2 h-4 w-4"/>
                      Verificar Autenticidade
                    </a>
                   </Button>
                )}
                {selectedPrestador.nfts === 'SIM' && (
                  <Button asChild className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                    <a href="https://nfe.prefeitura.sp.gov.br/login.aspx" target="_blank" rel="noopener noreferrer">
                      <FileCheck2 className="mr-2 h-4 w-4" />
                      Emitir NFTS
                    </a>
                  </Button>
                )}
                {manualPageId && (
                    <Button asChild variant="secondary" className="w-full">
                        <Link href={`/manuais/page/${manualPageId}`}>
                            <HelpCircle className="mr-2 h-4 w-4" />
                            Saiba como fazer
                        </Link>
                    </Button>
                )}
              </div>
               {selectedPrestador.lastModifiedAt && (
                <div className="mt-4 text-xs text-muted-foreground text-center border-t pt-4">
                  Última alteração por <span className="font-semibold">{selectedPrestador.lastModifiedBy || 'N/A'}</span> em {format(new Date(selectedPrestador.lastModifiedAt), "dd/MM/yyyy 'às' HH:mm")}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingPrestador ? "Editar Prestador" : "Adicionar Novo Prestador"}</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo com os dados do prestador de serviço.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ScrollArea className="h-[60vh] p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="empresa" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Empresa</FormLabel>
                        <FormControl><Input {...field} /></FormControl><FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="nome" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Nome</FormLabel>
                        <FormControl><Input {...field} /></FormControl><FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="descricao" render={({ field }) => (
                      <FormItem><FormLabel>Descrição</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <FormField control={form.control} name="fornecedor" render={({ field }) => (<FormItem><FormLabel>Fornecedor</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="servico" render={({ field }) => (<FormItem><FormLabel>Serviço</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="tes" render={({ field }) => (<FormItem><FormLabel>TES</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="conta" render={({ field }) => (<FormItem><FormLabel>Conta</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="vencimento" render={({ field }) => (<FormItem><FormLabel>Vencimento</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="municipio" render={({ field }) => (<FormItem><FormLabel>Município</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Impostos e Retenções</h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <FormField control={form.control} name="nfts" render={({ field }) => (<FormItem><FormLabel>NFTS</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="SIM">SIM</SelectItem><SelectItem value="NÃO">NÃO</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="simplesNacional" render={({ field }) => (<FormItem><FormLabel>Simples Nacional</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="SIM">SIM</SelectItem><SelectItem value="NÃO">NÃO</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="iss" render={({ field }) => (<FormItem><FormLabel>ISS</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="SIM">SIM</SelectItem><SelectItem value="NÃO">NÃO</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="ir" render={({ field }) => (<FormItem><FormLabel>IR</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="SIM">SIM</SelectItem><SelectItem value="NÃO">NÃO</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="pcc" render={({ field }) => (<FormItem><FormLabel>PCC</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="SIM">SIM</SelectItem><SelectItem value="NÃO">NÃO</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="inss" render={({ field }) => (<FormItem><FormLabel>INSS</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="SIM">SIM</SelectItem><SelectItem value="NÃO">NÃO</SelectItem><SelectItem value="PORTO">PORTO</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="codIr" render={({ field }) => (<FormItem><FormLabel>Cód. IR</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="codPcc" render={({ field }) => (<FormItem><FormLabel>Cód. PCC</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="autenticidadeUrl" render={({ field }) => (<FormItem><FormLabel>URL de Autenticidade</FormLabel><FormControl><Input type="url" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter className="pt-4 border-t mt-4">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
