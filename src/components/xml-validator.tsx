
"use client";

import { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { ValidationResult, ValidationHistoryItem, NfeData, NfeInputType, ValidationMessage } from "@/lib/definitions";
import { NfeInputTypes } from "@/lib/definitions";
import { companyProfiles, cstValidationRules } from "@/lib/fiscal-validator-data";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileCode, Upload, CheckCircle2, XCircle, AlertTriangle, FileDown, Trash2, History, Info } from "lucide-react";

const MAX_HISTORY_ITEMS = 10;

const getTagValue = (doc: Document, tagName: string): string | undefined => doc.querySelector(tagName)?.textContent || undefined;

const parseNfeXml = (xmlDoc: Document, fileName: string): NfeData => {
  const emit = xmlDoc.querySelector('emit');
  const dest = xmlDoc.querySelector('dest');
  const ide = xmlDoc.querySelector('ide');
  const icmsTot = xmlDoc.querySelector('ICMSTot');
  const prod = xmlDoc.querySelector('det[nItem="1"] prod'); // first product
  const icms = xmlDoc.querySelector('det[nItem="1"] imposto ICMS')?.firstElementChild; // gets CST or CSOSN block
  const ipi = xmlDoc.querySelector('det[nItem="1"] imposto IPI');

  return {
    fileName,
    versao: xmlDoc.querySelector('nfeProc')?.getAttribute('versao') || 'N/A',
    chave: xmlDoc.querySelector('infNFe')?.getAttribute('Id')?.replace('NFe', '') || 'N/A',
    emitCnpj: getTagValue(xmlDoc, 'emit CNPJ'),
    emitRazaoSocial: getTagValue(xmlDoc, 'emit xNome'),
    emitIe: getTagValue(xmlDoc, 'emit IE'),
    emitEndereco: `${getTagValue(xmlDoc, 'emit xLgr')}, ${getTagValue(xmlDoc, 'emit nro')}`,
    emitMunicipio: getTagValue(xmlDoc, 'emit xMun'),
    emitUf: getTagValue(xmlDoc, 'emit UF'),
    emitCep: getTagValue(xmlDoc, 'emit CEP'),
    emitCrt: getTagValue(xmlDoc, 'emit CRT'),
    destCnpj: getTagValue(xmlDoc, 'dest CNPJ'),
    destRazaoSocial: getTagValue(xmlDoc, 'dest xNome'),
    destIe: getTagValue(xmlDoc, 'dest IE'),
    destEndereco: `${getTagValue(xmlDoc, 'dest xLgr')}, ${getTagValue(xmlDoc, 'dest nro')}`,
    destMunicipio: getTagValue(xmlDoc, 'dest xMun'),
    destUf: getTagValue(xmlDoc, 'dest UF'),
    destCep: getTagValue(xmlDoc, 'dest CEP'),
    nNf: getTagValue(xmlDoc, 'ide nNF'),
    dhEmi: getTagValue(xmlDoc, 'ide dhEmi'),
    vNf: getTagValue(xmlDoc, 'ICMSTot vNF'),
    vBc: getTagValue(xmlDoc, 'ICMSTot vBC'),
    vIcms: getTagValue(xmlDoc, 'ICMSTot vICMS'),
    vIpi: getTagValue(xmlDoc, 'ICMSTot vIPI'),
    cfop: getTagValue(xmlDoc, 'det[nItem="1"] prod CFOP'),
    cst: getTagValue(icms as Document, 'CST'),
    csosn: getTagValue(icms as Document, 'CSOSN'),
    pIcms: getTagValue(icms as Document, 'pICMS'),
    cMun: getTagValue(xmlDoc, 'ide cMunFG'),
  };
};

const runAllValidations = (data: NfeData, inputType: NfeInputType): ValidationMessage[] => {
    const messages: ValidationMessage[] = [];

    // 1. Validate Company Profile
    const destCnpjFormatted = data.destCnpj?.replace(/[./-]/g, '');
    const validProfile = companyProfiles.find(p => p.cnpj.replace(/[./-]/g, '') === destCnpjFormatted);
    if (validProfile) {
        messages.push({ type: 'success', message: "CNPJ do destinatário validado com sucesso.", details: `Correspondente a ${validProfile.razaoSocial}.` });
    } else {
        messages.push({ type: 'error', message: "CNPJ do destinatário inválido.", details: "O CNPJ não corresponde a nenhum cadastro da empresa." });
    }

    // 2. Validate Tax Regime (CRT vs CST/CSOSN)
    if (data.emitCrt && cstValidationRules[data.emitCrt]) {
        const rule = cstValidationRules[data.emitCrt];
        const taxCode = rule.type === 'CST' ? data.cst : data.csosn;
        const usedCodeType = rule.type === 'CST' ? 'CST' : 'CSOSN';
        const oppositeCodeType = rule.type === 'CST' ? 'CSOSN' : 'CST';
        const oppositeCode = rule.type === 'CST' ? data.csosn : data.cst;

        if (oppositeCode) {
            messages.push({ type: 'error', message: `Incompatibilidade de código de imposto.`, details: `${rule.description} O código ${oppositeCodeType} não deveria estar presente.` });
        } else if (!taxCode) {
            messages.push({ type: 'error', message: `Código de imposto ausente.`, details: `O ${usedCodeType} é obrigatório para o regime do emitente.` });
        } else if (!rule.allowed.includes(taxCode)) {
            messages.push({ type: 'warning', message: `Código ${usedCodeType} (${taxCode}) incomum para este regime.`, details: `Verifique se o código ${taxCode} é aplicável para ${rule.description}` });
        } else {
            messages.push({ type: 'success', message: 'Regime tributário e código de imposto são compatíveis.' });
        }
    } else {
        messages.push({ type: 'warning', message: 'Não foi possível validar o regime tributário (CRT).' });
    }
    
    // 3. Validate IPI Rule
    const vIpi = parseFloat(data.vIpi || '0');
    if (vIpi > 0) {
        if (inputType === 'Consumo') {
            messages.push({ type: 'info', message: 'Para Consumo, o valor do IPI deve compor a base de cálculo do ICMS.', details: 'Esta validação requer conferência manual ou regra específica.' });
        } else if (inputType === 'Revenda') {
            messages.push({ type: 'info', message: 'Para Revenda, o valor do IPI não deve compor a base de cálculo do ICMS.', details: 'Esta validação requer conferência manual ou regra específica.' });
        }
    }
    
    // 4. Validate ICMS Calculation
    const vBc = parseFloat(data.vBc || '0');
    const pIcms = parseFloat(data.pIcms || '0');
    const vIcms = parseFloat(data.vIcms || '0');
    if (vBc > 0 && pIcms > 0) {
        const calculatedVIcms = (vBc * pIcms) / 100;
        if (Math.abs(calculatedVIcms - vIcms) < 0.02) { // Tolerance for rounding
            messages.push({ type: 'success', message: 'Cálculo do ICMS verificado com sucesso.', details: `Base R$ ${vBc.toFixed(2)} x Alíquota ${pIcms.toFixed(2)}% ≈ R$ ${vIcms.toFixed(2)}` });
        } else {
            messages.push({ type: 'error', message: 'Valor do ICMS não corresponde ao cálculo.', details: `Esperado: R$ ${calculatedVIcms.toFixed(2)}. Encontrado: R$ ${vIcms.toFixed(2)}.` });
        }
    } else {
        messages.push({ type: 'info', message: 'Não foi possível validar o cálculo de ICMS (dados insuficientes).' });
    }

    return messages;
}


const processNfeFile = (xmlString: string, fileName: string, inputType: NfeInputType, otherValue?: string): ValidationResult => {
    const id = `${fileName}-${new Date().getTime()}`;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    const parserError = xmlDoc.querySelector("parsererror");

    if (parserError) {
        return {
            id,
            fileName,
            status: 'error',
            messages: [{ type: 'error', message: 'Erro de sintaxe XML.', details: parserError.textContent || "O arquivo não é um XML bem formado." }],
            nfeData: null,
            selectedInputType: inputType,
            otherInputType: otherValue,
        };
    }

    if (!xmlDoc.querySelector("nfeProc")) {
         return {
            id,
            fileName,
            status: 'error',
            messages: [{ type: 'error', message: 'Estrutura inválida.', details: 'A tag raiz <nfeProc> não foi encontrada.' }],
            nfeData: null,
            selectedInputType: inputType,
            otherInputType: otherValue,
        };
    }

    const nfeData = parseNfeXml(xmlDoc, fileName);
    const messages = runAllValidations(nfeData, inputType);
    
    const hasErrors = messages.some(m => m.type === 'error');
    const hasWarnings = messages.some(m => m.type === 'warning');

    return {
        id,
        fileName,
        status: hasErrors ? 'error' : hasWarnings ? 'warning' : 'success',
        messages,
        nfeData,
        selectedInputType: inputType,
        otherInputType: otherValue
    };
}


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
    const historyItem: ValidationHistoryItem = {
      id: newResult.id,
      fileName: newResult.fileName,
      date: new Date().toISOString(),
      status: newResult.status,
    };

    setHistory(prevHistory => {
      const updatedHistory = [historyItem, ...prevHistory].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem("xmlValidationHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newResultsPromises: Promise<ValidationResult>[] = Array.from(files).map(file => {
      return new Promise((resolve, reject) => {
        if (file.type === "text/xml" || file.name.endsWith(".xml")) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const content = evt.target?.result as string;
            const validation = processNfeFile(content, file.name, 'Revenda');
            resolve(validation);
          };
          reader.onerror = (err) => reject(err);
          reader.readAsText(file);
        } else {
          toast({ variant: "destructive", title: "Arquivo inválido", description: `O arquivo '${file.name}' não é um XML.` });
          resolve(null as any); // Resolve with null to filter out later
        }
      });
    });

    Promise.all(newResultsPromises).then(newResults => {
        const validResults = newResults.filter(r => r !== null);
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

  const updateResultInputType = (id: string, inputType: NfeInputType, otherValue?: string) => {
    setResults(prev => prev.map(r => {
      if (r.id !== id || !r.nfeData) return r;
      
      const newMessages = runAllValidations(r.nfeData, inputType);
      const hasErrors = newMessages.some(m => m.type === 'error');
      const hasWarnings = newMessages.some(m => m.type === 'warning');
      const newStatus = hasErrors ? 'error' : hasWarnings ? 'warning' : 'success';
      
      return { 
        ...r, 
        selectedInputType: inputType, 
        otherInputType: otherValue ?? r.otherInputType,
        messages: newMessages,
        status: newStatus
      };
    }));
  };

  const exportToCsv = () => {
    if (results.length === 0) {
      toast({ title: "Nenhum dado para exportar." });
      return;
    }
    const dataToExport = results.map(r => ({
      "Arquivo": r.fileName,
      "Status Validação": r.status,
      "Tipo de Entrada": r.selectedInputType === 'Outro' ? r.otherInputType : r.selectedInputType,
      "Chave NFe": r.nfeData?.chave,
      "Versão NFe": r.nfeData?.versao,
      "CNPJ Emitente": r.nfeData?.emitCnpj,
      "Razão Social Emitente": r.nfeData?.emitRazaoSocial,
      "CNPJ Destinatário": r.nfeData?.destCnpj,
      "Razão Social Destinatário": r.nfeData?.destRazaoSocial,
      "Número Nota": r.nfeData?.nNf,
      "Valor Total": r.nfeData?.vNf,
      "Data Emissão": r.nfeData?.dhEmi ? format(new Date(r.nfeData.dhEmi), "dd/MM/yyyy HH:mm:ss") : "",
      "CFOP": r.nfeData?.cfop,
      "Validações": r.messages.map(m => `[${m.type.toUpperCase()}] ${m.message} (${m.details || ''})`).join(" | "),
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "relatorio_validacao_nfe.csv");
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

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-headline">
          <FileCode className="h-6 w-6 text-primary" />
          Validador Fiscal de NFe
        </CardTitle>
        <CardDescription>
          Arraste e solte arquivos XML para uma validação fiscal completa, incluindo regras comerciais e tributárias.
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
                  const overallStatus = statusMap[result.status];
                  return (
                    <AccordionItem value={result.id} key={result.id}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <overallStatus.icon className={`h-5 w-5 ${overallStatus.color} flex-shrink-0`} />
                          <span className="truncate font-medium flex-1">{result.fileName}</span>
                          <Badge variant={overallStatus.badge as any} className="ml-auto flex-shrink-0">{overallStatus.label}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-2 md:p-4 space-y-6 bg-secondary/30 rounded-b-md">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                           <div>
                              <h4 className="font-semibold mb-2 text-primary">Checklist de Validação</h4>
                              <div className="space-y-2">
                                {result.messages.map((msg, i) => {
                                  const status = statusMap[msg.type];
                                  return (
                                    <Alert key={i} className="p-3">
                                      <status.icon className={`h-4 w-4 ${status.color}`} />
                                      <AlertTitle className="font-semibold text-sm">{msg.message}</AlertTitle>
                                      {msg.details && <AlertDescription className="text-xs">{msg.details}</AlertDescription>}
                                    </Alert>
                                  )
                                })}
                              </div>
                           </div>
                           <div>
                              <h4 className="font-semibold mb-2 text-primary">Tipo de Entrada da Nota</h4>
                              <RadioGroup value={result.selectedInputType} onValueChange={(v: NfeInputType) => updateResultInputType(result.id, v)}>
                                {NfeInputTypes.map(type => (
                                  <div key={type} className="flex items-center space-x-2">
                                    <RadioGroupItem value={type} id={`${result.id}-${type}`} />
                                    <Label htmlFor={`${result.id}-${type}`}>{type}</Label>
                                  </div>
                                ))}
                              </RadioGroup>
                              {result.selectedInputType === 'Outro' && (
                                <Input 
                                  placeholder="Especifique o tipo" 
                                  className="mt-2"
                                  value={result.otherInputType || ""}
                                  onChange={(e) => updateResultInputType(result.id, 'Outro', e.target.value)}
                                />
                              )}
                           </div>
                        </div>
                         {result.nfeData && (
                          <Accordion type="single" collapsible>
                            <AccordionItem value="nfe-details">
                                <AccordionTrigger className="text-base font-semibold text-primary">Detalhes da NFe</AccordionTrigger>
                                <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                                    <div className="font-semibold text-muted-foreground">Chave</div><div>{result.nfeData.chave}</div>
                                    <div className="font-semibold text-muted-foreground">Nº</div><div>{result.nfeData.nNf}</div>
                                    <div className="font-semibold text-muted-foreground">Emissão</div><div>{result.nfeData.dhEmi ? format(new Date(result.nfeData.dhEmi), "dd/MM/yyyy HH:mm") : 'N/A'}</div>
                                    <div className="font-semibold text-muted-foreground">Valor</div><div>R$ {result.nfeData.vNf}</div>
                                    <div className="font-semibold text-muted-foreground">Emitente</div><div>{result.nfeData.emitRazaoSocial} ({result.nfeData.emitCnpj})</div>
                                    <div className="font-semibold text-muted-foreground">Destinatário</div><div>{result.nfeData.destRazaoSocial} ({result.nfeData.destCnpj})</div>
                                </AccordionContent>
                            </AccordionItem>
                          </Accordion>
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
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.length > 0 ? history.map(item => {
                     const status = statusMap[item.status];
                     return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium truncate max-w-xs">{item.fileName}</TableCell>
                          <TableCell>{format(new Date(item.date), "dd/MM/yy HH:mm")}</TableCell>
                          <TableCell className="text-right">
                             <Badge variant={status.badge as any}>
                               {status.label}
                             </Badge>
                          </TableCell>
                        </TableRow>
                     )
                  }) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
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
