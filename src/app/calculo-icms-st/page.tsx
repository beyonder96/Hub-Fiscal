
"use client";

import { Header } from "@/components/header";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const CalculoIcmsSt = dynamic(() => import('@/components/calculo-icms-st'), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-4xl mx-auto">
      <Skeleton className="h-[500px] w-full" />
    </div>
  )
});

function CalculoPageContent() {
  const searchParams = useSearchParams();
  const stData = searchParams.get('stData');
  
  let prefillData = null;
  try {
    if (stData) {
        prefillData = JSON.parse(stData);
    }
  } catch(e) {
      console.error("Failed to parse stData from URL", e);
  }


  return <CalculoIcmsSt prefillData={prefillData} />;
}


export default function CalculoIcmsStPage() {
  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <Suspense fallback={<div className="w-full max-w-4xl mx-auto"><Skeleton className="h-[500px] w-full" /></div>}>
          <CalculoPageContent />
        </Suspense>
      </main>
    </>
  );
}
