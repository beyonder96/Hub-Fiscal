
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IcmsStFormData } from "@/lib/definitions";
import { icmsStSchema } from "@/lib/definitions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calculator, RotateCw, Info, Percent, DollarSign } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

interface CalculationResult {
  baseSt: number;
  valorSt: number;
  valorTotalNota: number;
  basePisCofins: number;
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

  const form = useForm<IcmsStFormData>({
    resolver: zodResolver(icmsStSchema),
    defaultValues: {
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

    // Round intermediate tax values, as is common in fiscal systems
    const valorIpi = parseFloat((valorMercadoria * (aliqIpi / 100)).toFixed(2));
    const baseIcms = valorMercadoria;
    const valorIcms = parseFloat((baseIcms * (aliqIcms / 100)).toFixed(2));
    
    const baseStSemReducao = (valorMercadoria + valorFrete + valorIpi) * (1 + mva / 100);
    // Round the ST base before using it
    const baseSt = parseFloat((baseStSemReducao * (1 - redBaseSt / 100)).toFixed(2));
    
    const valorStBruto = (baseSt * (aliqIcmsSt / 100)) - valorIcms;
    const valorSt = valorStBruto > 0 ? parseFloat(valorStBruto.toFixed(2)) : 0;

    const valorTotalNota = valorMercadoria + valorFrete + valorIpi + valorSt;
    
    // Corrected formula for PIS/COFINS base, including IPI
    const basePisCofins = valorMercadoria + valorIpi - valorIcms;

    setResult({
      baseSt,
      valorSt,
      valorTotalNota,
      basePisCofins,
    });
  };

  const handleClear = () => {
    form.reset();
    setResult(null);
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
                      Redução Base ST
                      <TooltipProvider>
                        <Tooltip><TooltipTrigger type="button"><Info className="h-3 w-3 text-muted-foreground" /></TooltipTrigger>
                          <TooltipContent><p>Informe o percentual de redução da base de cálculo do ICMS-ST.</p></TooltipContent>
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
          <h2 className="text-2xl font-bold text-center mb-6 font-headline">Resultados do Cálculo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard title="Base de Cálculo ST" value={result.baseSt} />
            <ResultCard title="Valor do ICMS-ST" value={result.valorSt} isPrimary />
            <ResultCard title="Base PIS/COFINS" value={result.basePisCofins} />
            <ResultCard title="Valor Total da Nota" value={result.valorTotalNota} isPrimary />
          </div>
        </section>
      )}
    </div>
  );
}
