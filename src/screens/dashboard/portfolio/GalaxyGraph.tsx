import React from "react";
import FilterIcon from "@/assets/icons/filter-icon.svg";

const GalaxyGraph: React.FC = () => {
  return (
    <div className="w-full  bg-card shadow rounded-[12px] p-5">
      <div className="flex mb-2.5 justify-between">
        <div className="flex items-center gap-10">
          <div className="font-h4-400">ATM Galaxy</div>
          <div className="body-text-400">
            Total Connections: <span className="body-text-600">87</span>
          </div>
        </div>
        <div className="cursor-pointer">
          <img src={FilterIcon} />
        </div>
      </div>
      <div className="w-full h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] lg:h-105">
        {/* Embedded Galaxy Visualization */}
        <iframe
          src="https://visual.atm.network/vis3d/false/ALL/conNodes"
          title="ATM Network Galaxy Visualization"
          className="w-full h-full border-0 rounded-lg"
          style={{ background: "#000" }}
          allow="fullscreen"
        />
      </div>
    </div>
  );
};

export default GalaxyGraph;
