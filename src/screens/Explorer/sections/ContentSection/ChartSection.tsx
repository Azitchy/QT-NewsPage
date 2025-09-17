import React, { useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { CopyIcon } from "lucide-react";
import CryptoChart from "./CryptoChart";

type TimeFrame = "day" | "week" | "month";

interface TimeFrameOption {
  label: string;
  value: TimeFrame;
}

const cryptoData = [
  {
    name: "LUCA",
    icon: "/luca-icon.svg",
    price: "1.660100",
    change: "+ 5.32%",
    changeType: "positive",
    changeIcon: "/arrow-up.svg",
    staked: "34,825,285.000000",
    connections: "35,812",
    contractAddress: "0x51E6Ac1533032E72e92094867fD5921e3ea1bfa0",
    chartData: {
      day: [
        { date: "09-01", price: 0.42 },
        { date: "09-02", price: 0.44 },
        { date: "09-03", price: 0.41 },
        { date: "09-04", price: 0.45 },
        { date: "09-05", price: 0.43 },
        { date: "09-06", price: 0.46 },
      ],
      week: [
        { date: "Week1", price: 0.5 },
        { date: "Week2", price: 0.52 },
        { date: "Week3", price: 0.48 },
        { date: "Week4", price: 0.46 },
      ],
      month: [
        { date: "Jun", price: 0.65 },
        { date: "Jul", price: 0.6 },
        { date: "Aug", price: 0.55 },
        { date: "Sep", price: 0.42 },
      ],
    },
  },
  {
    name: "BTCB",
    icon: "/btcb-icon.svg",
    price: "46114.384060",
    change: "-1.25%",
    changeType: "negative",
    changeIcon: "/arrow-down.svg",
    staked: "4.880100",
    connections: "161",
    contractAddress: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
    chartData: {
      day: [
        { date: "09-01", price: 0.42 },
        { date: "09-02", price: 0.44 },
        { date: "09-03", price: 0.41 },
        { date: "09-04", price: 0.45 },
        { date: "09-05", price: 0.43 },
        { date: "09-06", price: 0.46 },
      ],
      week: [
        { date: "Week1", price: 0.5 },
        { date: "Week2", price: 0.52 },
        { date: "Week3", price: 0.48 },
        { date: "Week4", price: 0.46 },
      ],
      month: [
        { date: "Jun", price: 0.65 },
        { date: "Jul", price: 0.6 },
        { date: "Aug", price: 0.55 },
        { date: "Sep", price: 0.42 },
      ],
    },
  },
  {
    name: "LINK",
    icon: "/link-icon.svg",
    price: "14.960330",
    change: "-0.17%",
    changeType: "negative",
    changeIcon: "/arrow-down.svg",
    staked: "1,136.000000",
    connections: "169",
    contractAddress: "0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd",
    chartData: {
      day: [
        { date: "09-01", price: 0.42 },
        { date: "09-02", price: 0.44 },
        { date: "09-03", price: 0.41 },
        { date: "09-04", price: 0.45 },
        { date: "09-05", price: 0.43 },
        { date: "09-06", price: 0.46 },
      ],
      week: [
        { date: "Week1", price: 0.5 },
        { date: "Week2", price: 0.52 },
        { date: "Week3", price: 0.48 },
        { date: "Week4", price: 0.46 },
      ],
      month: [
        { date: "Jun", price: 0.65 },
        { date: "Jul", price: 0.6 },
        { date: "Aug", price: 0.55 },
        { date: "Sep", price: 0.42 },
      ],
    },
  },
  {
    name: "Cake",
    icon: "/cake-icon.svg",
    price: "3.068500",
    change: "+ 1.43%",
    changeType: "positive",
    changeIcon: "/arrow-up.svg",
    staked: "728.200000",
    connections: "892",
    contractAddress: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
    chartData: {
      day: [
        { date: "09-01", price: 0.42 },
        { date: "09-02", price: 0.44 },
        { date: "09-03", price: 0.41 },
        { date: "09-04", price: 0.45 },
        { date: "09-05", price: 0.43 },
        { date: "09-06", price: 0.46 },
      ],
      week: [
        { date: "Week1", price: 0.5 },
        { date: "Week2", price: 0.52 },
        { date: "Week3", price: 0.48 },
        { date: "Week4", price: 0.46 },
      ],
      month: [
        { date: "Jun", price: 0.65 },
        { date: "Jul", price: 0.6 },
        { date: "Aug", price: 0.55 },
        { date: "Sep", price: 0.42 },
      ],
    },
  },
  {
    name: "DOT",
    icon: "/dot-icon.svg",
    price: "8.099239",
    change: "-1.03%",
    changeType: "negative",
    changeIcon: "/arrow-down.svg",
    staked: "74.400000",
    connections: "15",
    contractAddress: "0x7083609fce4d1d8dc0c979aab8c869ea2c873402",
    chartData: {
      day: [
        { date: "09-01", price: 0.42 },
        { date: "09-02", price: 0.44 },
        { date: "09-03", price: 0.41 },
        { date: "09-04", price: 0.45 },
        { date: "09-05", price: 0.43 },
        { date: "09-06", price: 0.46 },
        { date: "09-07", price: 0.47 },
        { date: "09-08", price: 0.48 },
        { date: "09-09", price: 0.49 },
      ],
      week: [
        { date: "Week1", price: 0.5 },
        { date: "Week2", price: 0.52 },
        { date: "Week3", price: 0.48 },
        { date: "Week4", price: 0.46 },
      ],
      month: [
        { date: "Jun", price: 0.65 },
        { date: "Jul", price: 0.6 },
        { date: "Aug", price: 0.55 },
        { date: "Sep", price: 0.42 },
      ],
    },
  },
  {
    name: "DOGE",
    icon: "/doge-icon.svg",
    price: "0.084722",
    change: "-0.14%",
    changeType: "negative",
    changeIcon: "/arrow-down.svg",
    staked: "155,644.000000",
    connections: "836",
    contractAddress: "0xba2ae424d960c26247dd6c32edc70b295c744c43",
    chartData: {
      day: [
        { date: "09-01", price: 0.42 },
        { date: "09-02", price: 0.44 },
        { date: "09-03", price: 0.41 },
        { date: "09-04", price: 0.45 },
        { date: "09-05", price: 0.43 },
        { date: "09-06", price: 0.46 },
      ],
      week: [
        { date: "Week1", price: 0.5 },
        { date: "Week2", price: 0.52 },
        { date: "Week3", price: 0.48 },
        { date: "Week4", price: 0.46 },
      ],
      month: [
        { date: "Jun", price: 0.65 },
        { date: "Jul", price: 0.6 },
        { date: "Aug", price: 0.55 },
        { date: "Sep", price: 0.42 },
      ],
    },
  },
  {
    name: "SHIB",
    icon: "/shib-icon.svg",
    price: "0.000010",
    change: "+ 0.39%",
    changeType: "positive",
    changeIcon: "/arrow-up.svg",
    staked: "123,690,405.000000",
    connections: "29",
    contractAddress: "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D",
    chartData: {
      day: [
        { date: "09-01", price: 0.42 },
        { date: "09-02", price: 0.44 },
        { date: "09-03", price: 0.41 },
        { date: "09-04", price: 0.45 },
        { date: "09-05", price: 0.43 },
        { date: "09-06", price: 0.46 },
      ],
      week: [
        { date: "Week1", price: 0.5 },
        { date: "Week2", price: 0.52 },
        { date: "Week3", price: 0.48 },
        { date: "Week4", price: 0.46 },
      ],
      month: [
        { date: "Jun", price: 0.65 },
        { date: "Jul", price: 0.6 },
        { date: "Aug", price: 0.55 },
        { date: "Sep", price: 0.42 },
      ],
    },
  },
];

const timeFrameOptions: TimeFrameOption[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

export const ChartSection = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("day");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      {cryptoData.map((crypto) => (
        <Card
          key={crypto.name}
          className="bg-white rounded-2xl border-[0px]  md:border border-gray-200 mb-4 shadow-none md:shadow-sm h-[800px] md:h-[650px] lg:h-[570px]"
        >
          <CardContent className="p-0 ">
            <div className="flex items-center gap-1 p-6 pb-4">
              <img
                className="w-[18px] h-[18px]"
                alt={`${crypto.name} icon`}
                src={crypto.icon}
              />
              <span className="text-[14px] leading-[19px] font-normal text-[#1C1C1C]">
                {crypto.name}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 mx-6 pb-6 md:border-b border-gray-200">
              <div className="flex flex-col gap-2">
                <span className="hidden md:block text-[12px] leading-[17px] text-[#858585] font-normal">
                  {crypto.name} Price
                </span>
                <div className="relative -top-9 md:-top-0 flex justify-end md:justify-start md:items-center gap-2">
                  <span className="text-sm font-normal text-gray-900">
                    {crypto.price}
                  </span>
                  <img
                    className="w-4 h-4"
                    alt="Change indicator"
                    src={crypto.changeIcon}
                  />
                  <span
                    className={`text-sm font-medium ${
                      crypto.changeType === "positive"
                        ? "text-[#2ea8af]"
                        : "text-[#f14349]"
                    }`}
                  >
                    {crypto.change}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 border-b pb-[15px] md:border-b-0 lg:border-l lg:border-gray-200 lg:pl-6">
                <span className="text-[12px] leading-[17px] text-[#858585] font-normal">
                  {crypto.name} staked in Consensus Connections
                </span>
                <span className="text-sm font-normal text-gray-900">
                  {crypto.staked}
                </span>
              </div>

              <div className="flex md:flex-col justify-between gap-2 border-b pb-[15px] md:border-b-0 lg:border-l lg:border-gray-200 lg:pl-6">
                <span className="text-[12px] leading-[17px] text-[#858585] font-normal">
                  Number of {crypto.name} Connections
                </span>
                <span className="text-sm font-normal text-gray-900">
                  {crypto.connections}
                </span>
              </div>

              <div className="flex flex-col gap-2 lg:border-l lg:border-gray-200 lg:pl-6">
                <span className="text-[12px] leading-[17px] text-[#858585] font-normal">
                  {crypto.name} contract address
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#858585] font-mono truncate">
                    {crypto.contractAddress}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 w-6 h-6 hover:bg-gray-100 rounded"
                    onClick={() => copyToClipboard(crypto.contractAddress)}
                  >
                    <CopyIcon className="w-4 h-4 text-[#2EA8AF]" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="h-80 mx-6 mb-6 rounded-xl">
              <CryptoChart
                data={crypto.chartData[timeFrame]}
                name={crypto.name}
                height={320}
                color="#2ea8af"
                timeFrame={timeFrame}
                timeFrameOptions={timeFrameOptions}
                onTimeFrameChange={(val) => setTimeFrame(val)}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
