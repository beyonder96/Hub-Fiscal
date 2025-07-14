
import { Header } from "@/components/header";
import { Changelog } from "@/components/changelog";

export default function UpdatesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <Changelog />
      </main>
    </>
  );
}
