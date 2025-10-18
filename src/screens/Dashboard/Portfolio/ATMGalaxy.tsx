import ReactECharts from "echarts-for-react";
import * as echarts from "echarts/core";
import { GraphChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { TitleComponent, TooltipComponent } from "echarts/components";
import { useRef } from "react";

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

const ATMGalaxy = () => {
  const chartRef = useRef<any>(null);

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
    <div className="bg-background h-[500px] dark:bg-[#15152B] shadow rounded-[12px] p-5 transition-all duration-300">
      <div className="flex justify-between items-center mb-[10px]">
        <div className="flex items-center gap-10">
          <div className="text-[20px] font-normal text-foreground">
            ATM Galaxy
          </div>
          <div className="text-[18px] leading-[23px] text-foreground font-normal">
            Total connections: <span className="font-semibold">87</span>
          </div>
        </div>
        <img
          src="/filter-icon.png"
          alt="filter"
          className="h-6 w-6 cursor-pointer"
        />
      </div>

      {/* Galaxy */}
      <ReactECharts
        ref={chartRef}
        option={option3D}
        style={{ height: "90%", width: "100%" }}
      />
    </div>
  );
};

export default ATMGalaxy;
