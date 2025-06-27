"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Placeholder } from "@/components/placeholder";
import { TaxForm } from "@/components/tax-form";
import { TaxResultCard } from "@/components/tax-result-card";
import type { CalculatedRates, TaxFormData } from "@/lib/definitions";
import { findTaxRate } from "@/lib/tax-data";

export default function ConsultaAliquotaPage() {
  const [result, setResult] = useState<CalculatedRates | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (data: TaxFormData) => {
    setIsSubmitting(true);
    setResult(null);
    setNotFound(false);

    // Simulate network delay
    setTimeout(() => {
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
    }, 500);
  };

  const handleClear = () => {
    setResult(null);
    setNotFound(false);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-muted/30 dark:bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <TaxForm
              onSearch={handleSearch}
              isSubmitting={isSubmitting}
              onClear={handleClear}
            />
          </div>
          <div className="space-y-6">
            {result || notFound ? (
              <TaxResultCard result={result} notFound={notFound} />
            ) : (
              <Placeholder />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
