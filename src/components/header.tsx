import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="py-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-xl font-semibold font-headline text-primary">
          Tax Rate Finder
        </h1>
        <ThemeToggle />
      </div>
    </header>
  );
}
