
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IcmsStFormData, NfeProductData } from "@/lib/definitions";
import { icmsStSchema } from "@/lib/definitions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calculator, RotateCw, Info, Percent, DollarSign, Wand2, FileText, Briefcase, Building, Search, Clipboard, ArrowRight, PlusCircle, Pencil, Printer, PackageCheck, ListChecks, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { dareSupplierData } from "@/lib/dare-data";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";

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
  id: string;
  formData: IcmsStFormData;
  result: CalculationResult;
  selectedItems: NfeProductData[];
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

export default function CalculoIcmsSt({ prefillData }: { prefillData?: any }) {
  const [step, setStep] = useState<'calculating' | 'results'>('calculating');
  const [completedCalculations, setCompletedCalculations] = useState<CompletedCalculation[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  
  const [ivaOriginal, setIvaOriginal] = useState("");
  const [aliqInter, setAliqInter] = useState("");
  const [aliqInterna, setAliqInterna] = useState("");
  const [ivaAjustado, setIvaAjustado] = useState<number | null>(null);

  const { toast } = useToast();
  
  const form = useForm<IcmsStFormData>({
    resolver: zodResolver(icmsStSchema),
    defaultValues: {
      operationType: "compra",
      ncm: "",
      fornecedor: "",
      valorProduto: "0",
      valorFrete: "0",
      valorIpi: "0",
      aliqIcms: "",
      mva: "",
      aliqIcmsSt: "",
      origem4: false,
    },
  });

  const operationType = form.watch("operationType");
  
  const availableProducts = prefillData?.products?.filter((p: NfeProductData) => 
    !completedCalculations.some(calc => calc.selectedItems.some(item => item.item === p.item))
  ) || [];

  const parseLocaleString = (value: string | undefined) => parseFloat(value?.replace(/\./g, '').replace(',', '.') || '0') || 0;

   const calculateProportionalValues = (selectedIds: string[]) => {
      if (!prefillData?.products || selectedIds.length === 0) {
        return { valorMercadoria: 0, valorFrete: 0, valorIpi: 0 };
      }
      return prefillData.products
        .filter((p: NfeProductData) => selectedIds.includes(p.item))
        .reduce((acc, p) => {
            acc.valorMercadoria += parseFloat(p.vProd || '0');
            acc.valorFrete += parseFloat(p.vFrete || '0');
            acc.valorIpi += parseFloat(p.ipi?.vIPI || '0');
            return acc;
        }, { valorMercadoria: 0, valorFrete: 0, valorIpi: 0 });
  }

  useEffect(() => {
    if (prefillData && !editingId) {
      const { valorMercadoria, valorFrete, valorIpi } = calculateProportionalValues(selectedItemIds);
      form.reset({
        ...form.getValues(),
        operationType: prefillData.operationType,
        fornecedor: prefillData.fornecedor,
        ncm: prefillData.ncm,
        origem4: prefillData.origem4,
        aliqIcms: prefillData.aliqIcms?.toString().replace('.', ',') ?? '',
        valorProduto: valorMercadoria.toFixed(2).replace('.', ','),
        valorFrete: valorFrete.toFixed(2).replace('.', ','),
        valorIpi: valorIpi.toFixed(2).replace('.', ','),
      });
    }
  }, [prefillData, editingId, selectedItemIds, form]);

  useEffect(() => {
    if (!prefillData) {
        form.reset({
            operationType: "compra",
            ncm: "",
            fornecedor: "",
            valorProduto: "0",
            valorFrete: "0",
            valorIpi: "0",
            aliqIcms: "",
            mva: "",
            aliqIcmsSt: "",
            origem4: false,
        });
    }
  }, [prefillData, form]);


  const handleNewFullCalculation = () => {
    setStep('calculating');
    setCompletedCalculations([]);
    setIvaAjustado(null);
    setSelectedItemIds([]);
    form.reset();
    window.history.replaceState({}, '', '/calculo-icms-st');
  };

  const handleNewCalculationGroup = () => {
    setEditingId(null);
    setSelectedItemIds([]);
    form.reset({
        operationType: prefillData.operationType,
        fornecedor: prefillData.fornecedor,
        ncm: '',
        origem4: prefillData.origem4,
        valorProduto: "0",
        valorFrete: "0",
        valorIpi: "0",
        aliqIcms: prefillData.aliqIcms?.toString().replace('.', ',') ?? '',
    });
    toast({ title: "Pronto para o próximo grupo de itens." });
  };
  
  const onSubmit = (data: IcmsStFormData) => {
    if (prefillData && selectedItemIds.length === 0) {
        toast({ variant: 'destructive', title: 'Nenhum item selecionado', description: 'Por favor, selecione ao menos um item da nota para calcular.' });
        return;
    }
    
    let valorMercadoria = 0;
    let valorFrete = 0;
    let valorIpi = 0;

    if (data.operationType === 'pecas') {
        const valorTotalPecas = parseLocaleString(data.valorTotalPecas);
        const aliqIpiPecas = parseLocaleString(data.aliqIpiPecas);
        valorMercadoria = valorTotalPecas / (1 + (aliqIpiPecas / 100));
        valorIpi = valorTotalPecas - valorMercadoria;
        valorFrete = 0; // Frete is not part of this specific calculation
    } else {
        if (prefillData && selectedItemIds.length > 0) {
            const proportionalValues = calculateProportionalValues(selectedItemIds);
            valorMercadoria = proportionalValues.valorMercadoria;
            valorFrete = proportionalValues.valorFrete;
            valorIpi = proportionalValues.valorIpi;
        } else {
            valorMercadoria = parseLocaleString(data.valorProduto);
            valorFrete = parseLocaleString(data.valorFrete);
            valorIpi = parseLocaleString(data.valorIpi);
        }
    }
    
    const aliqIcms = parseLocaleString(data.aliqIcms);
    const mva = parseLocaleString(data.mva);
    const aliqIcmsSt = parseLocaleString(data.aliqIcmsSt);
    const redBaseSt = data.origem4 ? 33.33 : 0;

    const baseIcmsProprio = valorMercadoria + valorFrete;
    const valorIcmsProprio = parseFloat((baseIcmsProprio * (aliqIcms / 100)).toFixed(2));
    
    const baseStSemReducao = (valorMercadoria + valorFrete + valorIpi) * (1 + mva / 100);
    const baseSt = parseFloat((baseStSemReducao * (1 - redBaseSt / 100)).toFixed(2));
    
    const valorStBruto = (baseSt * (aliqIcmsSt / 100)) - valorIcmsProprio;
    const valorSt = valorStBruto > 0 ? parseFloat(valorStBruto.toFixed(2)) : 0;

    let valorTotalNota = valorMercadoria + valorFrete + valorIpi + valorSt;
    
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
    
    const selectedItems = prefillData ? prefillData.products.filter((p: NfeProductData) => selectedItemIds.includes(p.item)) : [];
    const completedCalc: CompletedCalculation = { id: editingId || new Date().getTime().toString(), formData: data, result, selectedItems };

    if (editingId) {
        const updatedCalculations = completedCalculations.map((calc) => 
            calc.id === editingId ? completedCalc : calc
        );
        setCompletedCalculations(updatedCalculations);
        setEditingId(null);
        toast({ title: `Cálculo atualizado!` });
    } else {
        setCompletedCalculations(prev => [...prev, completedCalc]);
        toast({ title: `Grupo de cálculo adicionado!` });
    }
    
    if (prefillData) {
      handleNewCalculationGroup();
    } else {
      setStep('results');
    }
  };
  
  const handlePrint = () => {
    if (completedCalculations.length === 0) return;

    const calculationsHtml = completedCalculations.map((calc, index) => {
        const itemsList = calc.selectedItems.map(p => `<li>${p.xProd} (Item ${p.item})</li>`).join('');
        const hasPrefill = calc.selectedItems.length > 0;
        
        let proportionalValues;
        if (calc.formData.operationType === 'pecas') {
             const valorTotalPecas = parseLocaleString(calc.formData.valorTotalPecas);
             const aliqIpiPecas = parseLocaleString(calc.formData.aliqIpiPecas);
             const valorMercadoria = valorTotalPecas / (1 + (aliqIpiPecas / 100));
             const valorIpi = valorTotalPecas - valorMercadoria;
             proportionalValues = { valorMercadoria, valorIpi, valorFrete: 0 };
        } else if (hasPrefill) {
            proportionalValues = calculateProportionalValues(calc.selectedItems.map(i => i.item));
        } else {
            proportionalValues = {
                valorMercadoria: parseLocaleString(calc.formData.valorProduto),
                valorFrete: parseLocaleString(calc.formData.valorFrete),
                valorIpi: parseLocaleString(calc.formData.valorIpi),
            };
        }

        return `
        <div class="subtitle">
          Cálculo ${index + 1} de ${completedCalculations.length} · Tipo: <strong>${calc.formData.operationType}</strong> · Fornecedor: <strong>${calc.formData.fornecedor || 'N/A'}</strong>
        </div>
        ${hasPrefill ? `<div class="items-applied">
            <strong>Itens Aplicados:</strong>
            <ul>${itemsList}</ul>
        </div>` : ''}

        <div class="section-title">📍 Detalhes da Operação ${hasPrefill ? '(Proporcional)' : '(Manual)'}</div>
        <table>
          <tr><th>Campo</th><th style="text-align:right;">Valor</th></tr>
          <tr><td>NCM</td><td style="text-align:right;">${calc.formData.ncm || 'N/A'}</td></tr>
          <tr><td>Valor Mercadoria</td><td style="text-align:right;">${formatCurrency(proportionalValues.valorMercadoria)}</td></tr>
          <tr><td>Valor do Frete</td><td style="text-align:right;">${formatCurrency(proportionalValues.valorFrete)}</td></tr>
          <tr><td>Valor do IPI</td><td style="text-align:right;">${formatCurrency(proportionalValues.valorIpi)}</td></tr>
          <tr><td>Alíquota ICMS</td><td style="text-align:right;">${formatPercent(calc.formData.aliqIcms)}</td></tr>
          <tr><td>IVA/MVA</td><td style="text-align:right;">${formatPercent(calc.formData.mva)}</td></tr>
          <tr><td>Alíquota ICMS-ST</td><td style="text-align:right;">${formatPercent(calc.formData.aliqIcmsSt)}</td></tr>
        </table>

        <div class="section-title">📊 Resultados do Cálculo</div>
        <table>
          <tr><th>Campo</th><th style="text-align:right;">Valor</th></tr>
          <tr><td>ICMS Próprio</td><td style="text-align:right;">${formatCurrency(calc.result.valorIcmsProprio)}</td></tr>
          <tr><td>Base de Cálculo ST</td><td style="text-align:right;">${formatCurrency(calc.result.baseSt)}</td></tr>
          <tr><td>ICMS-ST</td><td style="text-align:right;"><strong>${formatCurrency(calc.result.valorSt)}</strong></td></tr>
          <tr><td>Base PIS/COFINS</td><td style="text-align:right;">${formatCurrency(calc.result.basePisCofins)}</td></tr>
          <tr><td>Total da Nota (Itens)</td><td style="text-align:right;"><strong>${formatCurrency(calc.result.valorTotalNota)}</strong></td></tr>
        </table>
      `;
    }).join('<hr class="section-divider">');

    const totalSt = completedCalculations.reduce((acc, calc) => acc + calc.result.valorSt, 0);

    const summarySlipsHtml = completedCalculations.map((calc, index) => {
        const aliqInternaNum = parseLocaleString(calc.formData.aliqIcmsSt);
        const redBaseStNum = calc.formData.origem4 ? 33.33 : 0;
        const reduzidoHtml = redBaseStNum > 0 
            ? `<div class="slip-item"><span>Reduzido:</span> <strong>${(aliqInternaNum * (1 - redBaseStNum / 100)).toFixed(2).replace('.', ',')}%</strong></div>`
            : '';

        const slipContent = `
            <div class="slip-body">
                <div class="slip-item"><span>Alíquota Interna:</span> <strong>${formatPercent(calc.formData.aliqIcmsSt)}</strong></div>
                <div class="slip-item"><span>IVA/MVA:</span> <strong>${formatPercent(calc.formData.mva)}</strong></div>
                ${reduzidoHtml}
                <div class="slip-item-total">
                    <span>Valor da Guia:</span>
                    <strong>${formatCurrency(calc.result.valorSt)}</strong>
                </div>
            </div>
        `;
        return `<div class="summary-slip">${slipContent}</div>`;
    }).join('');


    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Relatório ICMS-ST</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px; color: #212529; }
          .container { max-width: 800px; margin: auto; background: #fff; padding: 30px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #3B82F6; padding-bottom: 10px; margin-bottom: 20px; }
          h1 { font-size: 24px; color: #111827; margin: 0; }
          .btn-print { font-family: inherit; font-size: 14px; background-color: #3B82F6; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; }
          .btn-print:hover { background-color: #2563eb; }
          .subtitle { margin-top: 20px; font-size: 14px; color: #6c757d; }
          .items-applied { font-size: 13px; color: #495057; background-color: #e9ecef; padding: 8px 12px; border-radius: 6px; margin-top: 10px; }
          .items-applied ul { margin: 4px 0 0; padding-left: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
          th { text-align: left; color: #3b82f6; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding: 10px 4px; }
          td { text-align: left; padding: 12px 4px; border-bottom: 1px solid #f3f4f6; color: #4b5563; }
          td:last-child { font-weight: 600; color: #1f2937; }
          .section-title { margin-top: 30px; font-size: 16px; font-weight: 700; color: #3B82F6; display: flex; align-items: center; gap: 8px; }
          .section-divider { border: 0; height: 1px; background: #e9ecef; margin: 40px 0; }
          .total-box { margin-top: 30px; background-color: #E6F7F0; padding: 20px; border-radius: 8px; border-left: 4px solid #10B981; }
          .total-label { font-size: 14px; color: #047857; display: flex; align-items: center; gap: 6px; font-weight: 600; }
          .total-value { font-size: 24px; font-weight: 700; color: #059669; margin-top: 4px; }
          .page-break { page-break-before: always; }

          .summary-slip { display: inline-block; border: 1.5px dashed #a0aec0; padding: 15px; border-radius: 8px; page-break-inside: avoid; margin-top: 20px; }
          .slip-header { font-weight: 700; font-size: 14px; color: #3b82f6; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 8px; }
          .slip-body { font-size: 13px; }
          .slip-item { display: flex; justify-content: space-between; padding: 4px 0; min-width: 250px; }
          .slip-item span { color: #4a5568; }
          .slip-item-total { display: flex; justify-content: space-between; padding-top: 8px; margin-top: 8px; border-top: 1px solid #e2e8f0; font-weight: 700; font-size: 14px; }
          
          @media print {
            body { padding: 0; background-color: #fff; }
            .container { box-shadow: none; border-radius: 0; padding: 10px; }
            .header { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Relatório ICMS-ST - Consolidado</h1>
            <button class="btn-print" onclick="window.print()">🖨️ Imprimir</button>
          </div>
          
          <!-- Page 1: Detailed Calculations -->
          ${calculationsHtml}
          <div class="total-box">
            <div class="total-label">✅ Total do ICMS-ST:</div>
            <div class="total-value">${formatCurrency(totalSt)}</div>
          </div>
          
          <!-- Page 2: Summary Slips -->
          <div class="page-break">
             <div class="header">
                <h1>Folha de Resumos para Anexar</h1>
            </div>
            ${summarySlipsHtml}
          </div>

        </div>
      </body>
      </html>
    `;

    const reportWindow = window.open("", "_blank");
    if (reportWindow) {
      reportWindow.document.write(htmlContent);
      reportWindow.document.close();
      reportWindow.focus();
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro ao abrir relatório',
        description: 'Por favor, habilite pop-ups para este site.'
      });
    }
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

  const handleEdit = (calc: CompletedCalculation) => {
    setEditingId(calc.id);
    setSelectedItemIds(calc.selectedItems.map(i => i.item));
    form.reset(calc.formData);
    toast({ title: `Editando grupo de itens.` });
  };

  const handleDelete = (id: string) => {
    setCompletedCalculations(prev => prev.filter(c => c.id !== id));
    toast({ variant: 'destructive', title: 'Grupo de cálculo removido.' });
  }

  const renderCalculator = () => {
    const isEditing = editingId !== null;
    const isPrefilled = !!prefillData;

    return (
      <Card className="w-full max-w-4xl mx-auto shadow-lg border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-headline">
            <Calculator className="h-6 w-6 text-primary" />
            {isEditing ? `Editando Grupo de Cálculo` : `Calculadora de ICMS-ST`}
          </CardTitle>
          <CardDescription>
            {isPrefilled
                ? 'Selecione os itens da nota e preencha os campos para calcular a ST.' 
                : 'Insira os valores para calcular a Substituição Tributária.'}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {isPrefilled && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <ListChecks className="h-5 w-5 text-primary" />
                            Selecione os Itens para este Cálculo
                        </CardTitle>
                        <CardDescription>
                            Itens disponíveis para cálculo. Os já calculados não aparecerão aqui.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-40 w-full rounded-md border p-4">
                           {availableProducts.length > 0 ? availableProducts.map((p: NfeProductData) => (
                               <div key={p.item} className="flex items-center space-x-2 mb-2">
                                <Checkbox
                                    id={`item-${p.item}`}
                                    checked={selectedItemIds.includes(p.item)}
                                    onCheckedChange={(checked) => {
                                        setSelectedItemIds(prev => 
                                            checked ? [...prev, p.item] : prev.filter(id => id !== p.item)
                                        );
                                    }}
                                />
                                <label htmlFor={`item-${p.item}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Item {p.item}: {p.xProd} ({formatCurrency(parseFloat(p.vProd || '0'))})
                                </label>
                               </div>
                           )) : (
                               <p className="text-sm text-muted-foreground">Todos os itens da nota já foram incluídos em cálculos.</p>
                           )}
                        </ScrollArea>
                    </CardContent>
                </Card>
              )}
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
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col sm:flex-row gap-4">
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="compra" id="op-compra" /></FormControl><FormLabel htmlFor="op-compra" className="font-normal cursor-pointer">Compra</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="transferencia" id="op-transfer" /></FormControl><FormLabel htmlFor="op-transfer" className="font-normal cursor-pointer">Transferência</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="pecas" id="op-pecas" /></FormControl><FormLabel htmlFor="op-pecas" className="font-normal cursor-pointer">Peças</FormLabel></FormItem>
                        </RadioGroup>
                      </FormControl><FormMessage />
                    </FormItem>
                  )}
                />
              {operationType === 'pecas' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="valorTotalPecas" render={({ field }) => (<FormItem><FormLabel>Valor Total (c/ IPI) *</FormLabel><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="1050,00" className="pl-9" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="aliqIpiPecas" render={({ field }) => (<FormItem><FormLabel>Alíquota IPI (%) *</FormLabel><div className="relative"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="5,00" className="pl-9" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="valorProduto" render={({ field }) => (<FormItem><FormLabel>Valor do Produto *</FormLabel><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="1000,00" className="pl-9" {...field} disabled={isPrefilled} /></FormControl></div><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="valorFrete" render={({ field }) => (<FormItem><FormLabel>Valor do Frete *</FormLabel><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="100,00" className="pl-9" {...field} disabled={isPrefilled} /></FormControl></div><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="valorIpi" render={({ field }) => (<FormItem><FormLabel>Valor do IPI *</FormLabel><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="50,00" className="pl-9" {...field} disabled={isPrefilled} /></FormControl></div><FormMessage /></FormItem>)} />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <FormField control={form.control} name="ncm" render={({ field }) => (<FormItem><FormLabel>NCM</FormLabel><FormControl><Input placeholder="84439933" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="fornecedor" render={({ field }) => (<FormItem><FormLabel>Fornecedor</FormLabel><div className="relative"><Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="Nome do fornecedor" className="pl-9" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="aliqIcms" render={({ field }) => (<FormItem><FormLabel>Alíq. ICMS *</FormLabel><div className="relative"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="12,00" className="pl-9" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="mva" render={({ field }) => (<FormItem><FormLabel>IVA/MVA *</FormLabel><div className="relative"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="29,00" className="pl-9" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="aliqIcmsSt" render={({ field }) => (<FormItem><FormLabel>Alíq. ICMS ST *</FormLabel><div className="relative"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="18,00" className="pl-9" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                <FormField
                  control={form.control}
                  name="origem4"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-center rounded-lg border p-4">
                      <div className="flex flex-row items-center justify-between">
                        <FormLabel htmlFor="origem4-switch" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Origem 4
                        </FormLabel>
                        <FormControl>
                            <Switch
                                id="origem4-switch"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                      </div>
                      <p className="text-[0.8rem] font-medium text-muted-foreground">
                          Aplica redução de 33,33%.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
                {isEditing ? (
                    <>
                        <Button type="button" variant="outline" className="w-full" onClick={() => { setEditingId(null); handleNewCalculationGroup(); }}>Cancelar Edição</Button>
                        <Button type="submit" className="w-full bg-gradient-to-r from-accent to-primary text-white font-bold">Salvar Alterações</Button>
                    </>
                ) : (
                    <Button type="submit" className="w-full bg-gradient-to-r from-accent to-primary text-white font-bold">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {isPrefilled ? 'Adicionar Grupo de Cálculo' : 'Calcular e Ver Resultado'}
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
            <Button variant="outline" onClick={handleNewFullCalculation} className="flex-1"><RotateCw className="mr-2 h-4 w-4" />Novo Cálculo</Button>
            <Button onClick={handlePrint} className="flex-1"><Printer className="mr-2 h-4 w-4" />Imprimir</Button>
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
             <Card key={calc.id} className="border-border/50">
                <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                        <CardTitle>Grupo de Cálculo {index + 1}</CardTitle>
                        <CardDescription>
                            {calc.selectedItems.length > 0 ? (
                                <>
                                    <Badge variant="secondary" className="mr-2">{calc.selectedItems.length} {calc.selectedItems.length > 1 ? 'itens' : 'item'}</Badge>
                                    {calc.selectedItems.map(i => i.xProd).join(', ').substring(0, 100)}...
                                </>
                            ) : "Cálculo Manual"}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(calc)}><Pencil className="mr-2 h-4 w-4" /> Editar</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(calc.id)}><Trash2 className="mr-2 h-4 w-4" /> Excluir</Button>
                    </div>
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
        {prefillData && availableProducts.length > 0 && (
            <div className="text-center p-4">
                 <Button onClick={() => setStep('calculating')}>
                    <PlusCircle className="mr-2" />
                    Adicionar Novo Grupo de Cálculo
                </Button>
            </div>
        )}
      </section>
    )
  };

  const renderContent = () => {
    if (step === 'calculating') {
        return renderCalculator();
    }
    return completedCalculations.length > 0 ? renderResults() : renderCalculator();
  }

  return (
    <div className="space-y-8">
      {renderContent()}

       {completedCalculations.length > 0 && step !== 'results' && (
            <div className="text-center p-4">
                <Button size="lg" onClick={() => setStep('results')}>
                    <PackageCheck className="mr-2" />
                    Finalizar e Ver Relatório Consolidado
                </Button>
            </div>
        )}

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
