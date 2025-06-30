import { Header } from "@/components/header";
import { ChamadoForm } from "@/components/chamado-form";

export default function ChamadosPage() {
  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <ChamadoForm />
      </main>
    </>
  );
}
