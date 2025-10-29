import { Card } from "@/components/ui/card";
import PieChart, { IPieChartData } from "@/components/ui/pie-chart";
import { getAlbumPhotosStatistics } from "@/handlers/api/analytics.handler";
import React, { useEffect, useState } from "react";

export default function AlbumPhotosChart() {
  const [chartData, setChartData] = useState<IPieChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAlbumPhotosStatistics();
      setChartData(data);
    } catch (error: any) {
      setErrorMessage(error?.message || "Failed to fetch album photos data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card
      title="Album Distribution"
      description="Distribution of photos in and out of albums"
    >
      <PieChart 
        data={chartData} 
        loading={loading} 
        errorMessage={errorMessage}
      />         
    </Card>
  );
}
