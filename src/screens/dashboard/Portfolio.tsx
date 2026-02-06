import { PieChartCard } from "./portfolio/PiechartCard";
import BalanceSection from "./portfolio/BalanceSection";
import AGTRecord from "./portfolio/AGTRecord";
import { useState } from "react";
import TokenBalance from "./portfolio/TokenBalance";

export default function Portfolio() {
  const lucaData = [
    { name: "Mine", value: 500 },
    { name: "Others", value: 1698 },
  ];

  const lucaColors = ["#56B299", "#C3E58E"];

  const connectionData = [
    { name: "Active", value: 6 },
    { name: "Pending", value: 22 },
    { name: "Inactive", value: 36 },
  ];

  const connectionColors = ["#81DED8", "#72AEF4", "#F8B38C"];

  const [showAGTHistory, setShowAGTHistory] = useState(false);
  return (
    <>
      {!showAGTHistory ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row gap-5">
            <BalanceSection onSeeHistory={() => setShowAGTHistory(true)} />
            <PieChartCard
              title="Locked amount of LUCA"
              data={lucaData}
              colors={lucaColors}
              innerRadius={95}
              outerRadius={110}
              width={290}
              height={260}
            />
            <PieChartCard
              title="Connections"
              data={connectionData}
              colors={connectionColors}
              innerRadius={95}
              outerRadius={110}
              width={290}
              height={260}
            />
          </div>
          <div className="flex flex-col gap-5">
            <TokenBalance />
          </div>
        </div>
      ) : (
        <AGTRecord onBack={() => setShowAGTHistory(false)} />
      )}
    </>
  );
}
