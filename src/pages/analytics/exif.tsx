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
import AssetHeatMap from "@/components/analytics/exif/AssetHeatMap";
import { useEffect, useState } from "react";
import { getAssetStatistics, getLivePhotoStatistics } from "@/handlers/api/analytics.handler";

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
  const [livePhotoStatistics, setLivePhotoStatistics] = useState({ total: 0 });

  const fetchLivePhotoStatistics = async () => {
    setLoading(true);
    try {
      const data = await getLivePhotoStatistics();
      const livePhotoData = Array.isArray(data) && data.length ? data[0].value : 0;
      setLivePhotoStatistics({ total: livePhotoData });
    } finally {
      setLoading(false);
    }
  };

  const fetchStatisticsData = async () => {
    setLoading(true);
    try {
      const data = await getAssetStatistics();
      setStatistics(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatisticsData();
    fetchLivePhotoStatistics();
  }, []);

  return (
    <PageLayout>
      <Header leftComponent="Exif Data" />
      <div className="grid grid-cols-4 gap-4">
        {["Total", "Images", "Videos"].map((type, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-center text-lg font-mono">{type}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-3xl font-mono">
              {loading ? "Loading..." : statistics[type.toLowerCase() as keyof typeof statistics].toLocaleString()}
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg font-mono">Live Photos</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-3xl font-mono">
            {loading ? "Loading..." : livePhotoStatistics.total.toLocaleString()}
          </CardContent>
        </Card>
      </div>
      <AssetHeatMap />
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
