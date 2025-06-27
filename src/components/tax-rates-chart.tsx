
"use client";

import type { BarProps } from "recharts";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import type { TaxRateData } from "@/lib/definitions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface TaxRatesChartProps {
  data: TaxRateData | null;
  highlight: "ES" | "SP";
}

const chartConfig = {
  value: {
    label: "Alíquota",
  },
  imported: {
    label: "Importado",
    color: "hsl(var(--accent))",
  },
  interstate: {
    label: "Interestadual",
    color: "hsl(var(--primary))",
  },
  internal: {
    label: "Interna Destino",
    color: "hsl(var(--secondary))",
  },
} satisfies ChartConfig;

export function TaxRatesChart({ data, highlight }: TaxRatesChartProps) {
  if (!data) return null;

  const chartData = [
    { name: "Importado", value: data.importedRate, fill: "var(--color-imported)" },
    { name: `Interestadual (${highlight})`, value: data.interstateRate[highlight], fill: "var(--color-interstate)" },
    { name: "Interna Destino", value: data.internalDestinationRate, fill: "var(--color-internal)" },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Comparativo de Alíquotas</CardTitle>
        <CardDescription>
          Visualização para {data.destinationStateName} ({data.destinationStateCode})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 20 }}
            accessibilityLayer
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              dataKey="value"
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fontSize: 12 }}
              className="font-medium"
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              content={
                <ChartTooltipContent
                  formatter={(value) => `${value}%`}
                  hideIndicator
                />
              }
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
