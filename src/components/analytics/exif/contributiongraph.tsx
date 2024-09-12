import React, { useEffect, useState } from "react";
import { getAssetStatistics } from "@/handlers/api/analytics.handler";

// List of month labels
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weeksPerMonth = [4, 4, 4, 4, 5, 4, 4, 4, 5, 4, 4, 5]; 
// Function to map weeks to months
const getMonthLabels = () => {
// Approximate number of weeks per month
  const monthLabels = [];
  let cumulativeWeeks = 0;

  for (let i = 0; i < months.length; i++) {
    monthLabels.push({
      month: months[i],
      startWeek: cumulativeWeeks,
      span: weeksPerMonth[i],
    });
    cumulativeWeeks += weeksPerMonth[i];
  }

  return monthLabels;
};

// Function to generate the last 365 days of contribution data
const generateContributions = () => {
  const contributions: number[][] = Array.from({ length: 7 }, () => Array(52).fill(0));
  for (let week = 0; week < 52; week++) {
    for (let day = 0; day < 7; day++) {
      // Generate a random number of contributions for each day (0 to 5 for example)
      contributions[day][week] = Math.floor(Math.random() * 6);
    }
  }
  return contributions;
};

// Function to determine the background color based on the contribution count
const getColor = (count: number) => {
  if (count === 0) return 'bg-zinc-900';
  if (count === 1) return 'bg-green-200';
  if (count === 2) return 'bg-green-400';
  if (count === 3) return 'bg-green-500';
  if (count === 4) return 'bg-green-600';
  return 'bg-green-800';
};

const ContributionGraph: React.FC = () => {
  const contributions = generateContributions();
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true); // Set loading to true when starting to fetch data
    return getAssetStatistics()
      .then((data) => {
        setStatistics(data); // Update statistics with the returned data
      })
      .finally(() => setLoading(false)); // Stop loading after data is fetched
  };

  const monthLabels = getMonthLabels();

  return (
    <div className="p-4 w-full">
      <h2 className="text-xl font-bold mb-4">Past Year</h2>
      <div className="overflow-x-auto">
        {/* Month labels */}
        {/* <div className="flex mb-1">
          {monthLabels.map(({ month, startWeek, span }) => (
            <div
              key={month}
              style={{ width: `calc(${span / 52 * 100}%)`, marginLeft: `calc(${startWeek / 52 * 100}%)` }}
              className="text-center font-bold text-sm"
            >
              {month}
            </div>
          ))}
        </div> */}

        <table className="table-auto border-separate border-spacing-1 w-full">
          <thead>
            <tr>
              {months.map((month, index) => (
                <th key={index} colSpan={weeksPerMonth[index]}>{month}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {contributions.map((dayContributions, dayIndex) => (
              <tr key={dayIndex}>
                {dayContributions.map((count, weekIndex) => (
                  <td
                    key={weekIndex}
                    className={`h-6 ${getColor(count)} rounded-lg`}
                    style={{ width: `calc(${100 / 52}%)` }}
                    title={`${count} Images`}
                  ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContributionGraph;
