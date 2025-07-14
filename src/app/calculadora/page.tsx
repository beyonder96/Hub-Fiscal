import { Header } from "@/components/header";
import { SimpleCalculator } from "@/components/simple-calculator";

export default function CalculadoraPage() {
  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <SimpleCalculator />
      </main>
    </>
  );
}
