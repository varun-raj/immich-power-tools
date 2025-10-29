import { Card } from "@/components/ui/card";
import PieChart, { IPieChartData } from "@/components/ui/pie-chart";
import { getGeoPhotosStatistics } from "@/handlers/api/analytics.handler";
import React, { useEffect, useState } from "react";

export default function GeoPhotosChart() {
  const [chartData, setChartData] = useState<IPieChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getGeoPhotosStatistics();
      setChartData(data);
    } catch (error: any) {
      setErrorMessage(error?.message || "Failed to fetch geo photos data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card
      title="Geo Data"
      description="Distribution of photos with and without geo data"
    >
      <PieChart 
        data={chartData} 
        loading={loading} 
        errorMessage={errorMessage}
      />         
    </Card>
  );
}
