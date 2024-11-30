import { Card } from "@/components/ui/card";
import PieChart, { IPieChartData } from "@/components/ui/pie-chart";
import { getExifDistribution, ISupportedEXIFColumns } from "@/handlers/api/analytics.handler";
import React, { useEffect, useState } from "react";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

export interface IEXIFDistributionProps {
  column: ISupportedEXIFColumns;
  title: string;
  description: string;
  tooltipValueFormatter?: (value?: number | string | undefined | ValueType) => string;
}

export default function EXIFDistribution(
  { column, title, description, tooltipValueFormatter }: IEXIFDistributionProps
) {
  const [chartData, setChartData] = useState<IPieChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = async () => {
    return getExifDistribution(column)
      .then(setChartData)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [column]);

  return (
    <Card
      title={title}
      description={description}
    >
      <PieChart data={chartData} loading={loading} errorMessage={errorMessage} tooltipValueFormatter={tooltipValueFormatter}  />         
    </Card>
  );
}
