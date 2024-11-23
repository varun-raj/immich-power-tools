"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useMemo } from "react"
import { CHART_COLORS } from "@/config/constants/chart.constant"

export const description = "A radar chart with dots"
export interface IRadarChartData { 
  label: string; 
  value: number;
  color?: string; // Add color property here
}

interface ChartProps {
  data: IRadarChartData[];
  topLabel?: string;
  loading?: boolean;
  errorMessage?: string | null;
}

const chartConfig = {
  label: {
    label: "label",
    color: "#FF0000",
  },
} satisfies ChartConfig

export default function RadarChartDots({ data: _data, topLabel, loading, errorMessage }: ChartProps) {
  const chartData = _data

  return (
    <Card>
      
      <CardContent className="pb-0 border-none">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] border-none"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="label" />
            <PolarGrid stroke="#FFFFFF" strokeDasharray="3 3" /> {/* Set grid color to white */}
            <Radar
              dataKey="value"
              fill="#FF0000"
              fillOpacity={0.8}
              dot={({ cx, cy, payload }) => (
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={payload.color} // Set color dynamically
                  fillOpacity={1}
                />
              )}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
