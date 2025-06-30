import { Header } from "@/components/header";
import { CalculoIcmsSt } from "@/components/calculo-icms-st";

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
