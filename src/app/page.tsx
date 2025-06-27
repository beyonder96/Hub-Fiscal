import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Clock, Users2 } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
    title: "Resolução Rápida",
    description: "Atendimento especializado com tempo médio de resposta de 24 horas.",
    bgColor: "bg-green-500/10",
  },
  {
    icon: <Clock className="h-8 w-8 text-blue-500" />,
    title: "Acompanhamento",
    description: "Monitore o progresso dos seus chamados em tempo real.",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: <Users2 className="h-8 w-8 text-purple-500" />,
    title: "Equipe Especializada",
    description: "Profissionais experientes em questões fiscais e tributárias.",
    bgColor: "bg-purple-500/10",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-20 md:py-32 text-center bg-grid-slate-100/[0.05] dark:bg-grid-slate-900/[0.2]">
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
              Gerencie seus chamados fiscais com eficiência. Nossa plataforma
              moderna oferece acompanhamento em tempo real e resolução ágil
              para suas necessidades.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-accent to-primary text-white font-bold">
                Abrir Chamado
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Ver Meus Chamados
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center shadow-md hover:shadow-lg transition-shadow duration-300 border-transparent hover:border-primary/20">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${feature.bgColor} mb-6`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 border-t">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Sistema Fiscal. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
