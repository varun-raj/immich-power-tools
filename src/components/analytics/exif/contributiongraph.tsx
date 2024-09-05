import React from 'react';

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
  if (count === 0) return '';
  if (count === 1) return 'bg-green-200';
  if (count === 2) return 'bg-green-400';
  if (count === 3) return 'bg-green-500';
  if (count === 4) return 'bg-green-600';
  return 'bg-green-800';
};

const ContributionGraph: React.FC = () => {
  const contributions = generateContributions();

  return (
    <div className="p-4 w-full">
      <h2 className="text-xl font-bold mb-4">GitHub Contribution Graph - Past Year</h2>
      <div className="overflow-x-auto">
        <table className="table-auto border-separate border-spacing-1 w-full">
          <tbody>
            {contributions.map((dayContributions, dayIndex) => (
              <tr key={dayIndex}>
                {dayContributions.map((count, weekIndex) => (
                  <td
                    key={weekIndex}
                    className={`h-6 ${getColor(count)} rounded-lg`}
                    style={{ width: `calc(${100 / 52}%)` }}
                    title={`${count} contributions`}
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
