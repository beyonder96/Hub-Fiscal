import { Header } from "@/components/header";
import { XmlValidator } from "@/components/xml-validator";

export default function ValidadorXmlPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30 dark:bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <XmlValidator />
      </main>
    </div>
  );
}
