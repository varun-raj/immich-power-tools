import { CHART_COLORS, PIE_CONFIG } from "@/config/constants/chart.constant";
import React, { useMemo } from "react";
import { Label, Pie, PieChart as PieChartRoot } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart";
import { int } from "drizzle-orm/mysql-core";

export interface IPieChartData { label: string; value: number }

interface ChartProps {
  data: IPieChartData[];
  topLabel?: string;
  loading?: boolean;
  errorMessage?: string | null;
}
export default function PieChart({ data: _data, topLabel, loading, errorMessage }: ChartProps) {
  const topItem = _data[0];

  const data = useMemo(() => _data.map((item, index) => ({
    ...item,
    fill: CHART_COLORS[index] || "#000000",
  })), [_data]);

  const chartConfig = useMemo(() => {
    let config: ChartConfig = {};
    data.map((data) => {
      config[data.label as string] = {
        label: data.label,
        color: "hsl(var(--chart-1))",
      };
    });
    return config;
  }, [data]);


  if (loading) {
    return <p>Loading...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
    <PieChartRoot accessibilityLayer>
      <ChartTooltip
        cursor={false}
        content={<ChartTooltipContent hideLabel />}
      />
      <Pie
        dataKey="value"
        data={data}
        nameKey="label"
        radius={PIE_CONFIG.radius}
        innerRadius={PIE_CONFIG.innerRadius}
        strokeWidth={PIE_CONFIG.strokeWidth}
      >
        {topItem && (
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {topItem.value.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {topLabel || `(${topItem.label})`}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        )}
      </Pie>
    </PieChartRoot>
    </ChartContainer>
  );
}
