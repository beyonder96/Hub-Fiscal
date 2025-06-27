
"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Placeholder } from "@/components/placeholder";
import { TaxForm } from "@/components/tax-form";
import { TaxRatesChart } from "@/components/tax-rates-chart";
import { TaxResultCard } from "@/components/tax-result-card";
import type { CalculatedRates, TaxFormData } from "@/lib/definitions";
import { findTaxRate } from "@/lib/tax-data";
import { MapPin } from "lucide-react";

export default function ConsultaAliquotaPage() {
  const [result, setResult] = useState<CalculatedRates | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (data: TaxFormData) => {
    setIsSubmitting(true);
    setResult(null);
    setNotFound(false);

    const destinationData = findTaxRate(data.destination);

    if (destinationData) {
      setResult({
        origin: data.origin,
        destination: destinationData,
      });
    } else {
      setNotFound(true);
    }

    setIsSubmitting(false);
  };

  const handleClear = () => {
    setResult(null);
    setNotFound(false);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-secondary/20 dark:bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-12 text-center">
          <div className="container mx-auto px-4">
            <div className="mx-auto w-fit mb-4 p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                <MapPin className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Consultar Alíquota por Origem e Destino
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Informe os dados fiscais abaixo para descobrir a alíquota interestadual, de itens importados e interna de destino.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              <div className="lg:col-span-2">
                <TaxForm
                  onSearch={handleSearch}
                  isSubmitting={isSubmitting}
                  onClear={handleClear}
                />
              </div>
              <div className="lg:col-span-3 space-y-8">
                {result || notFound ? (
                  <>
                    <TaxResultCard result={result} notFound={notFound} />
                    {result && (
                       <TaxRatesChart data={result.destination} highlight={result.origin} />
                    )}
                  </>
                ) : (
                  <Placeholder />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
