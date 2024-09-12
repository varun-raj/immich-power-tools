import { Inter } from "next/font/google";
import PageLayout from "@/components/layouts/PageLayout";
import Header from "@/components/shared/Header";
import EXIFDistribution, {
  IEXIFDistributionProps,
} from "@/components/analytics/exif/EXIFDistribution";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ContributionGraph from "@/components/analytics/exif/contributiongraph";
import { useEffect, useState } from "react";
import { getAssetStatistics } from "@/handlers/api/analytics.handler";

const inter = Inter({ subsets: ["latin"] });

const exifCharts: IEXIFDistributionProps[] = [
  {
    column: "make",
    title: "Make",
    description: "Distribution of camera make",
  },
  {
    column: "model",
    title: "Model",
    description: "Distribution of camera model",
  },
  {
    column: "focal-length",
    title: "Focal Length",
    description: "Distribution of focal length",
  },
  {
    column: "city",
    title: "City",
    description: "Distribution of city",
  },
  {
    column: "state",
    title: "State",
    description: "Distribution of state",
  },
  {
    column: "country",
    title: "Country",
    description: "Distribution of country",
  },
  {
    column: "iso",
    title: "ISO",
    description: "Distribution of ISO",
  },
  {
    column: "exposureTime",
    title: "Exposure Time",
    description: "Distribution of exposure time",
  },
  {
    column: "lensModel",
    title: "Lens Model",
    description: "Distribution of lens model",
  },
  {
    column: "projectionType",
    title: "Projection Type",
    description: "Distribution of projection type",
  },
];
export default function ExifDataAnalytics() {
  const [statistics, setStatistics] = useState({ images: 0, videos: 0, total: 0 });
  const [loading, setLoading] = useState(false);


  const fetchStatisticsData = async () => {
    setLoading(true); // Set loading to true when starting to fetch data
    return getAssetStatistics()
      .then((data) => {
        console.log("asdasdadasd")
        setStatistics(data); // Update statistics with the returned data
      })
      .finally(() => setLoading(false)); // Stop loading after data is fetched
  };

  useEffect(() => {
    fetchStatisticsData();
  }, []);
  return (
    <PageLayout>
      <Header leftComponent="Exif Data" />
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg font-mono">Total Files</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-lg font-mono">
            {(() => {
              const a = statistics.total;
              return a.toLocaleString();
            })()}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg font-mono">Images</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-lg font-mono">
            {(() => {
              const a = statistics.images;
              return a.toLocaleString();
            })()}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg font-mono">Videos</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-lg font-mono">
            {(() => {
              const a = statistics.videos;
              return a.toLocaleString();
            })()}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg font-mono">Live</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-lg font-mono">
            {(() => {
              const a = 50000;
              return a.toLocaleString();
            })()}
          </CardContent>
        </Card>
      </div>

      <ContributionGraph />
      <div className="grid grid-cols-3 gap-4">
        {exifCharts.map((chart) => (
          <EXIFDistribution
            key={chart.column}
            column={chart.column}
            title={chart.title}
            description={chart.description}
          />
        ))}

      </div>
    </PageLayout>
  );
}
