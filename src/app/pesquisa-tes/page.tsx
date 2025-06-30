
"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Building, ShoppingCart, ArrowRight, Package, Anchor, HelpCircle, ShieldCheck, RotateCw, ClipboardList, Globe, UserSquare } from "lucide-react";
import type { TesCode, SalePurpose, Company, ContributorType } from "@/lib/definitions";
import { findCompraTesCodes, findVendaTesCodes, findVendaNormalTes } from "@/lib/tes-data";
import { TesResults } from "@/components/tes-results";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { taxRates } from "@/lib/tax-data";

type Operation = "compra" | "venda";
type SaleType = "normal" | "zfm";

export default function PesquisaTesPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [salePurpose, setSalePurpose] = useState<SalePurpose | null>(null);
  const [saleType, setSaleType] = useState<SaleType | null>(null);
  const [hasSuframa, setHasSuframa] = useState<boolean | null>(null);
  const [hasSt, setHasSt] = useState<boolean | null>(null);
  const [destinationState, setDestinationState] = useState<string | null>(null);
  const [contributorType, setContributorType] = useState<ContributorType | null>(null);
  
  const [showResults, setShowResults] = useState(false);
  const [tesResults, setTesResults] = useState<TesCode[]>([]);

  const resetSubsequentSelections = (level: number) => {
    if (level <= 1) setOperation(null);
    if (level <= 2) setSalePurpose(null);
    if (level <= 3) setSaleType(null);
    if (level <= 4) {
      setHasSuframa(null);
      setDestinationState(null);
      setContributorType(null);
    }
    if (level <= 5) setHasSt(null);
  }

  const handleCompanyChange = (value: Company) => {
    setCompany(value);
    resetSubsequentSelections(1);
  };

  const handleOperationChange = (value: Operation) => {
    setOperation(value);
    resetSubsequentSelections(2);
  };

  const handleSalePurposeChange = (value: SalePurpose) => {
    setSalePurpose(value);
    resetSubsequentSelections(3);
  };

  const handleSaleTypeChange = (value: SaleType) => {
    setSaleType(value);
    resetSubsequentSelections(4);
  };

  const handleDestinationStateChange = (value: string) => {
    setDestinationState(value);
    resetSubsequentSelections(5);
  };
  
  const handleSearch = () => {
    let results: TesCode[] | undefined = [];
    if (company && operation) {
        if (operation === 'compra') {
            if (company === 'filial_es') {
                results = findCompraTesCodes('filial_es');
            }
        } else if (operation === 'venda' && salePurpose && saleType) {
            if (saleType === 'normal' && destinationState && contributorType) {
                results = findVendaNormalTes(company, salePurpose, destinationState, contributorType, hasSt);
            } else if (saleType === 'zfm') {
                results = findVendaTesCodes(company, salePurpose, saleType, hasSuframa);
            }
        }
    }
    
    if (results) {
      setTesResults(results);
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setCompany(null);
    setShowResults(false);
    setTesResults([]);
    resetSubsequentSelections(1);
  };

  const showStQuestionForMatrizVenda = company === 'matriz' && operation === 'venda' && salePurpose === 'revenda' && saleType === 'normal' && destinationState;
  const isStQuestionRequired = showStQuestionForMatrizVenda && taxRates.find(r => r.destinationStateCode === destinationState)?.protocol;

  const isSearchDisabled = (() => {
    if (!company || !operation) return true;
    if (operation === 'compra') {
        if (company === 'matriz' && hasSt === null) return true;
        if (company === 'filial_es') return false;
    }
    if (operation === 'venda') {
      if (!salePurpose || !saleType) return true;
      if (saleType === 'zfm') {
          if (salePurpose === 'consumo') return false;
          if (salePurpose === 'revenda' && hasSuframa === null) return true;
      }
      if (saleType === 'normal') {
        if (!destinationState || !contributorType) return true;
        if (company === 'matriz' && isStQuestionRequired && hasSt === null) return true;
      }
    }
    
    return false;
  })();

  if (showResults) {
    return (
       <>
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Resultado da Pesquisa</h2>
                <Button variant="outline" onClick={handleReset}>
                    <RotateCw className="mr-2 h-4 w-4" />
                    Nova Pesquisa
                </Button>
            </div>
            <TesResults
                results={tesResults}
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
            <CardTitle>Passo a Passo: Seleção de Critérios</CardTitle>
            <CardDescription>
              Defina os critérios para encontrar o TES correto para sua operação.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Step 1: Company */}
            <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-semibold text-lg">
                    <Building className="h-5 w-5 text-primary" />
                    1. Qual a empresa?
                </h3>
                <RadioGroup onValueChange={handleCompanyChange} value={company ?? ""} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {/* Step 2: Operation */}
            {company && (
                 <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold text-lg">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        2. Qual a operação?
                    </h3>
                    <RadioGroup onValueChange={handleOperationChange} value={operation ?? ""} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            
            {/* Compra Flow */}
            {company === 'matriz' && operation === 'compra' && (
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-semibold text-lg"><ShieldCheck className="h-5 w-5 text-primary" /><span>3. Possui ST (Substituição Tributária)?</span></h3>
                <RadioGroup onValueChange={(value) => setHasSt(value === 'true')} value={hasSt === null ? '' : String(hasSt)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Label htmlFor="st_sim" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                    <RadioGroupItem value="true" id="st_sim" className="sr-only" /><span className="text-base font-semibold">Sim</span>
                  </Label>
                  <Label htmlFor="st_nao" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                    <RadioGroupItem value="false" id="st_nao" className="sr-only" /><span className="text-base font-semibold">Não</span>
                  </Label>
                </RadioGroup>
              </div>
            )}

            {/* Venda Flow */}
            {operation === 'venda' && (
                 <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold text-lg"><ClipboardList className="h-5 w-5 text-primary" />3. Qual a finalidade?</h3>
                    <RadioGroup onValueChange={handleSalePurposeChange} value={salePurpose ?? ""} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Label htmlFor="revenda" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                             <RadioGroupItem value="revenda" id="revenda" className="sr-only" /><span className="text-base font-semibold">Para Revenda</span>
                        </Label>
                        <Label htmlFor="consumo" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                            <RadioGroupItem value="consumo" id="consumo" className="sr-only" /><span className="text-base font-semibold">Para Consumo</span>
                        </Label>
                    </RadioGroup>
                </div>
            )}

            {operation === 'venda' && salePurpose && (
                 <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold text-lg"><Package className="h-5 w-5 text-primary" />4. Qual o tipo de venda?</h3>
                    <RadioGroup onValueChange={handleSaleTypeChange} value={saleType ?? ""} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Label htmlFor="normal" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                             <RadioGroupItem value="normal" id="normal" className="sr-only" /><span className="text-base font-semibold">Normal</span>
                        </Label>
                        <Label htmlFor="zfm" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                            <RadioGroupItem value="zfm" id="zfm" className="sr-only" /><span className="text-base font-semibold">ZFM (Zona Franca)</span>
                        </Label>
                    </RadioGroup>
                </div>
            )}

            {/* Venda -> ZFM Flow */}
            {operation === 'venda' && salePurpose === 'revenda' && saleType === 'zfm' && (
                 <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold text-lg"><Anchor className="h-5 w-5 text-primary" />5. Possui SUFRAMA?</h3>
                    <RadioGroup onValueChange={(value) => setHasSuframa(value === 'true')} value={hasSuframa === null ? '' : String(hasSuframa)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Label htmlFor="suframa_sim" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                             <RadioGroupItem value="true" id="suframa_sim" className="sr-only" /><span className="text-base font-semibold">Sim</span>
                        </Label>
                        <Label htmlFor="suframa_nao" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                            <RadioGroupItem value="false" id="suframa_nao" className="sr-only" /><span className="text-base font-semibold">Não</span>
                        </Label>
                    </RadioGroup>
                </div>
            )}
            
            {/* Venda -> Normal Flow */}
            {operation === 'venda' && saleType === 'normal' && (
                <>
                <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold text-lg"><Globe className="h-5 w-5 text-primary" />5. Qual o estado de destino?</h3>
                    <Select onValueChange={handleDestinationStateChange} value={destinationState ?? ""}>
                        <SelectTrigger><SelectValue placeholder="Selecione um estado" /></SelectTrigger>
                        <SelectContent>
                           {taxRates.map(state => <SelectItem key={state.destinationStateCode} value={state.destinationStateCode}>{state.destinationStateName}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold text-lg"><UserSquare className="h-5 w-5 text-primary" />6. Qual o tipo de cliente?</h3>
                    <RadioGroup onValueChange={(value) => setContributorType(value as ContributorType)} value={contributorType ?? ""} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Label htmlFor="contribuinte" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                             <RadioGroupItem value="contribuinte" id="contribuinte" className="sr-only" /><span className="text-base font-semibold">Contribuinte</span>
                        </Label>
                        <Label htmlFor="isento" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                            <RadioGroupItem value="isento" id="isento" className="sr-only" /><span className="text-base font-semibold">Isento / Não Contribuinte</span>
                        </Label>
                    </RadioGroup>
                </div>
                </>
            )}

            {company === 'matriz' && showStQuestionForMatrizVenda && isStQuestionRequired && (
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-semibold text-lg"><ShieldCheck className="h-5 w-5 text-primary" />7. Possui ST (Substituição Tributária)?</h3>
                <RadioGroup onValueChange={(value) => setHasSt(value === 'true')} value={hasSt === null ? '' : String(hasSt)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Label htmlFor="st_sim_venda" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                    <RadioGroupItem value="true" id="st_sim_venda" className="sr-only" /><span className="text-base font-semibold">Sim</span>
                  </Label>
                  <Label htmlFor="st_nao_venda" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all">
                    <RadioGroupItem value="false" id="st_nao_venda" className="sr-only" /><span className="text-base font-semibold">Não</span>
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
