
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { TaxFormData, TaxRateData } from "@/lib/definitions";
import { taxFormSchema } from "@/lib/definitions";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Search, ArrowRight } from "lucide-react";

interface TaxFormProps {
  onSearch: (data: TaxFormData) => void;
  onClear: () => void;
  isSubmitting: boolean;
  rates: TaxRateData[];
}

export function TaxForm({ onSearch, onClear, isSubmitting, rates }: TaxFormProps) {
  const form = useForm<TaxFormData>({
    resolver: zodResolver(taxFormSchema),
    defaultValues: {
      origin: undefined,
      destination: undefined,
    },
  });

  const sortedStates = [...rates].sort((a, b) =>
    a.destinationStateName.localeCompare(b.destinationStateName)
  );
  
  const handleClear = () => {
    form.reset();
    onClear();
  };

  return (
    <Card className="shadow-sm border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Search className="h-6 w-6 text-primary"/>
          Estados de Origem e Destino
        </CardTitle>
        <CardDescription>
          Selecione os estados para consulta das alíquotas.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSearch)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado de Origem *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado de origem" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ES">Espírito Santo (ES)</SelectItem>
                      <SelectItem value="SP">São Paulo (SP)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado de Destino *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado de destino" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sortedStates.map((state) => (
                        <SelectItem
                          key={state.destinationStateCode}
                          value={state.destinationStateCode}
                        >
                          {state.destinationStateName} ({state.destinationStateCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between rounded-lg bg-muted/70 p-3 text-sm">
                <p className="font-medium text-muted-foreground">Alíquota de Itens Importados:</p>
                <p className="font-bold text-foreground">4% (Fixa)</p>
            </div>
          </CardContent>
          <CardFooter className="flex items-center gap-2">
            <Button type="submit" className="w-full flex-grow bg-gradient-to-r from-accent to-primary text-white" disabled={isSubmitting}>
              <Search className="h-4 w-4" />
              <span>{isSubmitting ? "Consultando..." : "Consultar Alíquotas"}</span>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={handleClear}>
              Limpar
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
