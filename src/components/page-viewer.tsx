
"use client";

import type { ManualPage } from "@/lib/definitions";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface PageViewerProps {
  page: ManualPage;
}

export function PageViewer({ page }: PageViewerProps) {
  const lastUpdated = `Última atualização em ${format(new Date(page.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="flex-shrink-0 p-3 border-b flex flex-wrap justify-between items-center gap-2">
        <h1 className="text-xl font-bold flex-grow min-w-[200px]">{page.title}</h1>
        <div className="flex items-center gap-2 flex-wrap justify-end flex-grow">
          <p className="flex items-center gap-2 text-xs text-muted-foreground mr-auto">
            <Clock className="h-3 w-3" />
            {lastUpdated}
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div
            dangerouslySetInnerHTML={{ __html: page.content }}
            className={cn(
              "prose dark:prose-invert max-w-none p-4 w-full h-full"
            )}
        />
      </div>
    </div>
  );
}
