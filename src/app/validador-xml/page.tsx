import { Header } from "@/components/header";
import { XmlValidator } from "@/components/xml-validator";

export default function ValidadorXmlPage() {
  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <XmlValidator />
      </main>
    </>
  );
}
