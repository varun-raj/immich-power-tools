import { Inter } from "next/font/google";
import PageLayout from "@/components/layouts/PageLayout";
import Header from "@/components/shared/Header";
import EXIFDistribution, { IEXIFDistributionProps } from "@/components/analytics/exif/EXIFDistribution";

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
    column: 'exposureTime',
    title: 'Exposure Time',
    description: 'Distribution of exposure time'
  },
  {
    column: 'lensModel',
    title: 'Lens Model',
    description: 'Distribution of lens model'
  },
  {
    column: 'projectionType',
    title: 'Projection Type',
    description: 'Distribution of projection type'
  }
]
export default function ExifDataAnalytics() {
  return (
    <PageLayout>
      <Header 
        leftComponent="Exif Data" 
      />
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
