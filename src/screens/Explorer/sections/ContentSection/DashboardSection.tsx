import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent, CardHeader } from "../../../../components/ui/card";

export const DashboardSection = (): JSX.Element => {
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

  const legendItems = [
    { color: "bg-[#91cc75]", label: "LUCA staked in Consensus Connections" },
    { color: "bg-[#5470c6]", label: "User market circulation" },
    { color: "bg-[#ffcc56]", label: "Remaining Community Fund" },
    { color: "bg-[#36c4cc]", label: "Circulating supply" },
    { color: "bg-[#0e8971]", label: "LUCA staked in PR servers" },
    { color: "bg-[#ff5673]", label: "Remaining liquidity rewards" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">
              LUCA Overview
            </h3>
          </div>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-gray-100">
          {overviewData.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="text-sm font-medium text-gray-700">
                {item.label}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-gray-900">
                  {item.value}
                </div>
                {item.hasPercentage && (
                  <Badge className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-medium border-0 hover:bg-green-100">
                    <img
                      className="w-1.5 h-[9px] mr-1"
                      alt="Image"
                      src="/image-17.svg"
                    />
                    <span>
                      {item.percentage}
                    </span>
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-5 w-full">
        <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1">
          <CardHeader className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-700">
                Proportion of Luca issuance in the entire network
            </h3>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative w-full h-80 mb-6">
              <div className="w-full h-full bg-[url(/image.png)] bg-cover bg-center rounded-lg" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {legendItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${item.color} rounded-sm`} />
                      <div className="text-xs text-gray-600">
                        {item.label}
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">
                  Amount of Travel LUCA burnt
                </div>
                <img
                  className="w-4 h-4"
                  alt="Info icon"
                  src="/info-icon.svg"
                />
              </div>

              <div className="flex items-center justify-center gap-2">
                <img className="w-10 h-10" alt="Luca" src="/luca-1.svg" />
                <div className="text-3xl font-light text-gray-900">
                  300k+
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-xs text-gray-500">
                    Wallet address
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-900 font-mono">
                      0xb6c8...0031B9
                    </span>
                    <img
                      className="w-4 h-4"
                      alt="Copy icon"
                      src="/copy-icon-5.svg"
                    />
                  </div>
                </div>

                <div className="w-px h-10 bg-gray-300" />

                <div className="flex flex-col items-center gap-2">
                  <div className="text-xs text-gray-500">
                    Smart contract
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-900 font-mono">
                      0xa3c6...1431A7
                    </span>
                    <img
                      className="w-4 h-4"
                      alt="Copy icon"
                      src="/copy-icon-5.svg"
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
