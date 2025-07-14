
"use client";

import { changelogData } from "@/lib/changelog-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GitCommit, Rocket, Wrench, ArrowUpCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const typeMap = {
  feature: {
    icon: <Rocket className="h-4 w-4" />,
    badge: "default",
    label: "Novo Recurso",
  },
  fix: {
    icon: <Wrench className="h-4 w-4" />,
    badge: "destructive",
    label: "Correção",
  },
  improvement: {
    icon: <ArrowUpCircle className="h-4 w-4" />,
    badge: "secondary",
    label: "Melhoria",
  },
};

export function Changelog() {
  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Registro de Atualizações
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Acompanhe todas as novidades e melhorias do sistema.
        </p>
      </header>

      <div className="relative">
        <div
          className="absolute left-0 top-0 h-full w-0.5 bg-border -translate-x-1/2 ml-[1.125rem]"
          aria-hidden="true"
        ></div>

        <div className="space-y-12">
          {changelogData.map((version) => (
            <div key={version.version} className="relative flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-background">
                    <GitCommit className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>

              <div className="flex-1 pt-1">
                <Card className="shadow-sm">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <CardTitle>Versão {version.version}</CardTitle>
                        <time className="text-sm text-muted-foreground">
                            {format(new Date(version.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                        </time>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {version.changes.map((change, index) => {
                        const typeInfo = typeMap[change.type];
                        return (
                          <li key={index} className="flex items-start gap-3">
                            <Badge variant={typeInfo.badge} className="flex-shrink-0 w-[120px] justify-center">
                              {typeInfo.icon}
                              {typeInfo.label}
                            </Badge>
                            <p className="text-sm text-foreground/90 pt-0.5">
                              {change.description}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
