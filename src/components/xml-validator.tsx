
"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { ValidationResult, ValidationHistoryItem, NfeData, NfeInputType, ValidationMessage, NfeProductData, CalculationValidation, ValidationState } from "@/lib/definitions";
import { NfeInputTypes } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { initialTaxRates } from "@/lib/tax-data";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileCode, Upload, CheckCircle2, XCircle, AlertTriangle, FileDown, Trash2, History, Info, Calculator } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const MAX_HISTORY_ITEMS = 15;
const MAX_FILES = 15;

const getTagValue = (element: Element | null, tagName: string): string | undefined => element?.querySelector(tagName)?.textContent || undefined;

const parseNfeXml = (xmlDoc: Document, fileName: string): NfeData => {
  const ide = xmlDoc.querySelector('ide');
  const emit = xmlDoc.querySelector('emit');
  const dest = xmlDoc.querySelector('dest');
  const icmsTot = xmlDoc.querySelector('ICMSTot');

  const rawNatOp = getTagValue(ide, 'natOp') || 'N/A';
  let natOp = rawNatOp;
  if (rawNatOp.toLowerCase().startsWith('venda merc') || rawNatOp.toLowerCase().startsWith('vnd mer')) {
    natOp = 'Venda';
  }

  const products: NfeProductData[] = Array.from(xmlDoc.querySelectorAll('det')).map(det => {
    const prod = det.querySelector('prod');
    const imposto = det.querySelector('imposto');
    const icms = imposto?.querySelector('ICMS')?.firstElementChild;
    const ipi = imposto?.querySelector('IPI');
    const ipiTrib = ipi?.querySelector('IPITrib');

    const orig = getTagValue(icms ?? null, 'orig');
    const cstNum = getTagValue(icms ?? null, 'CST') || getTagValue(icms ?? null, 'CSOSN');

    return {
      item: det.getAttribute('nItem') || 'N/A',
      cProd: getTagValue(prod, 'cProd'),
      xProd: getTagValue(prod, 'xProd'),
      ncm: getTagValue(prod, 'NCM'),
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
        vBCST: getTagValue(icms, 'vBCST'),
        pMVAST: getTagValue(icms, 'pMVAST'),
        pICMSST: getTagValue(icms, 'pICMSST'),
        vICMSST: getTagValue(icms, 'vICMSST') || getTagValue(icms, 'vST'),
        pRedBCST: getTagValue(icms, 'pRedBCST'),
      }
    };
  });

  return {
    fileName,
    versao: xmlDoc.querySelector('nfeProc')?.getAttribute('versao') || 'N/A',
    chave: xmlDoc.querySelector('infNFe')?.getAttribute('Id')?.replace('NFe', ''),
    natOp,
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
      vICMSST: getTagValue(icmsTot, 'vICMSST') || getTagValue(icmsTot, 'vST'),
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

    const firstProductCfop = data.products[0]?.cfop;
    const isConsertoOperation = firstProductCfop === '5.915' || firstProductCfop === '6.915';
    
    // Handle Conserto type first
    if (inputType === 'Conserto') {
        const actualTotalVIcms = parseFloat(data.total.vICMS || '0');
        const actualTotalVIpi = parseFloat(data.total.vIPI || '0');
        const actualTotalVICMSST = parseFloat(data.total.vICMSST || '0');

        if (!isConsertoOperation) {
            const errorMsg = `Tipo de entrada 'Conserto' selecionado, mas o CFOP (${firstProductCfop}) não é de remessa para conserto.`;
            validations.vICMS = { check: 'divergent', message: errorMsg };
            validations.vIPI = { check: 'divergent', message: errorMsg };
            validations.vICMSST = { check: 'divergent', message: errorMsg };
        } else {
            validations.vICMS = Math.abs(actualTotalVIcms) < tolerance 
                ? { check: 'valid', message: 'Valor do ICMS (R$ 0.00) validado para conserto.' }
                : { check: 'divergent', message: `Valor do ICMS deve ser zero para conserto, mas foi encontrado R$ ${actualTotalVIcms.toFixed(2)}.` };

            validations.vIPI = Math.abs(actualTotalVIpi) < tolerance 
                ? { check: 'valid', message: 'Valor do IPI (R$ 0.00) validado para conserto.' }
                : { check: 'divergent', message: `Valor do IPI deve ser zero para conserto, mas foi encontrado R$ ${actualTotalVIpi.toFixed(2)}.` };

            validations.vICMSST = Math.abs(actualTotalVICMSST) < tolerance 
                ? { check: 'valid', message: 'Valor do ICMS-ST (R$ 0.00) validado para conserto.' }
                : { check: 'divergent', message: `Valor do ICMS-ST deve ser zero para conserto, mas foi encontrado R$ ${actualTotalVICMSST.toFixed(2)}.` };
        }
        
        validations.vBC = { check: 'not_applicable', message: 'Não aplicável para conserto.' };
        validations.vBCST = { check: 'not_applicable', message: 'Não aplicável para conserto.' };
        return validations;
    }

    const totalProd = data.products.reduce((acc, p) => acc + parseFloat(p.vProd || '0'), 0);
    const totalFrete = data.products.reduce((acc, p) => acc + parseFloat(p.vFrete || '0'), 0);
    const totalIPI = data.products.reduce((acc, p) => acc + parseFloat(p.ipi.vIPI || '0'), 0);
    
    // vBC Validation
    const actualVBC = parseFloat(data.total.vBC || '0');
    let baseForVBC = totalProd + totalFrete;
    if (inputType === 'Consumo') {
        baseForVBC += totalIPI;
    }

    let expectedVBC = baseForVBC;
    if (data.emitUf === 'ES' && data.destUf === 'ES') {
         // 58.82% reduction -> multiply by (1 - 0.5882) = 0.4118
         const pRedBC = 0.5882;
         expectedVBC = baseForVBC * (1 - pRedBC);
    }
    
    if (!isNaN(actualVBC)) {
        if (Math.abs(expectedVBC - actualVBC) < tolerance) {
            validations.vBC = { check: 'valid', message: `Base de Cálculo (R$ ${actualVBC.toFixed(2)}) validada.` };
        } else {
            validations.vBC = { check: 'divergent', message: `Base de Cálculo divergente. Esperado: R$ ${expectedVBC.toFixed(2)}, Encontrado: R$ ${actualVBC.toFixed(2)}.` };
        }
    }

    // vICMS Validation
    const actualTotalVIcms = parseFloat(data.total.vICMS || '0');
    const expectedVIcms = data.products.reduce((acc, p) => {
        const vBC_item = parseFloat(p.icms.vBC || '0');
        const pICMS_item = parseFloat(p.icms.pICMS || '0');
        return acc + (vBC_item * (pICMS_item / 100));
    }, 0);
    if (!isNaN(actualTotalVIcms)) {
        if (Math.abs(expectedVIcms - actualTotalVIcms) < tolerance) {
            validations.vICMS = { check: 'valid', message: `Valor do ICMS (R$ ${actualTotalVIcms.toFixed(2)}) validado.` };
        } else {
            validations.vICMS = { check: 'divergent', message: `Soma do vICMS calculado dos produtos (R$ ${expectedVIcms.toFixed(2)}) diverge do total (R$ ${actualTotalVIcms.toFixed(2)}).` };
        }
    }
    
    // vIPI Validation
    const actualTotalVIpi = parseFloat(data.total.vIPI || '0');
    const expectedVIpi = data.products.reduce((acc, p) => {
        const vBC_ipi_item = parseFloat(p.ipi.vBC || '0');
        const pIPI_item = parseFloat(p.ipi.pIPI || '0');
        return acc + (vBC_ipi_item * (pIPI_item / 100));
    }, 0);

    if (!isNaN(actualTotalVIpi) && expectedVIpi > 0) {
      if (Math.abs(expectedVIpi - actualTotalVIpi) < tolerance) {
        validations.vIPI = { check: 'valid', message: `Valor do IPI (R$ ${actualTotalVIpi.toFixed(2)}) validado.` };
      } else {
        validations.vIPI = { check: 'divergent', message: `Soma do vIPI calculado dos produtos (R$ ${expectedVIpi.toFixed(2)}) diverge do total (R$ ${actualTotalVIpi.toFixed(2)}).` };
      }
    }

    // vBCST and vICMSST Validation
    const actualTotalVBCST = parseFloat(data.total.vBCST || '0');
    const actualTotalVICMSST = parseFloat(data.total.vICMSST || '0');

    if (data.emitUf === 'ES' && data.destUf === 'ES') {
        const stIsValid = Math.abs(actualTotalVBCST) < tolerance && Math.abs(actualTotalVICMSST) < tolerance;
        if (stIsValid) {
            validations.vBCST = { check: 'valid', message: 'ICMS-ST não aplicável e zerado corretamente para operações internas no ES.' };
            validations.vICMSST = { check: 'valid', message: 'ICMS-ST não aplicável e zerado corretamente para operações internas no ES.' };
        } else {
            validations.vBCST = { check: 'divergent', message: `ICMS-ST deve ser zero para operações internas no ES, mas o total vBCST encontrado foi R$ ${actualTotalVBCST.toFixed(2)}.` };
            validations.vICMSST = { check: 'divergent', message: `ICMS-ST deve ser zero para operações internas no ES, mas o total vICMSST encontrado foi R$ ${actualTotalVICMSST.toFixed(2)}.` };
        }
    } else {
        const sumOfProductVBCST = data.products.reduce((acc, p) => acc + parseFloat(p.icmsSt.vBCST || '0'), 0);
        const sumOfProductVICMSST = data.products.reduce((acc, p) => acc + parseFloat(p.icmsSt.vICMSST || '0'), 0);

        // vBCST validation
        if (Math.abs(sumOfProductVBCST - actualTotalVBCST) < tolerance) {
            validations.vBCST = { check: 'valid', message: `Base de Cálculo ST (R$ ${actualTotalVBCST.toFixed(2)}) validada.` };
        } else {
            validations.vBCST = { check: 'divergent', message: `Soma da Base de Cálculo ST dos produtos (R$ ${sumOfProductVBCST.toFixed(2)}) diverge do total (R$ ${actualTotalVBCST.toFixed(2)}).` };
        }
        
        // vICMSST validation
        if (Math.abs(sumOfProductVICMSST - actualTotalVICMSST) < tolerance) {
            validations.vICMSST = { check: 'valid', message: `Valor do ICMS-ST (R$ ${actualTotalVICMSST.toFixed(2)}) validado.` };
        } else {
            validations.vICMSST = { check: 'divergent', message: `Soma do vICMS-ST dos produtos (R$ ${sumOfProductVICMSST.toFixed(2)}) diverge do total (R$ ${actualTotalVICMSST.toFixed(2)}).` };
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
            messages: [{ type: 'error', message: 'Estrutura inválida.', details: 'A tag raiz &lt;nfeProc&gt; não foi encontrada.' }],
        };
    }

    const nfeData = parseNfeXml(xmlDoc, fileName);
    const calculationValidations = runValidations(nfeData, inputType);
    
    const messages: ValidationMessage[] = [{ type: 'success', message: 'Arquivo XML lido com sucesso.' }];

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
        <div className={`p-3 rounded-lg ${isDivergent ? 'bg-red-500/10 dark:bg-red-500/20' : 'bg-green-500/10 dark:bg-green-500/20'}`}>
            <div className={`flex items-center gap-2 font-bold ${isDivergent ? 'text-red-600 dark:text-red-300' : 'text-green-600 dark:text-green-300'}`}>
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
  const router = useRouter();

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("xmlValidationHistory");
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.every(item => 'id' in item && 'fileName' in item)) {
          setHistory(parsedHistory);
        } else {
          localStorage.removeItem("xmlValidationHistory");
        }
      }
    } catch (error) {
      console.error("Failed to load validation history:", error);
       localStorage.removeItem("xmlValidationHistory");
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
            
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(content, "application/xml");
            
            let defaultInputType: NfeInputType = 'Revenda';
            const firstProductCfop = xmlDoc.querySelector('det > prod > CFOP')?.textContent;
            if (firstProductCfop === '5.915' || firstProductCfop === '6.915') {
                defaultInputType = 'Conserto';
            }
            
            const validation = processNfeFile(content, file.name, defaultInputType);
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
        setResults(prevResults => [...validResults, ...prevResults].slice(0, MAX_FILES));
        validResults.forEach(saveToHistory);
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
      
      const hasDivergence = Object.values(newCalculations).some(v => v.check === 'divergent');
      const historyItem: ValidationHistoryItem = {
        id: r.id,
        fileName: r.fileName,
        date: new Date().toISOString(),
        status: r.status,
        overallValidation: hasDivergence ? 'Divergente' : 'Validada',
        icmsStStatus: newCalculations.vICMSST.check
      };

      setHistory(prevHistory => {
        const index = prevHistory.findIndex(h => h.id === id);
        if (index > -1) {
            const updatedHistory = [...prevHistory];
            updatedHistory[index] = historyItem;
            localStorage.setItem("xmlValidationHistory", JSON.stringify(updatedHistory));
            return updatedHistory;
        }
        return prevHistory;
      });

      return { 
        ...r, 
        selectedInputType: inputType,
        calculationValidations: newCalculations
      };
    }));
  };

  const handleCalculateSt = (result: ValidationResult) => {
    if (!result.nfeData) return;
    const { nfeData } = result;
    
    const valorMercadoria = nfeData.products.reduce((acc, p) => acc + parseFloat(p.vProd || '0'), 0);
    const valorFrete = parseFloat(nfeData.vFrete || '0');
    const valorIpi = parseFloat(nfeData.total.vIPI || '0');
    const aliqIcms = parseFloat(nfeData.products[0]?.icms.pICMS || '0');
    const origem4 = nfeData.products.some(p => p.cst?.startsWith('4'));
    const operationType = nfeData.products[0]?.cfop === '6152' ? 'transferencia' : 'compra';
    
    const prefillData = {
        valorMercadoria,
        valorFrete,
        valorIpi,
        aliqIcms,
        origem4,
        operationType,
        fornecedor: nfeData.emitRazaoSocial,
        ncm: nfeData.products[0]?.ncm,
    };

    const params = new URLSearchParams();
    params.set('stData', JSON.stringify(prefillData));
    router.push(`/calculo-icms-st?${params.toString()}`);
  }

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
            "Valor Frete": p.vFrete,
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
  
  const statusMap: Record<string, { icon: React.ElementType, color: string, badge: string, label: string }> = {
    'Validada': { icon: CheckCircle2, color: "text-green-500", badge: "default", label: "Validada"},
    'Divergente': { icon: XCircle, color: "text-destructive", badge: "destructive", label: "Divergente"},
    'N/A': {icon: Info, color: "text-muted-foreground", badge: "secondary", label: "N/A"}
  };

  const formatPercent = (value?: string) => {
    const num = parseFloat(value || '0');
    return !isNaN(num) ? `${num.toFixed(2)}%` : 'N/A';
  }

  const checkStCalculationNeeded = (nfeData: NfeData | null): boolean => {
    if (!nfeData) return false;
    const isDestSP = nfeData.destUf === 'SP';
    const isEmitNotSP = nfeData.emitUf !== 'SP';
    if (!isDestSP || !isEmitNotSP) return false;

    const protocolData = initialTaxRates.find(r => r.destinationStateCode === nfeData.destUf && r.interstateRate.hasOwnProperty(nfeData.emitUf as 'ES' | 'SP'));
    const hasProtocol = protocolData?.protocol ?? true; // Assume protocol if not found to be safe

    return !hasProtocol;
  };

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-lg border-none">
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
            <TabsTrigger value="results">Resultado da Validação ({results.length})</TabsTrigger>
            <TabsTrigger value="history"><History className="mr-2" />Histórico ({history.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="results" className="mt-4">
            {results.length > 0 ? (
              <Carousel className="w-full" opts={{ align: "start" }}>
                <CarouselContent>
                  {results.map((result) => {
                    const hasDivergence = Object.values(result.calculationValidations).some(v => v.check === 'divergent');
                    const overallStatus = result.status === 'error' ? 'Erro' : hasDivergence ? 'Divergente' : 'Validada';
                    const showStButton = checkStCalculationNeeded(result.nfeData);

                    return (
                      <CarouselItem key={result.id}>
                        <div className="h-full p-1">
                          <Card className="h-full flex flex-col">
                            <CardHeader>
                              <div className="flex justify-between items-start gap-2">
                                <CardTitle className="truncate text-lg">{result.fileName}</CardTitle>
                                <Badge variant={overallStatus === 'Erro' ? 'destructive' : overallStatus === 'Divergente' ? 'secondary' : 'default'} className="flex-shrink-0">
                                  {overallStatus}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-6 flex-grow">
                              {result.status === 'error' ? (
                                  <Alert variant="destructive" className="h-full">
                                      <AlertTriangle className="h-4 w-4" />
                                      <AlertTitle>{result.messages[0].message}</AlertTitle>
                                      <AlertDescription>{result.messages[0].details}</AlertDescription>
                                  </Alert>
                              ) : (
                              <>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Card>
                                      <CardHeader className="p-3"><CardTitle className="text-base">Emitente</CardTitle></CardHeader>
                                      <CardContent className="p-3 text-sm space-y-1">
                                          <p className="truncate font-semibold">{result.nfeData?.emitRazaoSocial || "N/A"}</p>
                                          <p className="text-muted-foreground">CNPJ: {result.nfeData?.emitCnpj || "N/A"}</p>
                                      </CardContent>
                                  </Card>
                                  <Card>
                                      <CardHeader className="p-3"><CardTitle className="text-base">Destinatário</CardTitle></CardHeader>
                                      <CardContent className="p-3 text-sm space-y-1">
                                          <p className="truncate font-semibold">{result.nfeData?.destRazaoSocial || "N/A"}</p>
                                          <p className="text-muted-foreground">CNPJ: {result.nfeData?.destCnpj || "N/A"}</p>
                                      </CardContent>
                                  </Card>
                                  <div>
                                    <h4 className="font-semibold mb-2 text-primary">Tipo de Entrada</h4>
                                    <RadioGroup value={result.selectedInputType} onValueChange={(v: NfeInputType) => updateResultInputType(result.id, v)} className="flex flex-wrap gap-4">
                                      {NfeInputTypes.map(type => (
                                        <div key={type} className="flex items-center space-x-2">
                                          <RadioGroupItem value={type} id={`${result.id}-${type}`} />
                                          <Label htmlFor={`${result.id}-${type}`}>{type}</Label>
                                        </div>
                                      ))}
                                    </RadioGroup>
                                  </div>
                              </div>
                              
                              {showStButton && (
                                <Button className="w-full" onClick={() => handleCalculateSt(result)}>
                                    <Calculator className="mr-2" />
                                    Calcular ICMS-ST
                                </Button>
                              )}

                              <Tabs defaultValue="fiscal">
                                  <TabsList className="grid w-full grid-cols-2">
                                      <TabsTrigger value="fiscal">Dados Fiscais</TabsTrigger>
                                      <TabsTrigger value="products">Produtos ({result.nfeData?.products.length})</TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="fiscal" className="mt-4 space-y-4">
                                      <Card>
                                          <CardHeader><CardTitle>Geral</CardTitle></CardHeader>
                                          <CardContent className="space-y-2 text-sm">
                                            <div className="flex justify-between"><span className="text-muted-foreground">Natureza:</span><span className="font-medium">{result.nfeData?.natOp || "N/A"}</span></div>
                                            <div className="flex justify-between"><span className="text-muted-foreground">Nº NFe:</span><span className="font-medium">{result.nfeData?.nNf || "N/A"}</span></div>
                                            <div className="flex justify-between"><span className="text-muted-foreground">Emissão:</span><span className="font-medium">{result.nfeData?.dhEmi ? format(new Date(result.nfeData.dhEmi), "dd/MM/yy HH:mm") : 'N/A'}</span></div>
                                            <div className="flex justify-between"><span className="text-muted-foreground">Frete Total:</span><span className="font-medium">R$ {result.nfeData?.vFrete || "0.00"}</span></div>
                                            <div className="flex justify-between"><span className="text-muted-foreground">Valor Total:</span><span className="font-bold text-base text-primary">R$ {result.nfeData?.vNF || "0.00"}</span></div>
                                          </CardContent>
                                      </Card>
                                      <Card>
                                          <CardHeader><CardTitle>Validação dos Cálculos</CardTitle></CardHeader>
                                          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              <ValidationStatusDisplay validation={result.calculationValidations.vBC} />
                                              <ValidationStatusDisplay validation={result.calculationValidations.vICMS} />
                                              <ValidationStatusDisplay validation={result.calculationValidations.vIPI} />
                                              <ValidationStatusDisplay validation={result.calculationValidations.vBCST} />
                                              <ValidationStatusDisplay validation={result.calculationValidations.vICMSST} />
                                          </CardContent>
                                      </Card>
                                  </TabsContent>
                                  <TabsContent value="products" className="mt-4">
                                      <div className="rounded-md border overflow-x-auto bg-background/50">
                                      <Table>
                                          <TableHeader>
                                              <TableRow>
                                                  <TableHead>Item</TableHead>
                                                  <TableHead>NCM</TableHead>
                                                  <TableHead>CST</TableHead>
                                                  <TableHead>CFOP</TableHead>
                                                  <TableHead>Frete</TableHead>
                                                  <TableHead>Vl. ICMS</TableHead>
                                                  <TableHead>Vl. IPI</TableHead>
                                                  <TableHead>MVA-ST</TableHead>
                                                  <TableHead>Red. BC ST</TableHead>
                                                  <TableHead>Vl. ICMS-ST</TableHead>
                                              </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                              {result.nfeData?.products.map(p => (
                                                  <TableRow key={p.item}>
                                                      <TableCell className="font-medium max-w-xs truncate" title={p.xProd}>{p.xProd}</TableCell>
                                                      <TableCell>{p.ncm || 'N/A'}</TableCell>
                                                      <TableCell>{p.cst}</TableCell>
                                                      <TableCell>{p.cfop}</TableCell>
                                                      <TableCell>R$ {p.vFrete || '0.00'}</TableCell>
                                                      <TableCell>R$ {p.icms.vICMS || '0.00'}</TableCell>
                                                      <TableCell>R$ {p.ipi.vIPI || '0.00'}</TableCell>
                                                      <TableCell>{formatPercent(p.icmsSt.pMVAST)}</TableCell>
                                                      <TableCell>{formatPercent(p.icmsSt.pRedBCST)}</TableCell>
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
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    )
                  })}
                </CarouselContent>
                <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2" />
              </Carousel>
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
            <Card>
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
                  {history.length > 0 ? history.map(item => {
                        const status = statusMap[item.overallValidation] || statusMap['N/A'];
                        return (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium truncate max-w-xs">{item.fileName}</TableCell>
                              <TableCell>{format(new Date(item.date), "dd/MM/yy HH:mm")}</TableCell>
                              <TableCell>
                                {item.icmsStStatus && item.icmsStStatus !== 'not_applicable' && (
                                    <Badge variant={item.icmsStStatus === 'divergent' ? 'destructive' : 'default'}>{item.icmsStStatus === 'divergent' ? 'Divergente' : 'Validado'}</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                 <Badge variant={status.badge as any}>
                                   {status.label}
                                 </Badge>
                              </TableCell>
                            </TableRow>
                        )
                     }) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Nenhum histórico encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              </Card>
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
