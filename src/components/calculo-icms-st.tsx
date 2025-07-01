
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IcmsStFormData } from "@/lib/definitions";
import { icmsStSchema } from "@/lib/definitions";
import jsPDF from "jspdf";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calculator, RotateCw, Info, Percent, DollarSign, Wand2, FileDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

interface CalculationResult {
  baseSt: number;
  valorSt: number;
  valorTotalNota: number;
  basePisCofins: number;
  valorIcmsProprio: number;
  valorIpi: number;
}

const ResultCard = ({ title, value, isPrimary = false }: { title: string, value: number, isPrimary?: boolean }) => (
  <Card className={isPrimary ? "bg-primary/10 border-primary/20 shadow-lg" : "shadow-md"}>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold">{formatCurrency(value)}</p>
    </CardContent>
  </Card>
);

export default function CalculoIcmsSt() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [lastCalcData, setLastCalcData] = useState<IcmsStFormData | null>(null);
  const [ivaOriginal, setIvaOriginal] = useState("");
  const [aliqInter, setAliqInter] = useState("");
  const [aliqInterna, setAliqInterna] = useState("");
  const [ivaAjustado, setIvaAjustado] = useState<number | null>(null);

  const form = useForm<IcmsStFormData>({
    resolver: zodResolver(icmsStSchema),
    defaultValues: {
      ncm: "",
      valorMercadoria: "",
      valorFrete: "",
      aliqIpi: "",
      aliqIcms: "",
      mva: "",
      aliqIcmsSt: "",
      redBaseSt: "",
    },
  });

  const parseLocaleString = (value: string) => parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;

  const onSubmit = (data: IcmsStFormData) => {
    const valorMercadoria = parseLocaleString(data.valorMercadoria);
    const valorFrete = parseLocaleString(data.valorFrete || "0");
    const aliqIpi = parseLocaleString(data.aliqIpi || "0");
    const aliqIcms = parseLocaleString(data.aliqIcms);
    const mva = parseLocaleString(data.mva);
    const aliqIcmsSt = parseLocaleString(data.aliqIcmsSt);
    const redBaseSt = parseLocaleString(data.redBaseSt || "0");

    const baseIpi = valorMercadoria + valorFrete;
    const valorIpi = parseFloat((baseIpi * (aliqIpi / 100)).toFixed(2));

    const baseIcmsProprio = valorMercadoria + valorFrete;
    const valorIcmsProprio = parseFloat((baseIcmsProprio * (aliqIcms / 100)).toFixed(2));
    
    const baseStSemReducao = (valorMercadoria + valorFrete + valorIpi) * (1 + mva / 100);
    const baseSt = parseFloat((baseStSemReducao * (1 - redBaseSt / 100)).toFixed(2));
    
    const valorStBruto = (baseSt * (aliqIcmsSt / 100)) - valorIcmsProprio;
    const valorSt = valorStBruto > 0 ? parseFloat(valorStBruto.toFixed(2)) : 0;

    const valorTotalNota = valorMercadoria + valorFrete + valorIpi + valorSt;
    
    const basePisCofins = baseIcmsProprio - valorIcmsProprio;

    setResult({
      baseSt,
      valorSt,
      valorTotalNota,
      basePisCofins,
      valorIcmsProprio,
      valorIpi
    });
    setLastCalcData(data);
  };

  const handleClear = () => {
    form.reset();
    setResult(null);
    setLastCalcData(null);
  };
  
  const handleExportToPdf = () => {
    if (!result || !lastCalcData) {
      alert("Nenhum resultado para exportar.");
      return;
    }

    const doc = new jsPDF();
    
    const printRow = (y: number, label: string, value: string) => {
        doc.text(label, 15, y);
        doc.text(value, 120, y);
    };

    doc.setFontSize(18);
    doc.text("Relatório de Cálculo ICMS-ST", 14, 22);

    doc.setFontSize(14);
    doc.text("Dados de Entrada", 14, 40);
    doc.line(14, 42, 200, 42); 

    doc.setFontSize(11);
    let y = 50;
    printRow(y, "NCM:", lastCalcData.ncm || "N/A");
    printRow(y += 7, "Valor da Mercadoria:", formatCurrency(parseLocaleString(lastCalcData.valorMercadoria)));
    printRow(y += 7, "Valor do Frete:", formatCurrency(parseLocaleString(lastCalcData.valorFrete || "0")));
    printRow(y += 7, "Alíquota IPI:", `${parseLocaleString(lastCalcData.aliqIpi || "0")}%`);
    printRow(y += 7, "Alíquota ICMS:", `${parseLocaleString(lastCalcData.aliqIcms)}%`);
    printRow(y += 7, "IVA/MVA:", `${parseLocaleString(lastCalcData.mva)}%`);
    printRow(y += 7, "Alíquota ICMS-ST:", `${parseLocaleString(lastCalcData.aliqIcmsSt)}%`);
    printRow(y += 7, "Redução Base ST:", `${parseLocaleString(lastCalcData.redBaseSt || "0")}%`);
    
    y += 15;

    doc.setFontSize(14);
    doc.text("Resultados do Cálculo", 14, y);
    doc.line(14, y + 2, 200, y + 2);
    y += 10;
    
    doc.setFontSize(11);
    printRow(y, "Valor ICMS Próprio:", formatCurrency(result.valorIcmsProprio));
    printRow(y += 7, "Valor IPI:", formatCurrency(result.valorIpi));
    printRow(y += 7, "Base de Cálculo ST:", formatCurrency(result.baseSt));
    printRow(y += 7, "Valor do ICMS-ST:", formatCurrency(result.valorSt));
    printRow(y += 7, "Base PIS/COFINS:", formatCurrency(result.basePisCofins));
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    printRow(y += 10, "Valor Total da Nota (com ST):", formatCurrency(result.valorTotalNota));

    doc.save("relatorio_calculo_icms_st.pdf");
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

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-4xl mx-auto shadow-lg border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-headline">
            <Calculator className="h-6 w-6 text-primary" />
            Calculadora de ICMS-ST
          </CardTitle>
          <CardDescription>
            Insira os valores da nota para calcular a Substituição Tributária.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <FormField control={form.control} name="ncm" render={({ field }) => (
                  <FormItem>
                    <FormLabel>NCM</FormLabel>
                    <FormControl><Input placeholder="84439933" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="valorMercadoria" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vlr. Mercadoria *</FormLabel>
                    <div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="1.000,00" className="pl-9" {...field} /></FormControl></div>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="aliqIcms" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alíq. ICMS *</FormLabel>
                    <div className="relative"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="12,00" className="pl-9" {...field} /></FormControl></div>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="mva" render={({ field }) => (
                  <FormItem>
                    <FormLabel>IVA/MVA *</FormLabel>
                    <div className="relative"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="29,00" className="pl-9" {...field} /></FormControl></div>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="aliqIcmsSt" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alíq. ICMS ST *</FormLabel>
                    <div className="relative"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="18,00" className="pl-9" {...field} /></FormControl></div>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="valorFrete" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Frete</FormLabel>
                    <div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="0,00" className="pl-9" {...field} /></FormControl></div>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="aliqIpi" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alíquota IPI</FormLabel>
                    <div className="relative"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="0,00" className="pl-9" {...field} /></FormControl></div>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="redBaseSt" render={({ field }) => (
                   <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Redução Base ST (%)
                      <TooltipProvider>
                        <Tooltip><TooltipTrigger type="button"><Info className="h-3 w-3 text-muted-foreground" /></TooltipTrigger>
                          <TooltipContent><p>Ex: Alíquota interna de 18% com redução para 12%, a redução é de 33.33%.</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <div className="relative"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="33,33" className="pl-9" {...field} /></FormControl></div>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </CardContent>
            <CardFooter className="gap-4">
              <Button type="submit" className="w-full sm:w-auto flex-1 bg-gradient-to-r from-accent to-primary text-white font-bold">
                <Calculator className="mr-2 h-4 w-4" />
                Calcular
              </Button>
              <Button type="button" variant="outline" onClick={handleClear} className="w-full sm:w-auto">
                <RotateCw className="mr-2 h-4 w-4" />
                Limpar
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {result && (
        <section className="w-full max-w-4xl mx-auto animate-in fade-in-50 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-headline">Resultados do Cálculo</h2>
            <Button variant="outline" onClick={handleExportToPdf}>
              <FileDown className="mr-2 h-4 w-4" />
              Exportar para PDF
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard title="Base de Cálculo ST" value={result.baseSt} />
            <ResultCard title="Valor do ICMS-ST" value={result.valorSt} isPrimary />
            <ResultCard title="Base PIS/COFINS" value={result.basePisCofins} />
            <ResultCard title="Valor Total da Nota" value={result.valorTotalNota} isPrimary />
          </div>
        </section>
      )}

      <Card className="w-full max-w-4xl mx-auto shadow-lg border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-headline">
            <Wand2 className="h-6 w-6 text-primary" />
            Calculadora de IVA/MVA Ajustado
          </CardTitle>
          <CardDescription>
            Descubra o valor do IVA/MVA ajustado para operações interestaduais.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="ivaOriginal">IVA/MVA Original (%)</Label>
              <div className="relative mt-2">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="ivaOriginal" placeholder="29,00" className="pl-9" value={ivaOriginal} onChange={(e) => setIvaOriginal(e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="aliqInter">Alíquota Interestadual (%)</Label>
              <div className="relative mt-2">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="aliqInter" placeholder="12" className="pl-9" value={aliqInter} onChange={(e) => setAliqInter(e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="aliqInterna">Alíquota Interna (%)</Label>
              <div className="relative mt-2">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="aliqInterna" placeholder="12" className="pl-9" value={aliqInterna} onChange={(e) => setAliqInterna(e.target.value)} />
              </div>
            </div>
          </div>
          {ivaAjustado !== null && (
              <div className="pt-6 text-center animate-in fade-in-50 duration-500">
                   <Label className="text-sm font-medium text-muted-foreground">Resultado do IVA Ajustado</Label>
                   <p className="text-4xl font-bold text-primary">{ivaAjustado.toFixed(2).replace('.', ',')}%</p>
              </div>
          )}
        </CardContent>
        <CardFooter className="gap-4">
            <Button onClick={handleIvaCalculation} className="w-full sm:w-auto flex-1 bg-gradient-to-r from-accent to-primary text-white font-bold">
                <Calculator className="mr-2 h-4 w-4" />
                Calcular IVA Ajustado
            </Button>
            <Button type="button" variant="outline" onClick={handleIvaClear} className="w-full sm:w-auto">
                <RotateCw className="mr-2 h-4 w-4" />
                Limpar
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
