
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IcmsStFormData } from "@/lib/definitions";
import { icmsStSchema } from "@/lib/definitions";
import jsPDF from "jspdf";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, RotateCw, Info, Percent, DollarSign, Wand2, FileDown, Briefcase, Building, FileText, Search, Clipboard, ArrowRight, PlusCircle, Pencil } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { dareSupplierData } from "@/lib/dare-data";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatPercent = (value: string | undefined): string => {
    if (!value) return "0%";
    const num = parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
    // Don't show decimals if it's an integer
    if (num % 1 === 0) {
        return `${num}%`;
    }
    return `${num.toFixed(2)}%`;
}

interface CalculationResult {
  baseSt: number;
  valorSt: number;
  valorTotalNota: number;
  basePisCofins: number;
  valorIcmsProprio: number;
  valorIpi: number;
}

interface CompletedCalculation {
  formData: IcmsStFormData;
  result: CalculationResult;
}

const ResultCard = ({ title, value, isPrimary = false }: { title: string, value: string | number, isPrimary?: boolean }) => (
  <Card className={isPrimary ? "bg-primary/10 border-primary/20 shadow-lg" : "shadow-md"}>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">{typeof value === 'number' ? formatCurrency(value) : value}</p>
    </CardContent>
  </Card>
);

const DareHelper = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (query.trim().length > 2) {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = dareSupplierData.filter(line => line.toLowerCase().includes(lowerCaseQuery));
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", description: "Dados do fornecedor copiados para a área de transferência." });
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-headline">
          <Search className="h-6 w-6 text-primary" />
          Consulta de Fornecedor para DARE
        </CardTitle>
         <CardDescription>
            Pesquise pelo nome, CNPJ ou IE para encontrar os dados completos do fornecedor.
          </CardDescription>
      </CardHeader>
      <CardContent>
        <Input 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
          placeholder="Digite parte do nome, CNPJ ou IE do fornecedor..." 
        />
        <ScrollArea className="h-48 mt-4 border rounded-md">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((line, i) => (
                <div key={i} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                  <span className="text-sm font-mono">{line}</span>
                  <Button size="icon" variant="ghost" onClick={() => handleCopy(line)} title="Copiar">
                    <Clipboard className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
             <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              <p>Nenhum resultado. Digite ao menos 3 caracteres.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default function CalculoIcmsSt() {
  const [step, setStep] = useState<'setup' | 'calculating' | 'results'>('setup');
  const [numberOfCalculations, setNumberOfCalculations] = useState(1);
  const [currentCalculationIndex, setCurrentCalculationIndex] = useState(0);
  const [completedCalculations, setCompletedCalculations] = useState<CompletedCalculation[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const [ivaOriginal, setIvaOriginal] = useState("");
  const [aliqInter, setAliqInter] = useState("");
  const [aliqInterna, setAliqInterna] = useState("");
  const [ivaAjustado, setIvaAjustado] = useState<number | null>(null);

  const { toast } = useToast();
  
  const form = useForm<IcmsStFormData>({
    resolver: zodResolver(icmsStSchema),
    defaultValues: {
      items: "",
      operationType: "compra",
      ncm: "",
      fornecedor: "",
      valorMercadoria: "",
      valorFrete: "",
      aliqIpi: "",
      valorIpi: "",
      aliqIcms: "",
      mva: "",
      aliqIcmsSt: "",
      redBaseSt: "",
    },
  });
  
  const operationType = form.watch("operationType");
  const parseLocaleString = (value: string) => parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;

  const handleStart = () => {
    if (numberOfCalculations > 0) {
      setStep('calculating');
      setCurrentCalculationIndex(0);
      setCompletedCalculations([]);
      form.reset();
    }
  };

  const handleNewFullCalculation = () => {
    setStep('setup');
    setNumberOfCalculations(1);
    setCompletedCalculations([]);
    setIvaAjustado(null);
    form.reset();
  };

  const onSubmit = (data: IcmsStFormData) => {
    let valorMercadoria = 0;
    let valorIpi = 0;
    const valorFrete = parseLocaleString(data.valorFrete || "0");
    const aliqIcms = parseLocaleString(data.aliqIcms);
    const mva = parseLocaleString(data.mva);
    const aliqIcmsSt = parseLocaleString(data.aliqIcmsSt);
    const redBaseSt = parseLocaleString(data.redBaseSt || "0");

    if (data.operationType === 'pecas') {
      const aliqIpi = parseLocaleString(data.aliqIpi || "0");
      const valorTotalComIpi = parseLocaleString(data.valorMercadoria);
      valorMercadoria = parseFloat((valorTotalComIpi / (1 + (aliqIpi / 100))).toFixed(2));
      valorIpi = parseFloat((valorTotalComIpi - valorMercadoria).toFixed(2));
    } else if (data.operationType === 'compra') {
      valorMercadoria = parseLocaleString(data.valorMercadoria);
      valorIpi = parseLocaleString(data.valorIpi || "0");
    } else { // 'transferencia'
      valorMercadoria = parseLocaleString(data.valorMercadoria);
      valorIpi = 0; // IPI not applicable for transfers
    }

    const baseIcmsProprio = valorMercadoria + valorFrete;
    const valorIcmsProprio = parseFloat((baseIcmsProprio * (aliqIcms / 100)).toFixed(2));
    
    const baseStSemReducao = (valorMercadoria + valorFrete + valorIpi) * (1 + mva / 100);
    const baseSt = parseFloat((baseStSemReducao * (1 - redBaseSt / 100)).toFixed(2));
    
    const valorStBruto = (baseSt * (aliqIcmsSt / 100)) - valorIcmsProprio;
    const valorSt = valorStBruto > 0 ? parseFloat(valorStBruto.toFixed(2)) : 0;

    let valorTotalNota;
    if (data.operationType === 'pecas') {
      valorTotalNota = parseLocaleString(data.valorMercadoria) + valorFrete + valorSt;
    } else {
      valorTotalNota = valorMercadoria + valorFrete + valorIpi + valorSt;
    }
    
    const basePisCofins = data.operationType === 'compra'
        ? baseIcmsProprio - valorIcmsProprio
        : 0;

    const result: CalculationResult = {
      baseSt,
      valorSt,
      valorTotalNota,
      basePisCofins,
      valorIcmsProprio,
      valorIpi
    };

    const completedCalc: CompletedCalculation = { formData: data, result };

    if (editingIndex !== null) {
        const updatedCalculations = completedCalculations.map((calc, index) => 
            index === editingIndex ? completedCalc : calc
        );
        setCompletedCalculations(updatedCalculations);
        setEditingIndex(null);
        setStep('results');
        toast({ title: `Cálculo ${editingIndex + 1} atualizado!` });
        form.reset();
    } else {
        const updatedCalculations = [...completedCalculations, completedCalc];
        setCompletedCalculations(updatedCalculations);

        if (currentCalculationIndex < numberOfCalculations - 1) {
            setCurrentCalculationIndex(prev => prev + 1);
            toast({
                title: `Cálculo ${currentCalculationIndex + 1} salvo!`,
                description: `Preencha os dados para o cálculo ${currentCalculationIndex + 2}.`
            });
            form.reset({
                ...data,
                items: "",
                valorMercadoria: "",
                valorFrete: "",
                valorIpi: ""
            });
        } else {
            setStep('results');
        }
    }
  };
  
  const handleExportToPdf = () => {
    if (completedCalculations.length === 0) return;

    const doc = new jsPDF();
    let y = 15;
    const pageHeight = doc.internal.pageSize.height;
    const bottomMargin = 20;

    const checkNewPage = (heightNeeded: number) => {
      if (y + heightNeeded > pageHeight - bottomMargin) {
        doc.addPage();
        y = 15;
      }
    };
    
    const printSectionHeader = (title: string) => {
      checkNewPage(12);
      y += 5;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 14, y);
      y += 8;
    }
    
    const drawTable = (headers: string[], rows: (string | number)[][], colWidths: number[]) => {
      checkNewPage(15);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');

      let x = 15;
      headers.forEach((header, i) => {
        doc.text(header, x, y);
        x += colWidths[i];
      });

      y += 2;
      doc.line(14, y, 196, y); // Horizontal line
      y += 5;
      doc.setFont('helvetica', 'normal');

      rows.forEach(row => {
        checkNewPage(8);
        x = 15;
        row.forEach((cell, i) => {
          doc.text(String(cell), x, y);
          x += colWidths[i];
        });
        y += 7;
      });
      y += 3;
    }
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text("Relatório Consolidado de Cálculo ICMS-ST", 105, y, { align: 'center' });
    y += 10;
    
    completedCalculations.forEach((calc, index) => {
      printSectionHeader(`Cálculo ${index + 1} de ${completedCalculations.length}`);
      
      if (calc.formData.items) {
          doc.setFontSize(10);
          checkNewPage(12);
          doc.setFont('helvetica', 'bold');
          doc.text(`Itens Aplicados:`, 15, y);
          doc.setFont('helvetica', 'normal');
          doc.text(calc.formData.items, 45, y);
          y += 10;
      }

      const inputData = [
          ["Tipo Operação", calc.formData.operationType],
          ["Fornecedor", calc.formData.fornecedor || "N/A"],
          ["NCM", calc.formData.ncm || "N/A"],
          ...(calc.formData.operationType === 'pecas' ? [
            ["Valor Total c/ IPI", formatCurrency(parseLocaleString(calc.formData.valorMercadoria))]
          ] : [
            ["Valor Mercadoria", formatCurrency(parseLocaleString(calc.formData.valorMercadoria))]
          ]),
          ["Valor Frete", formatCurrency(parseLocaleString(calc.formData.valorFrete || "0"))],
          ...(calc.formData.operationType === 'compra' ? [["Valor IPI", formatCurrency(parseLocaleString(calc.formData.valorIpi || '0'))]] : []),
          ...(calc.formData.operationType === 'pecas' ? [["Alíquota IPI", formatPercent(calc.formData.aliqIpi)]] : []),
          ["Alíquota ICMS", formatPercent(calc.formData.aliqIcms)],
          ["IVA/MVA", formatPercent(calc.formData.mva)],
          ["Alíquota ICMS-ST", formatPercent(calc.formData.aliqIcmsSt)],
      ];
      drawTable(['Parâmetro', 'Valor'], inputData.map(row => [row[0], row[1].toString()]), [80, 80]);

      const resultData = [
          ["Base PIS/COFINS", formatCurrency(calc.result.basePisCofins)],
          ["Valor ICMS Próprio", formatCurrency(calc.result.valorIcmsProprio)],
          ["Valor IPI", formatCurrency(calc.result.valorIpi)],
          ["Base de Cálculo ST", formatCurrency(calc.result.baseSt)],
          ["Valor do ICMS-ST", formatCurrency(calc.result.valorSt)],
          ["Valor Total da Nota", formatCurrency(calc.result.valorTotalNota)],
      ];
      drawTable(['Resultado', 'Valor'], resultData.map(row => [row[0], row[1].toString()]), [80, 80]);

    });

    printSectionHeader("Resumo Geral");
    
    const totalSt = completedCalculations.reduce((acc, calc) => acc + calc.result.valorSt, 0);
    const totalPisCofins = completedCalculations.reduce((acc, calc) => acc + calc.result.basePisCofins, 0);
    
    drawTable(['Total', 'Valor'], [
        ['Base PIS/COFINS (Soma)', formatCurrency(totalPisCofins)],
        ['ICMS-ST a Recolher (Soma)', formatCurrency(totalSt)]
    ], [80, 80]);
    
    doc.save("relatorio_consolidado_icms_st.pdf");
  };

  const handleIvaCalculation = () => {
    const original = parseLocaleString(ivaOriginal) / 100;
    const inter = parseLocaleString(aliqInter) / 100;
    const interna = parseLocaleString(aliqInterna) / 100;

    if (isNaN(original) || isNaN(inter) || isNaN(interna) || (1 - interna) === 0) {
        setIvaAjustado(null);
        return;
    }

    const ajustado = ((1 + original) * (1 - inter) / (1 - interna) - 1);
    setIvaAjustado(ajustado * 100);
  };

  const handleIvaClear = () => {
      setIvaOriginal("");
      setAliqInter("");
      setAliqInterna("");
      setIvaAjustado(null);
  };

  const handleEdit = (index: number) => {
    const calculationToEdit = completedCalculations[index];
    setEditingIndex(index);
    form.reset(calculationToEdit.formData);
    setStep('calculating');
  };

  const renderSetup = () => (
    <Card className="w-full max-w-lg mx-auto shadow-lg border">
      <CardHeader>
        <CardTitle>Configuração do Cálculo</CardTitle>
        <CardDescription>Quantos cálculos com IVAs diferentes você precisa fazer para esta nota fiscal?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="numberOfCalculations">Número de Cálculos</Label>
          <Input 
            id="numberOfCalculations"
            type="number"
            min="1"
            value={numberOfCalculations}
            onChange={(e) => setNumberOfCalculations(parseInt(e.target.value) || 1)}
            className="mt-2"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleStart} className="w-full">
          Começar Cálculos
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  const renderCalculator = () => {
    const isEditing = editingIndex !== null;
    return (
      <Card className="w-full max-w-4xl mx-auto shadow-lg border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-headline">
            <Calculator className="h-6 w-6 text-primary" />
            {isEditing ? `Editando Cálculo ${editingIndex! + 1}` : `Calculadora de ICMS-ST (Cálculo ${currentCalculationIndex + 1} de ${numberOfCalculations})`}
          </CardTitle>
          <CardDescription>
            Insira os valores da nota para calcular a Substituição Tributária.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="items"
                render={({ field }) => (
                  <FormItem className="pb-4 border-b">
                    <FormLabel className="font-semibold text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Itens da Nota Fiscal
                    </FormLabel>
                     <p className="text-sm text-muted-foreground">Descreva quais itens da nota este cálculo de IVA se aplica. Ex: "Item 1, 2, 5" ou "Parafusos".</p>
                    <FormControl>
                      <Textarea placeholder="Ex: Item 1, 2, 5 ou todos os parafusos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="operationType"
                  render={({ field }) => (
                    <FormItem className="space-y-3 pt-4">
                      <FormLabel className="font-semibold text-lg flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        Tipo de Operação *
                      </FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col sm:flex-row gap-4">
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="compra" id="op-compra" /></FormControl><FormLabel htmlFor="op-compra" className="font-normal cursor-pointer">Compra</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="pecas" id="op-pecas" /></FormControl><FormLabel htmlFor="op-pecas" className="font-normal cursor-pointer">Peças</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="transferencia" id="op-transfer" /></FormControl><FormLabel htmlFor="op-transfer" className="font-normal cursor-pointer">Transferência</FormLabel></FormItem>
                        </RadioGroup>
                      </FormControl><FormMessage />
                    </FormItem>
                  )}
                />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                 <FormField control={form.control} name="ncm" render={({ field }) => (<FormItem><FormLabel>NCM</FormLabel><FormControl><Input placeholder="84439933" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="fornecedor" render={({ field }) => (<FormItem><FormLabel>Fornecedor</FormLabel><div className="relative"><Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="Nome do fornecedor" className="pl-9" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="valorMercadoria" render={({ field }) => (<FormItem><FormLabel>{operationType === 'pecas' ? 'Valor Total c/ IPI *' : 'Vlr. Mercadoria *'}</FormLabel><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="1.000,00" className="pl-9" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                {operationType === 'compra' ? (<FormField control={form.control} name="valorIpi" render={({ field }) => (<FormItem><FormLabel>Valor do IPI</FormLabel><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="0,00" className="pl-9" {...field} /></FormControl></div><FormMessage /></FormItem>)} />) : operationType === 'pecas' ? (<FormField control={form.control} name="aliqIpi" render={({ field }) => (<FormItem><FormLabel>Alíquota IPI *</FormLabel><div className="relative"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="0,00" className="pl-9" {...field} /></FormControl></div><FormMessage /></FormItem>)} />) : <div />}
                <FormField control={form.control} name="aliqIcms" render={({ field }) => (<FormItem><FormLabel>Alíq. ICMS *</FormLabel><div className="relative"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="12,00" className="pl-9" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="mva" render={({ field }) => (<FormItem><FormLabel>IVA/MVA *</FormLabel><div className="relative"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="29,00" className="pl-9" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="aliqIcmsSt" render={({ field }) => (<FormItem><FormLabel>Alíq. ICMS ST *</FormLabel><div className="relative"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="18,00" className="pl-9" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="valorFrete" render={({ field }) => (<FormItem><FormLabel>Valor do Frete</FormLabel><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="0,00" className="pl-9" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="redBaseSt" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1">Redução Base ST (%)<TooltipProvider><Tooltip><TooltipTrigger type="button"><Info className="h-3 w-3 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Ex: Alíquota interna de 18% com redução para 12%, a redução é de 33.33%.</p></TooltipContent></Tooltip></TooltipProvider></FormLabel><div className="relative"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="33,33" className="pl-9" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
                {isEditing ? (
                    <>
                        <Button type="button" variant="outline" className="w-full" onClick={() => { setEditingIndex(null); setStep('results'); }}>Cancelar</Button>
                        <Button type="submit" className="w-full bg-gradient-to-r from-accent to-primary text-white font-bold">Salvar Alterações</Button>
                    </>
                ) : (
                    <Button type="submit" className="w-full bg-gradient-to-r from-accent to-primary text-white font-bold">
                      <Calculator className="mr-2 h-4 w-4" />
                      {currentCalculationIndex < numberOfCalculations - 1 ? `Salvar e Próximo (${currentCalculationIndex + 2}/${numberOfCalculations})` : 'Finalizar e Ver Resultados'}
                    </Button>
                )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    );
  }

  const renderResults = () => {
    const totalSt = completedCalculations.reduce((acc, calc) => acc + calc.result.valorSt, 0);
    return (
      <section className="w-full max-w-4xl mx-auto animate-in fade-in-50 duration-500 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold font-headline">Resultados Consolidados</h2>
          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            <Button variant="outline" onClick={handleNewFullCalculation} className="flex-1"><PlusCircle className="mr-2 h-4 w-4" />Novo Cálculo</Button>
            <Button onClick={handleExportToPdf} className="flex-1"><FileDown className="mr-2 h-4 w-4" />Exportar PDF</Button>
            <Button asChild variant="secondary" className="flex-1">
              <a href="https://www4.fazenda.sp.gov.br/DareICMS/DareAvulso" target="_blank" rel="noopener noreferrer"><FileText className="mr-2 h-4 w-4" />Gerar DARE</a>
            </Button>
          </div>
        </div>
        <Card>
            <CardHeader><CardTitle>Total ICMS-ST a Recolher</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-bold text-primary">{formatCurrency(totalSt)}</p></CardContent>
        </Card>
        <div className="space-y-4">
          {completedCalculations.map((calc, index) => (
             <Card key={index} className="border-border/50">
                <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                        <CardTitle>Cálculo {index + 1}</CardTitle>
                        <CardDescription>Para os itens: <span className="font-semibold text-foreground">{calc.formData.items || 'Não especificado'}</span></CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(index)}><Pencil className="mr-2 h-4 w-4" /> Editar</Button>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ResultCard title="Base de Cálculo ST" value={calc.result.baseSt} />
                    <ResultCard title="Valor do ICMS-ST" value={calc.result.valorSt} isPrimary />
                    <ResultCard title="Base PIS/COFINS" value={calc.result.basePisCofins} />
                    <ResultCard title="Valor Total da Nota" value={calc.result.valorTotalNota} isPrimary />
                </CardContent>
             </Card>
          ))}
        </div>
      </section>
    )
  };

  const renderContent = () => {
    switch(step) {
      case 'setup':
        return renderSetup();
      case 'calculating':
        return renderCalculator();
      case 'results':
        return renderResults();
      default:
        return renderSetup();
    }
  }

  return (
    <div className="space-y-8">
      {renderContent()}

      <Card className="w-full max-w-4xl mx-auto shadow-lg border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-headline"><Wand2 className="h-6 w-6 text-primary" />Calculadora de IVA/MVA Ajustado</CardTitle>
          <CardDescription>Descubra o valor do IVA/MVA ajustado para operações interestaduais.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><Label htmlFor="ivaOriginal">IVA/MVA Original (%)</Label><div className="relative mt-2"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="ivaOriginal" placeholder="29,00" className="pl-9" value={ivaOriginal} onChange={(e) => setIvaOriginal(e.target.value)} /></div></div>
            <div><Label htmlFor="aliqInter">Alíquota Interestadual (%)</Label><div className="relative mt-2"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="aliqInter" placeholder="12" className="pl-9" value={aliqInter} onChange={(e) => setAliqInter(e.target.value)} /></div></div>
            <div><Label htmlFor="aliqInterna">Alíquota Interna (%)</Label><div className="relative mt-2"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="aliqInterna" placeholder="12" className="pl-9" value={aliqInterna} onChange={(e) => setAliqInterna(e.target.value)} /></div></div>
          </div>
          {ivaAjustado !== null && (<div className="pt-6 text-center animate-in fade-in-50 duration-500"><Label className="text-sm font-medium text-muted-foreground">Resultado do IVA Ajustado</Label><p className="text-4xl font-bold text-primary">{ivaAjustado.toFixed(2).replace('.', ',')}%</p></div>)}
        </CardContent>
        <CardFooter className="gap-4">
            <Button onClick={handleIvaCalculation} className="w-full sm:w-auto flex-1 bg-gradient-to-r from-accent to-primary text-white font-bold"><Calculator className="mr-2 h-4 w-4" />Calcular IVA Ajustado</Button>
            <Button type="button" variant="outline" onClick={handleIvaClear} className="w-full sm:w-auto"><RotateCw className="mr-2 h-4 w-4" />Limpar</Button>
        </CardFooter>
      </Card>

      <DareHelper />
    </div>
  );
}
