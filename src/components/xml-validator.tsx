
"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { ValidationResult, ValidationHistoryItem, NfeData, NfeInputType, ValidationMessage, NfeProductData, CalculationValidation, ValidationState } from "@/lib/definitions";
import { NfeInputTypes } from "@/lib/definitions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileCode, Upload, CheckCircle2, XCircle, AlertTriangle, FileDown, Trash2, History, Info } from "lucide-react";

const MAX_HISTORY_ITEMS = 15;
const MAX_FILES = 15;

const getTagValue = (element: Element | null, tagName: string): string | undefined => element?.querySelector(tagName)?.textContent || undefined;

const parseNfeXml = (xmlDoc: Document, fileName: string): NfeData => {
  const ide = xmlDoc.querySelector('ide');
  const emit = xmlDoc.querySelector('emit');
  const dest = xmlDoc.querySelector('dest');
  const icmsTot = xmlDoc.querySelector('ICMSTot');

  const products: NfeProductData[] = Array.from(xmlDoc.querySelectorAll('det')).map(det => {
    const prod = det.querySelector('prod');
    const imposto = det.querySelector('imposto');
    const icms = imposto?.querySelector('ICMS')?.firstElementChild;
    const ipi = imposto?.querySelector('IPI');
    const ipiTrib = ipi?.querySelector('IPITrib');
    const icmsSt = icms?.tagName === 'ICMSST' ? icms : imposto?.querySelector('ICMS > ICMSST, ICMS > * > ICMSST');

    const orig = getTagValue(icms ?? null, 'orig');
    const cstNum = getTagValue(icms ?? null, 'CST') || getTagValue(icms ?? null, 'CSOSN');

    return {
      item: det.getAttribute('nItem') || 'N/A',
      cProd: getTagValue(prod, 'cProd'),
      xProd: getTagValue(prod, 'xProd'),
      cfop: getTagValue(prod, 'CFOP'),
      cst: `${orig || ''}${cstNum || ''}`,
      vProd: getTagValue(prod, 'vProd'),
      vFrete: getTagValue(prod, 'vFrete'),
      icms: {
        vBC: getTagValue(icms, 'vBC'),
        pICMS: getTagValue(icms, 'pICMS'),
        vICMS: getTagValue(icms, 'vICMS'),
        pRedBC: getTagValue(icms, 'pRedBC'),
      },
      ipi: {
        cst: getTagValue(ipi, 'CST'),
        vBC: getTagValue(ipiTrib, 'vBC'),
        pIPI: getTagValue(ipiTrib, 'pIPI'),
        vIPI: getTagValue(ipiTrib, 'vIPI'),
      },
      icmsSt: {
        vBCST: getTagValue(icmsSt, 'vBCST'),
        pMVAST: getTagValue(icmsSt, 'pMVAST'),
        pICMSST: getTagValue(icmsSt, 'pICMSST'),
        vICMSST: getTagValue(icmsSt, 'vICMSST'),
      }
    };
  });

  return {
    fileName,
    versao: xmlDoc.querySelector('nfeProc')?.getAttribute('versao') || 'N/A',
    chave: xmlDoc.querySelector('infNFe')?.getAttribute('Id')?.replace('NFe', ''),
    emitCnpj: getTagValue(emit, 'CNPJ'),
    emitRazaoSocial: getTagValue(emit, 'xNome'),
    emitUf: getTagValue(emit, 'UF'),
    emitCrt: getTagValue(emit, 'CRT'),
    destCnpj: getTagValue(dest, 'CNPJ'),
    destRazaoSocial: getTagValue(dest, 'xNome'),
    destUf: getTagValue(dest, 'UF'),
    nNf: getTagValue(ide, 'nNF'),
    dhEmi: getTagValue(ide, 'dhEmi'),
    vNF: getTagValue(icmsTot, 'vNF'),
    vFrete: getTagValue(icmsTot, 'vFrete'),
    total: {
      vBC: getTagValue(icmsTot, 'vBC'),
      vICMS: getTagValue(icmsTot, 'vICMS'),
      vBCST: getTagValue(icmsTot, 'vBCST'),
      vST: getTagValue(icmsTot, 'vST'),
      vIPI: getTagValue(icmsTot, 'vIPI'),
    },
    products,
  };
};

const runValidations = (data: NfeData, inputType: NfeInputType): ValidationResult['calculationValidations'] => {
    const validations: ValidationResult['calculationValidations'] = {
        vBC: { check: 'not_applicable', message: 'Cálculo não realizado.' },
        vICMS: { check: 'not_applicable', message: 'Cálculo não realizado.' },
        vIPI: { check: 'not_applicable', message: 'Cálculo não realizado.' },
        vBCST: { check: 'not_applicable', message: 'Cálculo não realizado.' },
        vICMSST: { check: 'not_applicable', message: 'Cálculo não realizado.' },
    };
    
    const tolerance = 0.02;

    // vBC
    const totalProd = data.products.reduce((acc, p) => acc + parseFloat(p.vProd || '0'), 0);
    const totalFrete = parseFloat(data.vFrete || '0');
    const totalIPI = parseFloat(data.total.vIPI || '0');
    let expectedVBC = totalProd + totalFrete;
    if (inputType === 'Consumo') {
        expectedVBC += totalIPI;
    }
    const actualVBC = parseFloat(data.total.vBC || '0');
    if (!isNaN(actualVBC) && !isNaN(expectedVBC)) {
        if (Math.abs(expectedVBC - actualVBC) < tolerance) {
            validations.vBC = { check: 'valid', message: `Base de Cálculo (R$ ${actualVBC.toFixed(2)}) validada.` };
        } else {
            validations.vBC = { check: 'divergent', message: `Base de Cálculo divergente. Esperado: R$ ${expectedVBC.toFixed(2)}, Encontrado: R$ ${actualVBC.toFixed(2)}.` };
        }
    }

    // vICMS
    const sumProductVIcms = data.products.reduce((acc, p) => acc + parseFloat(p.icms.vICMS || '0'), 0);
    const actualTotalVIcms = parseFloat(data.total.vICMS || '0');
    if (!isNaN(actualTotalVIcms) && sumProductVIcms > 0) {
        if (Math.abs(sumProductVIcms - actualTotalVIcms) < tolerance) {
            validations.vICMS = { check: 'valid', message: `Valor do ICMS (R$ ${actualTotalVIcms.toFixed(2)}) validado.` };
        } else {
            validations.vICMS = { check: 'divergent', message: `Soma do vICMS dos produtos (R$ ${sumProductVIcms.toFixed(2)}) diverge do total (R$ ${actualTotalVIcms.toFixed(2)}).` };
        }
    }
    
    // vIPI
    const sumProductVIpi = data.products.reduce((acc, p) => acc + parseFloat(p.ipi.vIPI || '0'), 0);
    const actualTotalVIpi = parseFloat(data.total.vIPI || '0');
    if (!isNaN(actualTotalVIpi) && sumProductVIpi > 0) {
      if (Math.abs(sumProductVIpi - actualTotalVIpi) < tolerance) {
        validations.vIPI = { check: 'valid', message: `Valor do IPI (R$ ${actualTotalVIpi.toFixed(2)}) validado.` };
      } else {
        validations.vIPI = { check: 'divergent', message: `Soma do vIPI dos produtos (R$ ${sumProductVIpi.toFixed(2)}) diverge do total (R$ ${actualTotalVIpi.toFixed(2)}).` };
      }
    }

    // vBCST and vICMSST
    const sumProductVBCST = data.products.reduce((acc, p) => acc + parseFloat(p.icmsSt.vBCST || '0'), 0);
    const actualTotalVBCST = parseFloat(data.total.vBCST || '0');
     if (!isNaN(actualTotalVBCST) && sumProductVBCST > 0) {
        if (Math.abs(sumProductVBCST - actualTotalVBCST) < tolerance) {
            validations.vBCST = { check: 'valid', message: `Base de Cálculo ST (R$ ${actualTotalVBCST.toFixed(2)}) validada.` };
        } else {
            validations.vBCST = { check: 'divergent', message: `Soma do vBCST dos produtos (R$ ${sumProductVBCST.toFixed(2)}) diverge do total (R$ ${actualTotalVBCST.toFixed(2)}).` };
        }
    }
    
    const sumProductVICMSST = data.products.reduce((acc, p) => acc + parseFloat(p.icmsSt.vICMSST || '0'), 0);
    const actualTotalVICMSST = parseFloat(data.total.vST || '0');
     if (!isNaN(actualTotalVICMSST) && sumProductVICMSST > 0) {
        if (Math.abs(sumProductVICMSST - actualTotalVICMSST) < tolerance) {
            validations.vICMSST = { check: 'valid', message: `Valor do ICMS-ST (R$ ${actualTotalVICMSST.toFixed(2)}) validado.` };
        } else {
            validations.vICMSST = { check: 'divergent', message: `Soma do vICMSST dos produtos (R$ ${sumProductVICMSST.toFixed(2)}) diverge do total (R$ ${actualTotalVICMSST.toFixed(2)}).` };
        }
    }

    return validations;
}

const processNfeFile = (xmlString: string, fileName: string, inputType: NfeInputType): ValidationResult => {
    const id = `${fileName}-${new Date().getTime()}`;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    const parserError = xmlDoc.querySelector("parsererror");

    const baseResult = {
        id,
        fileName,
        selectedInputType: inputType,
        nfeData: null,
        messages: [] as ValidationMessage[],
        calculationValidations: {
            vBC: { check: 'not_applicable', message: '' },
            vICMS: { check: 'not_applicable', message: '' },
            vIPI: { check: 'not_applicable', message: '' },
            vBCST: { check: 'not_applicable', message: '' },
            vICMSST: { check: 'not_applicable', message: '' },
        }
    };

    if (parserError) {
        return {
            ...baseResult,
            status: 'error',
            messages: [{ type: 'error', message: 'Erro de sintaxe XML.', details: parserError.textContent || "O arquivo não é um XML bem formado." }],
        };
    }

    if (!xmlDoc.querySelector("nfeProc")) {
         return {
            ...baseResult,
            status: 'error',
            messages: [{ type: 'error', message: 'Estrutura inválida.', details: 'A tag raiz <nfeProc> não foi encontrada.' }],
        };
    }

    const nfeData = parseNfeXml(xmlDoc, fileName);
    const calculationValidations = runValidations(nfeData, inputType);
    
    // Simple structural message for now
    const messages: ValidationMessage[] = [{ type: 'success', message: 'Arquivo XML lido com sucesso.' }];

    const hasDivergence = Object.values(calculationValidations).some(v => v.check === 'divergent');

    return {
        ...baseResult,
        status: 'success',
        nfeData,
        messages,
        calculationValidations
    };
}

const ValidationStatusDisplay = ({ validation }: { validation: CalculationValidation }) => {
    if (validation.check === 'not_applicable') {
        return <p className="text-sm text-muted-foreground">Não aplicável</p>;
    }
    const isDivergent = validation.check === 'divergent';
    return (
        <div className={`p-3 rounded-lg ${isDivergent ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
            <div className={`flex items-center gap-2 font-bold ${isDivergent ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>
                {isDivergent ? <XCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                <span>{isDivergent ? 'Divergente' : 'Validada'}</span>
            </div>
            <p className="text-xs mt-1">{validation.message}</p>
        </div>
    );
};

export function XmlValidator() {
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [history, setHistory] = useState<ValidationHistoryItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("xmlValidationHistory");
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load validation history:", error);
    }
  }, []);

  const saveToHistory = (newResult: ValidationResult) => {
    if (newResult.status !== 'success' || !newResult.nfeData) return;

    const hasDivergence = Object.values(newResult.calculationValidations).some(v => v.check === 'divergent');

    const historyItem: ValidationHistoryItem = {
      id: newResult.id,
      fileName: newResult.fileName,
      date: new Date().toISOString(),
      status: newResult.status,
      overallValidation: hasDivergence ? 'Divergente' : 'Validada',
      icmsStStatus: newResult.calculationValidations.vICMSST.check
    };

    setHistory(prevHistory => {
      const updatedHistory = [historyItem, ...prevHistory].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem("xmlValidationHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (files.length > MAX_FILES) {
        toast({ variant: "destructive", title: "Limite excedido", description: `Por favor, selecione no máximo ${MAX_FILES} arquivos.` });
        return;
    }

    const newResultsPromises: Promise<ValidationResult | null>[] = Array.from(files).map(file => {
      return new Promise((resolve) => {
        if (file.type === "text/xml" || file.name.endsWith(".xml")) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const content = evt.target?.result as string;
            const validation = processNfeFile(content, file.name, 'Revenda');
            resolve(validation);
          };
          reader.onerror = () => {
            toast({ variant: "destructive", title: "Erro de Leitura", description: `Não foi possível ler o arquivo '${file.name}'.` });
            resolve(null);
          };
          reader.readAsText(file);
        } else {
          toast({ variant: "destructive", title: "Arquivo inválido", description: `O arquivo '${file.name}' não é um XML.` });
          resolve(null);
        }
      });
    });

    Promise.all(newResultsPromises).then(newResults => {
        const validResults = newResults.filter((r): r is ValidationResult => r !== null);
        validResults.forEach(saveToHistory);
        setResults(validResults);
    });
  };
  
  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isEntering);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    const files = e.dataTransfer.files;
    handleFileChange(files);
  };

  const updateResultInputType = (id: string, inputType: NfeInputType) => {
    setResults(prev => prev.map(r => {
      if (r.id !== id || !r.nfeData) return r;
      
      const newCalculations = runValidations(r.nfeData, inputType);
      
      return { 
        ...r, 
        selectedInputType: inputType,
        calculationValidations: newCalculations
      };
    }));
  };

  const exportToCsv = () => {
    if (results.length === 0) {
      toast({ title: "Nenhum dado para exportar." });
      return;
    }
    const dataToExport = results.flatMap(r => 
        r.nfeData?.products.map(p => ({
            "Arquivo": r.fileName,
            "Tipo de Entrada": r.selectedInputType,
            "Chave NFe": r.nfeData?.chave,
            "Número Nota": r.nfeData?.nNf,
            "Data Emissão": r.nfeData?.dhEmi ? format(new Date(r.nfeData.dhEmi), "dd/MM/yyyy HH:mm:ss") : "",
            "Item": p.item,
            "Produto": p.xProd,
            "CFOP": p.cfop,
            "CST": p.cst,
            "Valor Produto": p.vProd,
            "Base ICMS": p.icms.vBC,
            "Alíquota ICMS": p.icms.pICMS,
            "Valor ICMS": p.icms.vICMS,
            "Base IPI": p.ipi.vBC,
            "Alíquota IPI": p.ipi.pIPI,
            "Valor IPI": p.ipi.vIPI,
            "Base ICMS-ST": p.icmsSt.vBCST,
            "MVA-ST": p.icmsSt.pMVAST,
            "Alíquota ICMS-ST": p.icmsSt.pICMSST,
            "Valor ICMS-ST": p.icmsSt.vICMSST,
        })) || []
    );

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "relatorio_validacao_nfe_produtos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("xmlValidationHistory");
    toast({ title: "Histórico limpo." });
  };
  
  const statusMap = {
    error: { icon: XCircle, color: "text-destructive", badge: "destructive", label: "Erro"},
    warning: { icon: AlertTriangle, color: "text-amber-500", badge: "secondary", label: "Aviso"},
    success: { icon: CheckCircle2, color: "text-green-500", badge: "outline", label: "Válido"},
    info: { icon: Info, color: "text-blue-500", badge: "default", label: "Info"}
  };

  const formatPercent = (value?: string) => {
    const num = parseFloat(value || '0');
    return !isNaN(num) ? `${num.toFixed(2)}%` : 'N/A';
  }

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-lg border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-headline">
          <FileCode className="h-6 w-6 text-primary" />
          Validador Fiscal de NFe
        </CardTitle>
        <CardDescription>
          Arraste e solte até 15 arquivos XML para uma validação fiscal completa, incluindo regras e cálculos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => handleDragEvents(e, true)}
          onDragEnter={(e) => handleDragEvents(e, true)}
          onDragLeave={(e) => handleDragEvents(e, false)}
          className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-border'}`}
        >
          <Upload className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Arraste e solte arquivos XML aqui</p>
          <p className="text-sm text-muted-foreground">- ou -</p>
          <Button asChild variant="outline" className="mt-2">
            <label>
              Procurar Arquivos
              <input type="file" multiple accept=".xml,text/xml" className="sr-only" onChange={(e) => handleFileChange(e.target.files)} />
            </label>
          </Button>
        </div>
        
        <Tabs defaultValue="results">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="results">Resultado da Validação</TabsTrigger>
            <TabsTrigger value="history"><History className="mr-2" />Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="results" className="mt-4">
            {results.length > 0 ? (
              <Accordion type="single" collapsible className="w-full" defaultValue={results[0].id}>
                {results.map((result) => {
                  const hasDivergence = Object.values(result.calculationValidations).some(v => v.check === 'divergent');
                  const overallStatus = result.status === 'error' ? 'Erro' : hasDivergence ? 'Divergente' : 'Validada';
                  return (
                    <AccordionItem value={result.id} key={result.id}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="truncate font-medium flex-1 text-left">{result.fileName}</span>
                           <Badge variant={overallStatus === 'Erro' ? 'destructive' : overallStatus === 'Divergente' ? 'secondary' : 'default'} className="ml-auto flex-shrink-0">
                            {overallStatus}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-2 md:p-4 space-y-6 bg-secondary/30 rounded-b-md">
                        {result.status === 'error' ? (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>{result.messages[0].message}</AlertTitle>
                                <AlertDescription>{result.messages[0].details}</AlertDescription>
                            </Alert>
                        ) : (
                        <>
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                           <div className="space-y-4">
                               <h4 className="font-semibold text-primary">Informações Gerais</h4>
                               <div className="grid grid-cols-2 gap-2 text-sm p-3 bg-background rounded-lg border">
                                    <span className="font-medium text-muted-foreground">Chave</span><span className="truncate">{result.nfeData?.chave || "N/A"}</span>
                                    <span className="font-medium text-muted-foreground">Nº NFe</span><span>{result.nfeData?.nNf || "N/A"}</span>
                                    <span className="font-medium text-muted-foreground">Emissão</span><span>{result.nfeData?.dhEmi ? format(new Date(result.nfeData.dhEmi), "dd/MM/yy HH:mm") : 'N/A'}</span>
                                    <span className="font-medium text-muted-foreground">Valor Total</span><span className="font-bold">R$ {result.nfeData?.vNF || "0.00"}</span>
                                    <span className="font-medium text-muted-foreground">Frete Total</span><span>R$ {result.nfeData?.vFrete || "0.00"}</span>
                               </div>
                           </div>
                           <div>
                              <h4 className="font-semibold mb-2 text-primary">Tipo de Entrada da Nota</h4>
                              <RadioGroup value={result.selectedInputType} onValueChange={(v: NfeInputType) => updateResultInputType(result.id, v)} className="flex gap-4">
                                {NfeInputTypes.map(type => (
                                  <div key={type} className="flex items-center space-x-2">
                                    <RadioGroupItem value={type} id={`${result.id}-${type}`} />
                                    <Label htmlFor={`${result.id}-${type}`}>{type}</Label>
                                  </div>
                                ))}
                              </RadioGroup>
                           </div>
                        </div>

                        <Tabs defaultValue="fiscal">
                             <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="fiscal">Dados Fiscais</TabsTrigger>
                                <TabsTrigger value="products">Produtos</TabsTrigger>
                            </TabsList>
                            <TabsContent value="fiscal" className="mt-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Card>
                                        <CardHeader><CardTitle>Tributos ICMS</CardTitle></CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="text-sm"><span className="font-semibold text-muted-foreground">Base de Cálculo: </span>R$ {result.nfeData?.total.vBC || '0.00'}</div>
                                            <div className="text-sm"><span className="font-semibold text-muted-foreground">Valor ICMS: </span>R$ {result.nfeData?.total.vICMS || '0.00'}</div>
                                            <ValidationStatusDisplay validation={result.calculationValidations.vICMS} />
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader><CardTitle>Tributos IPI</CardTitle></CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="text-sm"><span className="font-semibold text-muted-foreground">Alíquota IPI: </span>{formatPercent(result.nfeData?.products[0]?.ipi.pIPI)}</div>
                                            <div className="text-sm"><span className="font-semibold text-muted-foreground">Valor IPI: </span>R$ {result.nfeData?.total.vIPI || '0.00'}</div>
                                            <ValidationStatusDisplay validation={result.calculationValidations.vIPI} />
                                        </CardContent>
                                    </Card>
                                     <Card>
                                        <CardHeader><CardTitle>Tributos ICMS-ST</CardTitle></CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="text-sm"><span className="font-semibold text-muted-foreground">Base Cálculo ST: </span>R$ {result.nfeData?.total.vBCST || '0.00'}</div>
                                            <div className="text-sm"><span className="font-semibold text-muted-foreground">Valor ICMS-ST: </span>R$ {result.nfeData?.total.vST || '0.00'}</div>
                                            <ValidationStatusDisplay validation={result.calculationValidations.vICMSST} />
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                             <TabsContent value="products" className="mt-4">
                                <div className="rounded-md border overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead>CST</TableHead>
                                            <TableHead>CFOP</TableHead>
                                            <TableHead>Base ICMS</TableHead>
                                            <TableHead>Alíq. ICMS</TableHead>
                                            <TableHead>Valor ICMS</TableHead>
                                            <TableHead>Base IPI</TableHead>
                                            <TableHead>Alíq. IPI</TableHead>
                                            <TableHead>Valor IPI</TableHead>
                                            <TableHead>Base ICMS-ST</TableHead>
                                            <TableHead>MVA-ST</TableHead>
                                            <TableHead>Valor ICMS-ST</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {result.nfeData?.products.map(p => (
                                            <TableRow key={p.item}>
                                                <TableCell className="font-medium">{p.xProd}</TableCell>
                                                <TableCell>{p.cst}</TableCell>
                                                <TableCell>{p.cfop}</TableCell>
                                                <TableCell>R$ {p.icms.vBC || '0.00'}</TableCell>
                                                <TableCell>{formatPercent(p.icms.pICMS)}</TableCell>
                                                <TableCell>R$ {p.icms.vICMS || '0.00'}</TableCell>
                                                <TableCell>R$ {p.ipi.vBC || '0.00'}</TableCell>
                                                <TableCell>{formatPercent(p.ipi.pIPI)}</TableCell>
                                                <TableCell>R$ {p.ipi.vIPI || '0.00'}</TableCell>
                                                <TableCell>R$ {p.icmsSt.vBCST || '0.00'}</TableCell>
                                                <TableCell>{formatPercent(p.icmsSt.pMVAST)}</TableCell>
                                                <TableCell>R$ {p.icmsSt.vICMSST || '0.00'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                </div>
                            </TabsContent>
                        </Tabs>
                        </>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            ) : (
              <div className="text-center text-muted-foreground p-8">
                <p>Nenhum arquivo validado ainda.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4">
             <div className="flex justify-end mb-2">
                <Button variant="outline" size="sm" onClick={clearHistory} disabled={history.length === 0}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpar Histórico
                </Button>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Arquivo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Validação ICMS-ST</TableHead>
                    <TableHead className="text-right">Status Geral</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.length > 0 ? history.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium truncate max-w-xs">{item.fileName}</TableCell>
                          <TableCell>{format(new Date(item.date), "dd/MM/yy HH:mm")}</TableCell>
                          <TableCell>
                            {item.icmsStStatus !== 'not_applicable' && (
                                <Badge variant={item.icmsStStatus === 'divergent' ? 'secondary' : 'default'}>{item.icmsStStatus === 'divergent' ? 'Divergente' : 'Validado'}</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                             <Badge variant={item.overallValidation === 'Divergente' ? 'secondary' : 'default'}>
                               {item.overallValidation}
                             </Badge>
                          </TableCell>
                        </TableRow>
                     )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Nenhum histórico encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={exportToCsv} disabled={results.length === 0} className="w-full">
          <FileDown className="mr-2" />
          Exportar Relatório (CSV)
        </Button>
      </CardFooter>
    </Card>
  );
}
