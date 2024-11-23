import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";
import { CHART_COLORS } from "@/config/constants/chart.constant";

export interface ILineChartData {
  label: string;
  value: number;
}

interface ChartProps {
  data: ILineChartData[];
  topLabel?: string;
  loading?: boolean;
  errorMessage?: string | null;
}

export function LineChartDots({
  data: _data,
  topLabel,
  loading,
  errorMessage,
}: ChartProps) {
  const data = useMemo(
    () =>
      _data.map((item, index) => ({
        ...item,
        fill: CHART_COLORS[index] || "#000000",
      })),
    [_data]
  );

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
      <LineChart
        accessibilityLayer
        data={data}
        
      >
        <CartesianGrid vertical={false} />
        <YAxis /> {/* Added YAxis for the count */}
        <XAxis padding={{ left: 20 }} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent indicator="line" nameKey="label" hideLabel />
          }
        />
        <Line
          dataKey="value"
          type="natural"
          stroke="#FF6B6B"
          strokeWidth={2}
          dot={{
            fill: "var(--color-visitors)",
          }}
          activeDot={{
            r: 6,
          }}
        >
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
            dataKey="label"
            formatter={(value: keyof typeof chartConfig) =>
              chartConfig[value]?.label
            }
          />
        </Line>
      </LineChart>
    </ChartContainer>
  );
}
