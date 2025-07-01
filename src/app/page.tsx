import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calculator, FileCode, FileSpreadsheet, FileText, Search } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "Abrir Chamado",
    description: "Registre uma nova solicitação de suporte para nossa equipe fiscal.",
    href: "/chamados",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-300"
  },
  {
    icon: <Calculator className="h-8 w-8 text-primary" />,
    title: "Consulta de Alíquota",
    description: "Consulte rapidamente as alíquotas de ICMS entre estados.",
    href: "/consulta-aliquota",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-300"
  },
  {
    icon: <FileCode className="h-8 w-8 text-primary" />,
    title: "Validador de XML",
    description: "Verifique a estrutura e a validade de arquivos XML de notas fiscais.",
    href: "/validador-xml",
    bgColor: "bg-green-500/10",
    textColor: "text-green-300"
  },
  {
    icon: <FileSpreadsheet className="h-8 w-8 text-primary" />,
    title: "Cálculo ICMS-ST",
    description: "Calcule o ICMS-ST de suas notas de forma rápida e precisa.",
    href: "/calculo-icms-st",
    bgColor: "bg-teal-500/10",
    textColor: "text-teal-300"
  },
   {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: "Pesquisa de TES",
    description: "Encontre informações detalhadas sobre o Tipo de Entrada e Saída.",
    href: "/pesquisa-tes",
    bgColor: "bg-yellow-500/10",
    textColor: "text-yellow-300"
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="py-20 md:py-32 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              <span className="text-foreground">Suporte </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                Fiscal
              </span>
              <br />
              <span className="text-foreground">Inteligente e Rápido</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
              Sua central de ferramentas para simplificar a rotina fiscal. Consulte alíquotas, valide XML, abra chamados e muito mais.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-accent to-primary text-white font-bold" asChild>
                <Link href="/chamados">
                  Abrir Chamado
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/meus-chamados">
                  Ver Meus Chamados
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Nossos Recursos</h2>
              <p className="text-muted-foreground mt-2">Ferramentas para agilizar seu dia a dia.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.href} className="text-left shadow-md hover:shadow-xl transition-shadow duration-300 border-transparent hover:border-primary/20 group">
                   <CardHeader className="flex-row items-center gap-4 space-y-0">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${feature.bgColor}`}>
                      <div className={feature.textColor}>{feature.icon}</div>
                    </div>
                     <CardTitle className="text-xl font-bold text-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <Button variant="link" className="p-0" asChild>
                      <Link href={feature.href}>
                        Acessar Recurso
                        <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 border-t mt-auto">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Sistema Fiscal. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
