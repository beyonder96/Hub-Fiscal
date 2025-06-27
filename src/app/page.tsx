
"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { TaxForm } from "@/components/tax-form";
import { TaxResultCard } from "@/components/tax-result-card";
import { AiAssistant } from "@/components/ai-assistant";
import { findTaxRate } from "@/lib/tax-data";
import type { CalculatedRates, TaxFormData } from "@/lib/definitions";
import { Separator } from "@/components/ui/separator";
import { TaxRatesChart } from "@/components/tax-rates-chart";
import { Placeholder } from "@/components/placeholder";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [result, setResult] = useState<CalculatedRates | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = (data: TaxFormData) => {
    setIsSubmitting(true);
    setNotFound(false);
    setResult(null);

    // Simulate network delay for better UX
    setTimeout(() => {
      const rateInfo = findTaxRate(data.destination);
      if (rateInfo) {
        setResult({
          origin: data.origin,
          destination: rateInfo,
          isImported: data.isImported,
        });
      } else {
        setNotFound(true);
      }
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary/20 dark:bg-card/20">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
              Consultar Alíquota por Origem e Destino
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Informe os dados fiscais abaixo para descobrir a alíquota interna
              de destino com base em nossa base técnica.
            </p>
          </section>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-xl border">
            <TaxForm onSearch={handleSearch} isSubmitting={isSubmitting} />
          </div>

          <div className="mt-8">
            {isSubmitting && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Skeleton className="h-12 w-3/4" />
                  <Skeleton className="h-8 w-1/2" />
                  <div className="space-y-4 pt-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-12 w-3/4" />
                  <Skeleton className="h-8 w-1/2" />
                   <Skeleton className="h-64 w-full pt-4" />
                </div>
              </div>
            )}
            {!isSubmitting && result && (
              <div className="grid md:grid-cols-2 gap-8 animate-in fade-in-50">
                <TaxResultCard result={result} notFound={false} />
                <TaxRatesChart data={result.destination} highlight={result.origin} />
              </div>
            )}
            {!isSubmitting && notFound && (
              <TaxResultCard result={null} notFound={true} />
            )}
            {!isSubmitting && !result && !notFound && (
              <Placeholder />
            )}
          </div>
        </div>
      </main>
      <AiAssistant />
      <footer className="py-6 mt-12 bg-card/50">
        <Separator />
        <p className="text-center text-sm text-muted-foreground pt-6">
          © {new Date().getFullYear()} Tax Rate Finder. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
