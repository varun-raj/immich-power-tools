import React, { useEffect, useState } from "react";
import { getHeatMapData } from "@/handlers/api/analytics.handler";
import { useConfig } from "@/contexts/ConfigContext";
import { Tooltip } from "@/components/ui/tooltip";

type HeatMapEntry = {
  date: string;
  count: number;
};

export default function AssetHeatMap() {
  const { exImmichUrl } = useConfig();

  const [heatMapData, setHeatMapData] = useState<HeatMapEntry[][]>([]);
  const [loading, setLoading] = useState(false);
  const [weeksPerMonth, setWeeksPerMonth] = useState<number[]>([]); // Store weeks per month

  const fetchHeatMapData = async () => {
    setLoading(true);
    try {
      const data = await getHeatMapData();
      setHeatMapData(formatHeatMapData(data));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatMapData();
  }, []);

  const currentDate = new Date();
  const months: string[] = [];

  // Build an array of the last 12 months
  for (let i = 0; i < 12; i++) {
    months.push(currentDate.toLocaleString("default", { month: "short" }));
    currentDate.setMonth(currentDate.getMonth() - 1);
  }
  months.reverse();

  // Flatten heatMapData to calculate min and max counts
  const flattenedData = heatMapData.flat();
  const minCount = Math.min(...flattenedData.map((entry) => entry.count));
  const maxCount = Math.max(...flattenedData.map((entry) => entry.count));

  // Check if a week contains a date with the first day of the month
  const hasFirstDayOfMonth = (arr: HeatMapEntry[]) => {
    return arr.some((entry) => new Date(entry.date).getDate() === 1);
  };

  const getColor = (count: number) => {
    if (count === -1) return "";

    // Calculate thresholds based on the data range
    const range = maxCount - minCount;
    const threshold1 = minCount + range * 0.2;
    const threshold2 = minCount + range * 0.4;
    const threshold3 = minCount + range * 0.6;
    const threshold4 = minCount + range * 0.8;
    if (count === 0) return "bg-zinc-800";
    if (count <= threshold1) return "bg-green-200";
    if (count <= threshold2) return "bg-green-400";
    if (count <= threshold3) return "bg-green-500";
    if (count <= threshold4) return "bg-green-600";
    return "bg-green-800";
  };

  const formatHeatMapData = (data: HeatMapEntry[]) => {
    const chunks = [];
    const weeksPerMonthTemp: number[] = [];
    let previousMonthIndex = 0;

    for (let i = 0; i < data.length; i += 7) {
      const thisWeek = data.slice(i, i + 7);
      chunks.push(thisWeek);

      if (hasFirstDayOfMonth(thisWeek)) {
        const changeWeek = (i - previousMonthIndex) / 7;
        previousMonthIndex = i;
        weeksPerMonthTemp.push(changeWeek);
      }
    }
    weeksPerMonthTemp.reverse();
    setWeeksPerMonth(weeksPerMonthTemp);
    return chunks;
  };

  return (
    <div className="py-4 w-full">
      <h2 className="text-xl font-bold mb-4">Past Year</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto border-separate border-spacing-1 w-full">
            <thead>
              <tr>
                {weeksPerMonth.map((weeks, index) => (
                  <th
                    key={index}
                    className="text-center"
                    colSpan={weeks || 4}
                  >
                    {months[index]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatMapData[0]?.map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {heatMapData.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`h-[20px] w-[20px] ${getColor(column[rowIndex]?.count ?? -1)} rounded`}
                      // style={{ width: `calc(${100 / 60}%)` }}
                    >
                      {
                        column[rowIndex]?.date ? (
                          <Tooltip delayDuration={0} content={`Date: ${column[rowIndex]?.date ?? "N/A"} - Count: ${column[rowIndex]?.count ?? 0}`}>
                            <a
                              href={`${exImmichUrl}/search?query=%7B%22takenAfter%22%3A%22${column[rowIndex]?.date ?? "N/A"}T00%3A00%3A00.000Z%22%2C%22takenBefore%22%3A%22${column[rowIndex]?.date ?? "N/A"}T23%3A59%3A59.999Z%22%7D`}
                              className="block h-[20px] max-w-[20px]"
                              target="_blank"
                            >
                              <div
                                className="h-[20px] max-w-[20px]"
                              />
                            </a></Tooltip>) : <div
                          className="h-[20px] max-w-[20px]"
                        />

                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
