import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent, CardHeader } from "../../../../components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export const DashboardSection = () => {
  const overviewData = [
    {
      label: "Luca Price",
      value: "1.6601",
      hasPercentage: true,
      percentage: "+5.32%",
    },
    { label: "Total supply", value: "51,349,472" },
    { label: "User market circulation", value: "11,308,088" },
    { label: "Circulating supply", value: "46,133,373" },
    { label: "Remaining liquidity rewards", value: "965,000" },
    { label: "LUCA staked in Consensus Connections", value: "34,825,285" },
    { label: "LUCA staked in PR servers", value: "101,099" },
    { label: "Remaining Community Fund", value: "4,150,000" },
    { label: "LUCA Consesus Connections", value: "35,812" },
    { label: "PR Servers in Operation", value: "22" },
  ];

  const dataOuter: ChartData[] = [
    {
      name: "LUCA staked in Consensus Connections",
      value: 70,
      color: "#3CC9C7",
    },
    { name: "Remaining Community Fund", value: 5, color: "#FFC94D" },
    { name: "Remaining liquidity rewards", value: 0, color: "#FF69B4" },
  ];

  const dataInner: ChartData[] = [
    {
      name: "Circulating supply",
      value: 60,
      color: "#97D76D",
    },
    { name: "User market circulation", value: 20, color: "#5B6BF5" },
    { name: "LUCA staked in PR servers", value: 0, color: "#1B5E20" },
  ];

  const CustomLegend = ({ dataOuter, dataInner }: any) => {
    const combinedData = [...dataOuter, ...dataInner];
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-1 gap-y-[10px] md:pl-10 md:gap-y-[6px] mx-auto max-w-[250px] md:max-w-full">
        {combinedData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="text-[#858585] font-normal text-[12px] leading-[17px]">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
      <Card className="bg-white rounded-2xl border-[0px]  md:border border-gray-200 shadow-none md:shadow-sm">
        <CardHeader className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/dots.png" alt="dots" className="w-[3px] h-[14px]" />
            <h3 className="text-[14px] max-w-[50px] md:max-w-full leading-[19px] font-normal text-[#999F9F]">
              LUCA Overview
            </h3>
          </div>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-[#E6E6E6]">
          {overviewData.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="text-[14px] leading-[19px] font-normal text-[#1C1C1C]">
                {item.label}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[16px] leading-[24px] font-medium text-[#1C1C1C]">
                  {item.value}
                </div>
                {item.hasPercentage && (
                  <Badge className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-medium border-0 hover:bg-green-100">
                    <img
                      className="mr-1"
                      alt="Image"
                      src="/green-up-arrow.svg"
                    />
                    <span>{item.percentage}</span>
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-5 w-full">
        <Card className="bg-white rounded-2xl border-[0px]   md:border border-gray-200 shadow-none md:shadow-sm flex-1">
          <CardHeader className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <img src="/dots.png" alt="dots" className="w-[3px] h-[14px]" />
              <h3 className="text-[14px] leading-[19px] font-normal text-[#999F9F]">
                Proportion of Luca issuance in the entire network
              </h3>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="w-full h-[400px] md:h-[410px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataOuter}
                    dataKey="value"
                    nameKey="name"
                    outerRadius="60%"
                    innerRadius="45%"
                    paddingAngle={1}
                  >
                    {dataOuter.map((entry, index) => (
                      <Cell key={`outer-${index}`} fill={entry.color} />
                    ))}
                  </Pie>

                  <Pie
                    data={dataInner}
                    dataKey="value"
                    nameKey="name"
                    outerRadius="35%"
                    paddingAngle={1}
                  >
                    {dataInner.map((entry, index) => (
                      <Cell key={`inner-${index}`} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend
                    content={
                      <CustomLegend
                        dataOuter={dataOuter}
                        dataInner={dataInner}
                      />
                    }
                    verticalAlign="bottom"
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col items-center justify-center gap-[5px] mt-6">
              <div className="flex items-center gap-2">
                <div className="text-sm text-[#858585] text-[14px] leading-[19px]">
                  Amount of Travel LUCA burnt
                </div>
                <img
                  className="w-[24px] h-[24px]"
                  alt="Info icon"
                  src="/info-icon.svg"
                />
              </div>

              <div className="flex items-center justify-center gap-2">
                <img className="w-10 h-10" alt="Luca" src="/luca-burnt.png" />
                <div className="text-[38px] leading-[48px] font-light [font-family:'Space_Grotesk',Helvetica] text-[#1C1C1C]">
                  300k+
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-[12px] leading-[17px] text-[#4F5555] font-normal">
                    Wallet address
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[14px] leading-[19px] text-[#1C1C1C] font-normal">
                      0xb6c8...0031B9
                    </span>
                    <img
                      className="w-4 h-4"
                      alt="Copy icon"
                      src="/copy-icon.png"
                    />
                  </div>
                </div>

                <div className="w-px h-10 bg-gray-300" />
                <div className="flex flex-col items-center gap-2">
                  <div className="text-[12px] leading-[17px] text-[#4F5555] font-normal">
                    Smart contract
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[14px] leading-[19px] text-[#1C1C1C] font-normal">
                      0xa3c6...1431A7
                    </span>
                    <img
                      className="w-4 h-4"
                      alt="Copy icon"
                      src="/copy-icon.png"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
