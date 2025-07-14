
"use client";

import { useState, useEffect } from "react";
import { Placeholder } from "@/components/placeholder";
import { TaxForm } from "@/components/tax-form";
import { TaxResultCard } from "@/components/tax-result-card";
import type { CalculatedRates, TaxFormData, TaxRateData } from "@/lib/definitions";
import { initialTaxRates } from "@/lib/tax-data";

export default function ConsultaAliquotaPage() {
  const [result, setResult] = useState<CalculatedRates | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [allTaxRates, setAllTaxRates] = useState<TaxRateData[]>([]);

  useEffect(() => {
    const loadRates = () => {
        try {
            const stored = localStorage.getItem("taxRates");
            if (stored) {
                setAllTaxRates(JSON.parse(stored));
            } else {
                setAllTaxRates(initialTaxRates);
                localStorage.setItem("taxRates", JSON.stringify(initialTaxRates));
            }
        } catch (error) {
            console.error("Failed to load tax rates", error);
            setAllTaxRates(initialTaxRates);
        }
    };

    loadRates();
    window.addEventListener('storage', loadRates);
    return () => {
        window.removeEventListener('storage', loadRates);
    };
  }, []);

  const handleSearch = (data: TaxFormData) => {
    setIsSubmitting(true);
    setResult(null);
    setNotFound(false);

    // Simulate network delay
    setTimeout(() => {
      const destinationData = allTaxRates.find(rate => rate.destinationStateCode === data.destination);

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div>
        <TaxForm
          rates={allTaxRates}
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
  );
}
