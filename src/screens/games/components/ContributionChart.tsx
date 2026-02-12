import { PieChart, Pie, Cell } from "recharts";

interface ContributionChartProps {
  totalContributed: number;
  goalAmount: number;
  size?: number;
  className?: string;
}

export default function ContributionChart({
  totalContributed,
  goalAmount,
  size = 180,
  className = "",
}: ContributionChartProps) {
  const percentage = goalAmount > 0
    ? Math.min(Math.round((totalContributed / goalAmount) * 100), 100)
    : 0;

  const data = [
    { value: percentage, color: "#0DAEB9" },
    { value: 100 - percentage, color: "#F0F0F0" },
  ];

  const innerRadius = size * 0.38;
  const outerRadius = size * 0.48;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <PieChart width={size} height={size}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          startAngle={90}
          endAngle={-270}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          dataKey="value"
          cornerRadius={8}
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[14px] text-[#959595]">{percentage}% of the</span>
        <span className="text-[14px] text-[#959595]">funds</span>
      </div>
    </div>
  );
}
