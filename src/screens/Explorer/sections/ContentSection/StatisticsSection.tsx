import React, { useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const fullData = [
  { name: "Total", User: 22000, Connections: 42000 },
  { name: "LUCA", User: 15000, Connections: 35000 },
  { name: "BTCB", User: 500, Connections: 700 },
  { name: "ETH", User: 1200, Connections: 1500 },
  { name: "BNB", User: 3000, Connections: 2500 },
  { name: "LINK", User: 400, Connections: 600 },
  { name: "FIL", User: 300, Connections: 450 },
  { name: "Cake", User: 1600, Connections: 1300 },
  { name: "ADA", User: 200, Connections: 300 },
  { name: "XRP", User: 600, Connections: 500 },
  { name: "DOT", User: 100, Connections: 200 },
];

export const StatisticsSection = () => {
  const [showMore, setShowMore] = useState(false);
  const data = showMore ? fullData : fullData.slice(0, 5);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow text-xs">
          <p className="text-gray-700">{payload[0].payload.name}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-gray-600">
              {item.dataKey}: {item.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  return (
    <Card className="bg-card rounded-2xl  border-[0px] shadow-none md:shadow-sm">
      <CardContent className="p-0">
        <div className="p-2 md:p-4">
          <div className="flex justify-between items-center mb-4 border-b border-border dark:border-primary-foreground pb-4">
            <h3 className="text-[16px] leading-[24px] font-normal text-foreground">
              Statistics
            </h3>
            <button
              className="text-primary font-normal text-[14px] leading-[19px] hover:underline"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Less >" : "More >"}
            </button>
          </div>

          <div className="hidden md:flex flex-col items-end">
            <div className="flex flex-col mb-2 text-sm font-medium text-card-foreground px-2">
              <div className="flex items-center gap-1">
                <span className="w-[20px] h-3 bg-[#FBC02D] rounded-sm inline-block"></span>
                User
              </div>
              <div className="flex items-center gap-1">
                <span className="w-[20px] h-3 bg-[#26C6DA] rounded-sm inline-block"></span>
                Connections
              </div>
            </div>
          </div>
          <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
              <BarChart
                data={data}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  axisLine={true}
                  tickLine={true}
                />

                <YAxis
                  tickFormatter={(value) => `${value / 1000}K`}
                  tick={{ fontSize: 12 }}
                  axisLine={true}
                  tickLine={true}
                />

                {/* Custom Tooltip */}
                <Tooltip content={<CustomTooltip />} />
                {/* Bars */}
                <Bar
                  dataKey="User"
                  fill="#FBC02D"
                  barSize={20}
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="Connections"
                  fill="#26C6DA"
                  barSize={20}
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
