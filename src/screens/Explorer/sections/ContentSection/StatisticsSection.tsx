import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getUserLinkData, UserLinkData } from "../../../../lib/webApi";

export const StatisticsSection = () => {
  const [showMore, setShowMore] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const linkData: UserLinkData = await getUserLinkData();
        
        if (linkData?.data) {
          // Transform the data for the chart
          const chartData = [
            {
              name: "Total",
              User: linkData.data.userTotal || 0,
              Connections: linkData.data.linkTotal || 0,
            }
          ];

          // Add individual currency data
          if (linkData.data.linkList && Array.isArray(linkData.data.linkList)) {
            linkData.data.linkList.forEach((item) => {
              chartData.push({
                name: item.linkCurrency || "Unknown",
                User: item.userCount || 0,
                Connections: item.linkCount || 0,
              });
            });
          }

          setData(chartData);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching statistics data:", err);
        setError("Failed to load statistics data");
        // Fallback data in case of error
        setData([
          { name: "Total", User: 0, Connections: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayData = showMore ? data : data.slice(0, 5);

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

  if (loading) {
    return (
      <Card className="bg-card rounded-2xl border-[0px] shadow-none md:shadow-sm">
        <CardContent className="p-0">
          <div className="p-2 md:p-4">
            <div className="flex justify-between items-center mb-4 border-b border-border dark:border-primary-foreground pb-4">
              <h3 className="text-[16px] leading-[24px] font-normal text-foreground">
                Statistics
              </h3>
            </div>
            <div className="h-96 flex items-center justify-center">
              <div className="text-card-foreground">Loading statistics...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card rounded-2xl border-[0px] shadow-none md:shadow-sm">
        <CardContent className="p-0">
          <div className="p-2 md:p-4">
            <div className="flex justify-between items-center mb-4 border-b border-border dark:border-primary-foreground pb-4">
              <h3 className="text-[16px] leading-[24px] font-normal text-foreground">
                Statistics
              </h3>
            </div>
            <div className="h-96 flex items-center justify-center">
              <div className="text-red-500">{error}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card rounded-2xl border-[0px] shadow-none md:shadow-sm">
      <CardContent className="p-0">
        <div className="p-2 md:p-4">
          <div className="flex justify-between items-center mb-4 border-b border-border dark:border-primary-foreground pb-4">
            <h3 className="text-[16px] leading-[24px] font-normal text-foreground">
              Statistics
            </h3>
            {data.length > 5 && (
              <button
                className="text-primary font-normal text-[14px] leading-[19px] hover:underline"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "Less >" : "More >"}
              </button>
            )}
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
                data={displayData}
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