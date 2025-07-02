import { Header } from "@/components/header";
import { PrestadorLookup } from "@/components/admin-prestador-lookup";

export default function ConsultaPrestadorPage() {
  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <PrestadorLookup />
      </main>
    </>
  );
}
