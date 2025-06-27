"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { TaxFormData } from "@/lib/definitions";
import { taxFormSchema } from "@/lib/definitions";
import { taxRates } from "@/lib/tax-data";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Switch } from "@/components/ui/switch";
import { ArrowRight } from "lucide-react";

interface TaxFormProps {
  onSearch: (data: TaxFormData) => void;
  isSubmitting: boolean;
}

export function TaxForm({ onSearch, isSubmitting }: TaxFormProps) {
  const form = useForm<TaxFormData>({
    resolver: zodResolver(taxFormSchema),
    defaultValues: {
      isImported: false,
    },
  });

  const sortedStates = [...taxRates].sort((a, b) =>
    a.destinationStateName.localeCompare(b.destinationStateName)
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSearch)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado de Origem</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
                <FormLabel>Estado de Destino</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
        </div>

        <FormField
          control={form.control}
          name="isImported"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Item Importado?</FormLabel>
                <FormDescription>
                  Marque se o item é importado para aplicar a alíquota de 4%.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting} size="lg">
          {isSubmitting ? 'Buscando...' : 'Buscar Alíquota'}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </form>
    </Form>
  );
}
