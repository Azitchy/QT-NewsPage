import { CopyIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

const cryptoData = [
  {
    name: "LUCA",
    icon: "/luca-svg.svg",
    price: "1.660100",
    change: "+ 5.32%",
    changeType: "positive",
    changeIcon: "/image-10.svg",
    staked: "34,825,285.000000",
    connections: "35,812",
    contractAddress: "0x51E6Ac1533032E72e92094867fD5921e3ea1bfa0",
    chartImage: "/image-2.png",
  },
  {
    name: "BTCB",
    icon: "/btcb-svg.svg",
    price: "46114.384060",
    change: "-1.25%",
    changeType: "negative",
    changeIcon: "/image-9.svg",
    staked: "4.880100",
    connections: "161",
    contractAddress: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
    chartImage: "/image-3.png",
  },
  {
    name: "LINK",
    icon: "/link-svg.svg",
    price: "14.960330",
    change: "-0.17%",
    changeType: "negative",
    changeIcon: "/image-9.svg",
    staked: "1,136.000000",
    connections: "169",
    contractAddress: "0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd",
    chartImage: "/image-4.png",
  },
  {
    name: "Cake",
    icon: "/cake-svg.svg",
    price: "3.068500",
    change: "+ 1.43%",
    changeType: "positive",
    changeIcon: "/image-10.svg",
    staked: "728.200000",
    connections: "892",
    contractAddress: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
    chartImage: "/image-5.png",
  },
  {
    name: "DOT",
    icon: "/dot-svg.svg",
    price: "8.099239",
    change: "-1.03%",
    changeType: "negative",
    changeIcon: "/image-9.svg",
    staked: "74.400000",
    connections: "15",
    contractAddress: "0x7083609fce4d1d8dc0c979aab8c869ea2c873402",
    chartImage: "/image-6.png",
  },
  {
    name: "DOGE",
    icon: "/cssgff3027c8d1864867e516916b6d454e0a-svg.svg",
    price: "0.084722",
    change: "-0.14%",
    changeType: "negative",
    changeIcon: "/image-9.svg",
    staked: "155,644.000000",
    connections: "836",
    contractAddress: "0xba2ae424d960c26247dd6c32edc70b295c744c43",
    chartImage: "/image-7.png",
  },
  {
    name: "SHIB",
    icon: "/cssge9f9d1f0a5987ba2038a4c1d1cfd3df5-svg.svg",
    price: "0.000010",
    change: "+ 0.39%",
    changeType: "positive",
    changeIcon: "/image-10.svg",
    staked: "123,690,405.000000",
    connections: "29",
    contractAddress: "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D",
    chartImage: "/image-8.png",
  },
];

const timeFrameOptions = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

export const ContentSection = (): JSX.Element => {
  const [selectedTimeFrames, setSelectedTimeFrames] = useState<
    Record<string, string>
  >(cryptoData.reduce((acc, crypto) => ({ ...acc, [crypto.name]: "day" }), {}));

  const handleTimeFrameChange = (cryptoName: string, timeFrame: string) => {
    setSelectedTimeFrames((prev) => ({ ...prev, [cryptoName]: timeFrame }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <section className="flex flex-col gap-6 w-full">
      <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Statistics
            </h2>
            <Button
              variant="ghost"
              className="h-auto p-2 text-sm text-[#2ea8af] hover:bg-[#2ea8af]/10 rounded-lg"
            >
              More &gt;
            </Button>
          </div>
          <div className="h-80 m-6 bg-[url(/image-1.png)] bg-cover bg-center rounded-xl" />
        </CardContent>
      </Card>

      {cryptoData.map((crypto) => (
        <Card
          key={crypto.name}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm"
        >
          <CardContent className="p-0">
            <div className="flex items-center gap-3 p-6 pb-4">
              <img
                className="w-6 h-6"
                alt={`${crypto.name} icon`}
                src={crypto.icon}
              />
              <span className="text-lg font-semibold text-gray-900">
                {crypto.name}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-6 pb-6 border-b border-gray-200">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500 font-medium">
                  {crypto.name} Price
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
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

              <div className="flex flex-col gap-2 lg:border-l lg:border-gray-200 lg:pl-6">
                <span className="text-xs text-gray-500 font-medium">
                  {crypto.name} staked in Consensus Connections
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {crypto.staked}
                </span>
              </div>

              <div className="flex flex-col gap-2 lg:border-l lg:border-gray-200 lg:pl-6">
                <span className="text-xs text-gray-500 font-medium">
                  Number of {crypto.name} Connections
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {crypto.connections}
                </span>
              </div>

              <div className="flex flex-col gap-2 lg:border-l lg:border-gray-200 lg:pl-6">
                <span className="text-xs text-gray-500 font-medium">
                  {crypto.name} contract address
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-mono truncate">
                    {crypto.contractAddress}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 w-6 h-6 hover:bg-gray-100 rounded"
                    onClick={() => copyToClipboard(crypto.contractAddress)}
                  >
                    <CopyIcon className="w-4 h-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mx-6 py-4">
              <span className="text-sm font-medium text-gray-900">
                {crypto.name} price trend
              </span>

              <div className="flex rounded-lg border border-[#2ea8af] overflow-hidden">
                {timeFrameOptions.map((option, index) => (
                  <Button
                    key={option.value}
                    variant="ghost"
                    className={`h-8 px-4 rounded-none border-0 text-sm font-medium transition-colors ${
                      index > 0 ? "border-l border-[#2ea8af]" : ""
                    } ${
                      selectedTimeFrames[crypto.name] === option.value
                        ? "bg-[#2ea8af] text-white hover:bg-[#2ea8af] hover:text-white"
                        : "bg-transparent text-[#2ea8af] hover:bg-[#2ea8af]/10"
                    }`}
                    onClick={() =>
                      handleTimeFrameChange(crypto.name, option.value)
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div
              className="h-80 mx-6 mb-6 bg-cover bg-center rounded-xl"
              style={{ backgroundImage: `url(${crypto.chartImage})` }}
            />
          </CardContent>
        </Card>
      ))}
    </section>
  );
};
