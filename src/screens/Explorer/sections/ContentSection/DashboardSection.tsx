import React, { useState, useEffect } from "react";
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
import { getOverviewData, OverviewData } from "../../../../lib/webApi";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export const DashboardSection = () => {
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getOverviewData();
        setOverviewData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching overview data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (str: number | string, holdPoint = false): string => {
    if (!str) return "";
    let suffix = "";
    if (holdPoint) {
      str = parseFloat(str.toString()).toFixed(6);
      const arr = String(str).split(".");
      str = arr[0];
      suffix = arr[1];
    }
    str = String(parseInt(str.toString())).replace(
      /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
      "$&,"
    );
    return suffix ? `${str}.${suffix}` : str;
  };

  const formatPrice = (value: number, n = 4): string => {
    if (value === undefined || value === null) return `0.${"0".repeat(n)}`;
    value = parseFloat(value.toString());
    let str = "";
    const index = String(value).indexOf(".");
    if (index > 0) {
      const arr = String(value).split(".");
      str = `${arr[0]}.${arr[1].slice(0, n)}`;
    } else {
      str = value.toFixed(n);
    }
    return str;
  };

  const getOverviewItems = () => {
    if (!overviewData) return [];

    const userMarketNum =
      overviewData.circulationTotal - overviewData.contractTotalAmount;

    return [
      {
        label: "Luca Price",
        value: formatPrice(overviewData.price),
        hasPercentage: true,
        percentage: overviewData.pre
          ? `${parseFloat(overviewData.pre) >= 0 ? "+" : ""}${
              overviewData.pre
            }%`
          : "+0.00%",
      },
      {
        label: "Total supply",
        value: formatNumber(overviewData.issuanceTotal),
      },
      { label: "User market circulation", value: formatNumber(userMarketNum) },
      {
        label: "Circulating supply",
        value: formatNumber(overviewData.circulationTotal),
      },
      {
        label: "Remaining liquidity rewards",
        value: formatNumber(overviewData.liquidityReward),
      },
      {
        label: "LUCA staked in Consensus Connections",
        value: formatNumber(overviewData.contractTotalAmount),
      },
      {
        label: "LUCA staked in PR servers",
        value: formatNumber(overviewData.treatyTotal),
      },
      {
        label: "Remaining Community Fund",
        value: formatNumber(overviewData.communityFundStock),
      },
      {
        label: "LUCA Consesus Connections",
        value: formatNumber(overviewData.contractCount),
      },
      {
        label: "PR Servers in Operation",
        value: formatNumber(overviewData.prCount),
      },
    ];
  };

  const getPieChartData = (): { outer: ChartData[]; inner: ChartData[] } => {
    if (!overviewData) {
      return { outer: [], inner: [] };
    }

    const userMarketNum =
      overviewData.circulationTotal - overviewData.contractTotalAmount;

    const outer: ChartData[] = [
      {
        name: "LUCA staked in Consensus Connections",
        value: overviewData.contractTotalAmount,
        color: "#3CC9C7",
      },
      {
        name: "Remaining Community Fund",
        value: overviewData.communityFundStock,
        color: "#FFC94D",
      },
      {
        name: "Remaining liquidity rewards",
        value: overviewData.liquidityReward,
        color: "#FF69B4",
      },
    ];

    const inner: ChartData[] = [
      {
        name: "Circulating supply",
        value: overviewData.circulationTotal,
        color: "#97D76D",
      },
      {
        name: "User market circulation",
        value: userMarketNum,
        color: "#5B6BF5",
      },
      {
        name: "LUCA staked in PR servers",
        value: overviewData.treatyTotal,
        color: "#1B5E20",
      },
    ];

    return { outer, inner };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied!");
    });
  };

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
            <span className="text-card-foreground font-normal text-[12px] leading-[17px]">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
        <div className="bg-card rounded-2xl border-[0px] shadow-none md:shadow-sm p-6 h-96 flex items-center justify-center">
          <div className="text-card-foreground">Loading overview data...</div>
        </div>
        <div className="bg-card rounded-2xl border-[0px] shadow-none md:shadow-sm p-6 h-96 flex items-center justify-center">
          <div className="text-card-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
        <div className="bg-card rounded-2xl border-[0px] shadow-none md:shadow-sm p-6 h-96 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  const overviewItems = getOverviewItems();
  const { outer: dataOuter, inner: dataInner } = getPieChartData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
      <Card className="bg-card rounded-2xl border-[0px] shadow-none md:shadow-sm">
        <CardHeader className="border-b border-border dark:border-primary-foreground px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/dots.png" alt="dots" className="w-[3px] h-[14px]" />
            <h3 className="text-[14px] max-w-[50px] md:max-w-full leading-[19px] font-normal text-[#999F9F]">
              LUCA Overview
            </h3>
          </div>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-[#E6E6E6]">
          {overviewItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center px-6 py-4 transition-colors"
            >
              <div className="text-[14px] leading-[19px] font-normal text-foreground">
                {item.label}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[16px] leading-[24px] font-medium text-foreground">
                  {item.value}
                </div>
                {item.hasPercentage && (
                  <Badge
                    className={`${
                      parseFloat(item.percentage || "0") >= 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    } rounded-full px-3 py-1 text-xs font-medium border-0 hover:bg-green-100`}
                  >
                    <img
                      className="mr-1"
                      alt="Image"
                      src={
                        parseFloat(item.percentage || "0") >= 0
                          ? "/green-up-arrow.svg"
                          : "/red-down-arrow.svg"
                      }
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
        <Card className="bg-card rounded-2xl border-[0px] shadow-none md:shadow-sm flex-1">
          <CardHeader className="border-b border-border dark:border-primary-foreground px-6 py-4">
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
                <div className="text-sm text-card-foreground text-[14px] leading-[19px]">
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
                <div className="text-[38px] leading-[48px] font-light font-space-grotesk text-foreground">
                  300k+
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-[12px] leading-[17px] text-[#4F5555] dark:text-card-foreground font-normal">
                    Wallet address
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[14px] leading-[19px] text-foreground font-normal">
                      0xb6c8...0031B9
                    </span>
                    <img
                      className="w-4 h-4 cursor-pointer"
                      alt="Copy icon"
                      src="/copy-icon.png"
                      onClick={() => copyToClipboard("0xb6c8...0031B9")}
                    />
                  </div>
                </div>

                <div className="w-px h-10 bg-gray-300" />
                <div className="flex flex-col items-center gap-2">
                  <div className="text-[12px] leading-[17px] text-[#4F5555] dark:text-card-foreground font-normal">
                    Smart contract
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[14px] leading-[19px] text-foreground font-normal">
                      0xa3c6...1431A7
                    </span>
                    <img
                      className="w-4 h-4 cursor-pointer"
                      alt="Copy icon"
                      src="/copy-icon.png"
                      onClick={() => copyToClipboard("0xa3c6...1431A7")}
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
