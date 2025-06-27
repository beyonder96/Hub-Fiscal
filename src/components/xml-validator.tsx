"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NfeInputTypes, type ValidationResult, type ValidationHistoryItem, type NfeData, type NfeInputType } from "@/lib/definitions";
import { FileCode, Upload, CheckCircle2, XCircle, AlertTriangle, FileDown, Trash2, History } from "lucide-react";
import { format } from "date-fns";
import Papa from "papaparse";

const MAX_HISTORY_ITEMS = 10;

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
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível carregar o histórico de validação." });
    }
  }, [toast]);

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

  const parseAndValidateXml = (xmlString: string, fileName: string): Omit<ValidationResult, 'selectedInputType' | 'otherInputType'> => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    const parserError = xmlDoc.querySelector("parsererror");

    const id = `${fileName}-${new Date().getTime()}`;

    if (parserError) {
      return { id, fileName, status: 'invalid', errors: ["Erro de sintaxe: O arquivo não é um XML bem formado.", parserError.textContent || ""], nfeData: null };
    }

    const nfeProc = xmlDoc.querySelector("nfeProc");
    if (!nfeProc) {
      return { id, fileName, status: 'invalid', errors: ["Estrutura inválida: A tag raiz <nfeProc> não foi encontrada."], nfeData: null };
    }

    const version = nfeProc.getAttribute("versao") || "Não encontrada";
    const getTagValue = (tagName: string) => xmlDoc.querySelector(tagName)?.textContent || undefined;
    
    const nfeData: NfeData = {
      fileName,
      version,
      emitCnpj: getTagValue("emit CNPJ"),
      destCnpj: getTagValue("dest CNPJ"),
      nNf: getTagValue("ide nNF"),
      vNf: getTagValue("ICMSTot vNF"),
      dhEmi: getTagValue("ide dhEmi"),
      cfop: getTagValue("det prod CFOP"),
    };

    const errors: string[] = [];
    if (!nfeData.emitCnpj) errors.push("CNPJ do emitente não encontrado.");
    if (!nfeData.destCnpj) errors.push("CNPJ do destinatário não encontrado.");
    if (!nfeData.nNf) errors.push("Número da nota não encontrado.");
    if (!nfeData.vNf) errors.push("Valor total da nota não encontrado.");

    return {
      id,
      fileName,
      status: errors.length > 0 ? 'invalid' : 'valid',
      errors,
      nfeData,
    };
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newResults: ValidationResult[] = [];
    Array.from(files).forEach(file => {
      if (file.type === "text/xml" || file.name.endsWith(".xml")) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const content = evt.target?.result as string;
          const validation = parseAndValidateXml(content, file.name);
          const finalResult: ValidationResult = {
            ...validation,
            selectedInputType: 'Revenda' // Default value
          }
          newResults.push(finalResult);
          saveToHistory(finalResult);

          if (newResults.length === Array.from(files).filter(f => f.type === "text/xml" || f.name.endsWith(".xml")).length) {
            setResults(newResults);
          }
        };
        reader.readAsText(file);
      } else {
        toast({ variant: "destructive", title: "Arquivo inválido", description: `O arquivo '${file.name}' não é um XML.` });
      }
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
    setResults(prev => prev.map(r => 
      r.id === id 
        ? { ...r, selectedInputType: inputType, otherInputType: otherValue ?? r.otherInputType } 
        : r
    ));
  };

  const exportToCsv = () => {
    if (results.length === 0) {
      toast({ title: "Nenhum dado para exportar." });
      return;
    }
    const dataToExport = results.map(r => ({
      "Arquivo": r.fileName,
      "Status": r.status === 'valid' ? 'Válido' : 'Inválido',
      "Versão NFe": r.nfeData?.version,
      "CNPJ Emitente": r.nfeData?.emitCnpj,
      "CNPJ Destinatário": r.nfeData?.destCnpj,
      "Número Nota": r.nfeData?.nNf,
      "Valor Total": r.nfeData?.vNf,
      "Data Emissão": r.nfeData?.dhEmi ? format(new Date(r.nfeData.dhEmi), "dd/MM/yyyy HH:mm:ss") : "",
      "CFOP": r.nfeData?.cfop,
      "Tipo de Entrada": r.selectedInputType === 'Outro' ? r.otherInputType : r.selectedInputType,
      "Erros": r.errors.join("; "),
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
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


  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-headline">
          <FileCode className="h-6 w-6 text-primary" />
          Validador de Nota Fiscal Eletrônica
        </CardTitle>
        <CardDescription>
          Arraste e solte arquivos XML, ou clique para selecionar. Visualize os dados, valide a estrutura e exporte um relatório.
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
                {results.map((result) => (
                  <AccordionItem value={result.id} key={result.id}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        {result.status === 'valid' ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-destructive" />}
                        <span className="truncate font-medium">{result.fileName}</span>
                        <Badge variant={result.status === 'valid' ? "outline" : "destructive"}>{result.status === 'valid' ? 'Válido' : 'Inválido'}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 space-y-6">
                      {result.status === 'invalid' && (
                        <Alert variant="destructive">
                           <AlertTriangle className="h-4 w-4" />
                           <AlertTitle>Erros Encontrados</AlertTitle>
                           <AlertDescription>
                             <ul className="list-disc pl-5">
                               {result.errors.map((err, i) => <li key={i}>{err}</li>)}
                             </ul>
                           </AlertDescription>
                        </Alert>
                      )}
                      {result.nfeData && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-2 text-primary">Dados da Nota</h4>
                            <Table>
                              <TableBody>
                                <TableRow><TableCell className="font-medium">Nº Nota</TableCell><TableCell>{result.nfeData.nNf}</TableCell></TableRow>
                                <TableRow><TableCell className="font-medium">Valor Total</TableCell><TableCell>R$ {result.nfeData.vNf}</TableCell></TableRow>
                                <TableRow><TableCell className="font-medium">Emissão</TableCell><TableCell>{result.nfeData.dhEmi ? format(new Date(result.nfeData.dhEmi), "dd/MM/yyyy HH:mm") : 'N/A'}</TableCell></TableRow>
                                <TableRow><TableCell className="font-medium">CNPJ Emitente</TableCell><TableCell>{result.nfeData.emitCnpj}</TableCell></TableRow>
                                <TableRow><TableCell className="font-medium">CNPJ Dest.</TableCell><TableCell>{result.nfeData.destCnpj}</TableCell></TableRow>
                                <TableRow><TableCell className="font-medium">CFOP</TableCell><TableCell>{result.nfeData.cfop}</TableCell></TableRow>
                                <TableRow><TableCell className="font-medium">Versão NFe</TableCell><TableCell>{result.nfeData.version}</TableCell></TableRow>
                              </TableBody>
                            </Table>
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
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
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
                  {history.length > 0 ? history.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium truncate max-w-xs">{item.fileName}</TableCell>
                      <TableCell>{format(new Date(item.date), "dd/MM/yy HH:mm")}</TableCell>
                      <TableCell className="text-right">
                         <Badge variant={item.status === 'valid' ? 'outline' : 'destructive'}>
                           {item.status === 'valid' ? 'Válido' : 'Inválido'}
                         </Badge>
                      </TableCell>
                    </TableRow>
                  )) : (
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
