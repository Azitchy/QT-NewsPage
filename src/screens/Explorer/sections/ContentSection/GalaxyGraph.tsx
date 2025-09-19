import React, { useRef, useState } from "react";
import * as echarts from "echarts/core";
import { GraphChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { TitleComponent, TooltipComponent } from "echarts/components";
import "echarts-gl";
import ReactECharts from "echarts-for-react";
import { Input } from "../../../../components/ui/input";
import { Search, X } from "lucide-react";

echarts.use([GraphChart, CanvasRenderer, TitleComponent, TooltipComponent]);

type NodeType = {
  id: number;
  x: number;
  y: number;
  z: number;
  symbolSize: number;
  itemStyle: { color: string };
};

type LinkType = {
  source: number;
  target: number;
};

const GalaxyGraph: React.FC = () => {
  const chartRef = useRef<any>(null);
  const [is3D, setIs3D] = useState(true);
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  const nodes: NodeType[] = [...Array(200)].map((_, i) => ({
    id: i,
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    z: Math.random() * 100 - 50,
    symbolSize: Math.random() * 8 + 2,
    itemStyle: { color: `hsl(${Math.random() * 360}, 70%, 60%)` },
  }));

  const links: LinkType[] = [...Array(300)].map(() => ({
    source: Math.floor(Math.random() * nodes.length),
    target: Math.floor(Math.random() * nodes.length),
  }));

  const tooltipFormatter = (params: any) => {
    if (params.dataType === "node") {
      return `${params.data.id} | pr: ${params.data.pr}`;
    } else if (params.dataType === "edge") {
      return `Link: ${params.data.source} → ${params.data.target}`;
    }
    return "";
  };

  const option2D = {
    backgroundColor: "#000",
    tooltip: { formatter: tooltipFormatter },
    series: [
      {
        type: "graph",
        layout: "force",
        roam: true,
        force: { repulsion: 50, edgeLength: 100 },
        data: nodes.map((n) => ({ ...n, x: undefined, y: undefined })),
        links,
        lineStyle: { color: "rgba(255,255,255,0.2)", width: 1 },
        label: { show: false },
      },
    ],
  };

  const option3D = {
    backgroundColor: "#000",
    tooltip: { formatter: tooltipFormatter },
    series: [
      {
        type: "graphGL",
        layout: "forceAtlas2",
        forceAtlas2: { steps: 5 },
        data: nodes.map((n) => ({ ...n, value: [n.x, n.y, n.z] })),
        edges: links,
        lineStyle: { color: "rgba(255,255,255,0.2)", width: 1 },
      },
    ],
  };

  return (
    <div className="w-full h-screen bg-black text-white relative">
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-20 p-[10px] md:p-[20px] opacity-90 bg-gray-200 rounded-lg flex items-center justify-between md:w-[740px] lg:w-full lg:max-w-6xl md:mx-auto">
        <h1 className="hidden md:block text-[16px] font-bold text-gray-800">
          ATM Galaxy
        </h1>

        <div className="hidden md:flex gap-[10px] items-center">
          <div className="flex items-center flex-grow mx-4 lg:w-[400px]">
            <Input
              placeholder="Search for address"
              className="pl-4 pr-12 py-1 rounded-l-[4px] rounded-r-none border border-gray-400 bg-transparent text-sm text-[#858585] placeholder:text-[#858585] focus:ring-2 focus:ring-[#2ea8af] focus:border-transparent"
            />
            <div className="bg-primary-colour px-6 py-[10px] rounded-r-[4px] text-white cursor-pointer">
              <Search className="h-4 w-4" />
            </div>
          </div>
          <button className="bg-gray-300 text-black hover:bg-gray-400 text-[10px] px-3 py-[2px] rounded">
            Toggle <br /> Nodes
          </button>
          <select className="border text-black border-gray-300 rounded px-2 py-2 text-sm">
            <option>ALL</option>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
          <button
            onClick={() => setIs3D(true)}
            className={`px-3 py-1 rounded text-white ${
              is3D ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-300 text-black"
            }`}
          >
            3D
          </button>
          <button
            onClick={() => setIs3D(false)}
            className={`px-3 py-1 rounded ${
              !is3D
                ? "bg-teal-500 hover:bg-teal-600 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            2D
          </button>
        </div>

        <div className="flex md:hidden gap-[10px] items-center w-full justify-end">
          {showSearchMobile ? (
            <div className="flex items-center gap-0 w-[340px]">
              <Input
                placeholder="Search address"
                className="pl-2 pr-2 py-1 border border-gray-400 bg-transparent text-sm text-[#858585] placeholder:text-[#858585] focus:ring-2 focus:ring-[#2ea8af] focus:border-transparent flex-grow"
              />
              <button className="bg-primary-colour  px-3 py-[10px] mr-2  rounded-r-[4px] text-white">
                <Search className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowSearchMobile(false)}
                className="bg-red-500 px-3 py-1 rounded text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <button className="bg-gray-300 text-black hover:bg-gray-400 text-[8px] px-3 py-1 rounded">
                Toggle <br /> Nodes
              </button>
              <select className="border text-black border-gray-300 rounded px-2 py-1 text-sm">
                <option>ALL</option>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>

              <select
                value={is3D ? "3D" : "2D"}
                onChange={(e) => setIs3D(e.target.value === "3D")}
                className="border text-black border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option>3D</option>
                <option>2D</option>
              </select>
              <button
                onClick={() => setShowSearchMobile(true)}
                className="bg-primary-colour py-[5px] rounded text-white px-5"
              >
                <Search className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <ReactECharts
        ref={chartRef}
        option={is3D ? option3D : option2D}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
};

export default GalaxyGraph;
