
"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Building, ShoppingCart, ArrowRight, Package, Anchor, HelpCircle, ShieldCheck, RotateCw } from "lucide-react";
import type { TesCode } from "@/lib/definitions";
import { findTesCodes } from "@/lib/tes-data";
import { TesResults } from "@/components/tes-results";

type Company = "matriz" | "filial_es";
type Operation = "compra" | "venda";
type SaleType = "normal" | "zfm";

export default function PesquisaTesPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [saleType, setSaleType] = useState<SaleType | null>(null);
  const [hasSuframa, setHasSuframa] = useState<boolean | null>(null);
  const [hasSt, setHasSt] = useState<boolean | null>(null);
  
  const [showResults, setShowResults] = useState(false);
  const [tesResults, setTesResults] = useState<TesCode[]>([]);

  const handleCompanyChange = (value: Company) => {
    setCompany(value);
    setOperation(null);
    setSaleType(null);
    setHasSuframa(null);
    setHasSt(null);
  };

  const handleOperationChange = (value: Operation) => {
    setOperation(value);
    setSaleType(null);
    setHasSuframa(null);
    setHasSt(null);
  };

  const handleSaleTypeChange = (value: SaleType) => {
    setSaleType(value);
    setHasSuframa(null);
  };
  
  const handleSearch = () => {
    if (company === 'filial_es' && operation === 'compra') {
      const results = findTesCodes('filial_es', 'compra');
      if (results) {
        setTesResults(results);
        setShowResults(true);
      }
    }
    // Placeholder for other search logic
  };

  const handleReset = () => {
    setCompany(null);
    setOperation(null);
    setSaleType(null);
    setHasSuframa(null);
    setHasSt(null);
    setShowResults(false);
    setTesResults([]);
  };

  const isSearchDisabled = (() => {
    if (!company || !operation) return true;
    if (operation === "venda") {
      if (!saleType) return true;
      if (saleType === "zfm" && hasSuframa === null) return true;
    }
    if (company === 'matriz' && operation === "compra") {
        if (hasSt === null) return true;
    }
    return false;
  })();

  if (showResults) {
    return (
       <>
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
            <div className="flex justify-end mb-4">
                <Button variant="outline" onClick={handleReset}>
                    <RotateCw className="mr-2 h-4 w-4" />
                    Nova Pesquisa
                </Button>
            </div>
            <TesResults
                results={tesResults}
                title="Resultado da Pesquisa de TES"
                description={`Exibindo resultados para ${company === 'filial_es' ? 'Filial ES' : 'Matriz'} - ${operation === 'compra' ? 'Compra' : 'Venda'}`}
            />
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center text-center gap-4 mb-8">
            <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-xl">
                <Search className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight font-headline text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
              Pesquisa de TES
            </h1>
            <p className="max-w-md text-muted-foreground">
              Inicie a pesquisa selecionando a empresa e o tipo de operação.
            </p>
        </div>
        <Card className="max-w-2xl mx-auto shadow-lg border">
          <CardHeader>
            <CardTitle>Passo 1: Seleção Inicial</CardTitle>
            <CardDescription>
              Defina a empresa e a operação para encontrar o TES correto.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-semibold text-lg">
                    <Building className="h-5 w-5 text-primary" />
                    Qual a empresa?
                </h3>
                <RadioGroup 
                    onValueChange={(value) => handleCompanyChange(value as Company)} 
                    value={company ?? ""}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    <Label htmlFor="matriz" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                         <RadioGroupItem value="matriz" id="matriz" className="sr-only" />
                         <span className="text-base font-semibold">Matriz</span>
                    </Label>
                    <Label htmlFor="filial_es" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                        <RadioGroupItem value="filial_es" id="filial_es" className="sr-only" />
                        <span className="text-base font-semibold">Filial ES</span>
                    </Label>
                </RadioGroup>
            </div>

            {company && (
                 <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold text-lg">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        Qual a operação?
                    </h3>
                    <RadioGroup 
                        onValueChange={(value) => handleOperationChange(value as Operation)} 
                        value={operation ?? ""}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                        <Label htmlFor="compra" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                             <RadioGroupItem value="compra" id="compra" className="sr-only" />
                             <span className="text-base font-semibold">Compra</span>
                        </Label>
                        <Label htmlFor="venda" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                            <RadioGroupItem value="venda" id="venda" className="sr-only" />
                            <span className="text-base font-semibold">Venda</span>
                        </Label>
                    </RadioGroup>
                </div>
            )}
            
            {operation === 'venda' && (
                 <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold text-lg">
                        <Package className="h-5 w-5 text-primary" />
                        Qual o tipo de venda?
                    </h3>
                    <RadioGroup 
                        onValueChange={(value) => handleSaleTypeChange(value as SaleType)} 
                        value={saleType ?? ""}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                        <Label htmlFor="normal" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                             <RadioGroupItem value="normal" id="normal" className="sr-only" />
                             <span className="text-base font-semibold">Normal</span>
                        </Label>
                        <Label htmlFor="zfm" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                            <RadioGroupItem value="zfm" id="zfm" className="sr-only" />
                            <span className="text-base font-semibold">ZFM (Zona Franca)</span>
                        </Label>
                    </RadioGroup>
                </div>
            )}

            {saleType === 'zfm' && (
                 <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold text-lg">
                        <Anchor className="h-5 w-5 text-primary" />
                        Possui SUFRAMA?
                    </h3>
                    <RadioGroup 
                        onValueChange={(value) => setHasSuframa(value === 'true')} 
                        value={hasSuframa === null ? '' : String(hasSuframa)}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                        <Label htmlFor="suframa_sim" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                             <RadioGroupItem value="true" id="suframa_sim" className="sr-only" />
                             <span className="text-base font-semibold">Sim</span>
                        </Label>
                        <Label htmlFor="suframa_nao" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                            <RadioGroupItem value="false" id="suframa_nao" className="sr-only" />
                            <span className="text-base font-semibold">Não</span>
                        </Label>
                    </RadioGroup>
                </div>
            )}

            {company === 'matriz' && operation === 'compra' && (
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-semibold text-lg">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span>Possui ST (Substituição Tributária)?</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">Ramal: 7806 ou 7542 (Fiscal)</p>
                        <p className="text-sm text-muted-foreground">Obs: Informe o NCM para saber</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h3>
                <RadioGroup 
                  onValueChange={(value) => setHasSt(value === 'true')} 
                  value={hasSt === null ? '' : String(hasSt)}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <Label htmlFor="st_sim" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                    <RadioGroupItem value="true" id="st_sim" className="sr-only" />
                    <span className="text-base font-semibold">Sim</span>
                  </Label>
                  <Label htmlFor="st_nao" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                    <RadioGroupItem value="false" id="st_nao" className="sr-only" />
                    <span className="text-base font-semibold">Não</span>
                  </Label>
                </RadioGroup>
              </div>
            )}
            
            <Button size="lg" className="w-full bg-gradient-to-r from-accent to-primary text-white" disabled={isSearchDisabled} onClick={handleSearch}>
                Pesquisar
                <ArrowRight className="ml-2 h-5 w-5"/>
            </Button>

          </CardContent>
        </Card>
      </main>
    </>
  );
}
