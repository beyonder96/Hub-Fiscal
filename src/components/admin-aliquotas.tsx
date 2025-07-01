
"use client";

import { useState, useEffect } from "react";
import type { TaxRateData } from "@/lib/definitions";
import { initialTaxRates } from "@/lib/tax-data";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Save, History } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export function AdminAliquotas() {
  const [taxRates, setTaxRates] = useState<TaxRateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("taxRates");
      if (stored) {
        setTaxRates(JSON.parse(stored));
      } else {
        setTaxRates(initialTaxRates);
        localStorage.setItem("taxRates", JSON.stringify(initialTaxRates));
      }
    } catch (error) {
      console.error("Failed to load tax rates", error);
      setTaxRates(initialTaxRates);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (stateCode: string, field: keyof TaxRateData | `interstateRate.${'ES' | 'SP'}`, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setTaxRates(prevRates => 
      prevRates.map(rate => {
        if (rate.destinationStateCode === stateCode) {
          if (field.startsWith('interstateRate.')) {
            const origin = field.split('.')[1] as 'ES' | 'SP';
            return {
              ...rate,
              interstateRate: {
                ...rate.interstateRate,
                [origin]: numericValue,
              },
            };
          }
          // Type assertion to handle numeric fields
          return { ...rate, [field]: numericValue as any };
        }
        return rate;
      })
    );
  };

  const handleSaveChanges = () => {
    localStorage.setItem("taxRates", JSON.stringify(taxRates));
    window.dispatchEvent(new Event('storage')); // Notify other components
    toast({
      title: "Alíquotas salvas!",
      description: "As alíquotas foram atualizadas com sucesso.",
    });
  };

  const handleResetToDefaults = () => {
    setTaxRates(initialTaxRates);
    localStorage.setItem("taxRates", JSON.stringify(initialTaxRates));
     window.dispatchEvent(new Event('storage'));
    toast({
      title: "Alíquotas restauradas!",
      description: "Os valores padrão foram restaurados.",
    });
  };

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-64 w-full" />
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <CardTitle>Gerenciamento de Alíquotas</CardTitle>
          <CardDescription>Edite as alíquotas interestaduais e internas dos estados.</CardDescription>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <Button onClick={handleSaveChanges} className="flex-1 md:flex-initial"><Save className="mr-2" /> Salvar</Button>
            <Button variant="outline" onClick={handleResetToDefaults} className="flex-1 md:flex-initial"><History className="mr-2"/> Restaurar</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Estado (UF)</TableHead>
                <TableHead>Alíq. Inter (SP %)</TableHead>
                <TableHead>Alíq. Inter (ES %)</TableHead>
                <TableHead>Alíq. Interna (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxRates.sort((a,b) => a.destinationStateName.localeCompare(b.destinationStateName)).map(rate => (
                <TableRow key={rate.destinationStateCode}>
                  <TableCell className="font-medium">{rate.destinationStateName} ({rate.destinationStateCode})</TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      step="0.1"
                      value={rate.interstateRate.SP}
                      onChange={(e) => handleInputChange(rate.destinationStateCode, 'interstateRate.SP', e.target.value)}
                      className="w-28"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      step="0.1" 
                      value={rate.interstateRate.ES}
                      onChange={(e) => handleInputChange(rate.destinationStateCode, 'interstateRate.ES', e.target.value)}
                      className="w-28"
                    />
                  </TableCell>
                  <TableCell>
                     <Input 
                      type="number" 
                      step="0.1"
                      value={rate.internalDestinationRate}
                      onChange={(e) => handleInputChange(rate.destinationStateCode, 'internalDestinationRate', e.target.value)}
                      className="w-28"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
