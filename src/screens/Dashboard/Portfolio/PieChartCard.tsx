import React from "react";
import { PieChart, Pie, Cell } from "recharts";

interface ChartData {
  name: string;
  value: number;
}

interface PieChartCardProps {
  title?: string;
  data: ChartData[];
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  width?: number;
  height?: number;
  showLegend?: boolean;
  className?: string;
}

export const PieChartCard: React.FC<PieChartCardProps> = ({
  title = "Chart Title",
  data,
  colors = ["#56B299", "#C3E58E"],
  innerRadius = 95,
  outerRadius = 110,
  width = 290,
  height = 260,
  showLegend = true,
  className = "",
}) => {
  return (
    <div className={`flex flex-1 md:w-[250px] ${className}`}>
      <div className="bg-background dark:bg-[#15152B] rounded-2xl p-5 w-full max-w-xl shadow relative">
        <h2 className="text-[20px] font-normal text-foreground mb-4">
          {title}
        </h2>

        <div className="flex items-center">
          <PieChart width={width} height={height}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={-180}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
          </PieChart>

          {showLegend && (
            <div className="ml-6 space-y-4">
              {data.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span
                    className="inline-block w-4 h-1.5 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></span>
                  <div className="flex flex-col">
                    <span className="text-[#878787] text-[12px]">
                      {entry.name}
                    </span>
                    <span className="text-foreground text-[14px] font-normal">
                      {entry.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
