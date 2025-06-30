import { Header } from "@/components/header";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

const CalculoIcmsSt = dynamic(() => import('@/components/calculo-icms-st'), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-4xl mx-auto">
      <Skeleton className="h-[500px] w-full" />
    </div>
  )
});

export default function CalculoIcmsStPage() {
  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <CalculoIcmsSt />
      </main>
    </>
  );
}
