import React, { useState, useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Brush,
} from "recharts";
import { Button } from "../../../../components/ui/button";

type TimeFrame = "day" | "week" | "month";

interface TimeFrameOption {
  label: string;
  value: TimeFrame;
}

interface CryptoChartProps {
  data: { date: string; price: number }[];
  name: string;
  height?: number;
  color?: string;
  timeFrame: TimeFrame;
  timeFrameOptions: TimeFrameOption[];
  onTimeFrameChange: (value: TimeFrame) => void;
}

const CryptoChart: React.FC<CryptoChartProps> = ({
  data,
  name,
  height = 300,
  color = "#2ea8af",
  timeFrame,
  timeFrameOptions,
  onTimeFrameChange,
}) => {
  const [startIndex, setStartIndex] = useState(Math.max(data.length - 30, 0));
  const [endIndex, setEndIndex] = useState(data.length - 1);
  const lastY = useRef<number | null>(null);

  const handleMouseMove = (e: any) => {
    if (e && e.chartY !== undefined) {
      if (lastY.current !== null) {
        if (e.chartY < lastY.current && endIndex - startIndex > 10) {
          setStartIndex(startIndex + 1);
          setEndIndex(endIndex - 1);
        }
        if (e.chartY > lastY.current && startIndex > 0) {
          setStartIndex(Math.max(startIndex - 1, 0));
          setEndIndex(Math.min(endIndex + 1, data.length - 1));
        }
      }
      lastY.current = e.chartY;
    }
  };

  return (
    <div className="w-full rounded-xl bg-card">
      <div className="flex mb-3">
        <div className="flex flex-col-reverse gap-4 md:gap-0 md:flex-row md:items-center justify-between w-full py-4">
          <div className="text-[14px] leading-[19px] max-w-[100px] md:max-w-full font-normal text-foreground">
            {name} price trend
          </div>
          <div className="flex rounded-[5px] border border-primary overflow-hidden">
            {timeFrameOptions.map((option, index) => (
              <Button
                key={option.value}
                variant="ghost"
                className={`h-8 px-8 md:px-4 rounded-none border-0 text-sm font-medium transition-colors ${
                  index > 0 ? "border-l border-primary" : ""
                } ${
                  timeFrame === option.value
                    ? "bg-primary text-card dark:text-primary-foreground hover:bg-primary hover:text-card"
                    : "bg-transparent text-primary hover:bg-[#2ea8af]/10"
                }`}
                onClick={() => onTimeFrameChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data.slice(startIndex, endIndex + 1)}
          onMouseMove={handleMouseMove}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          className="-left-8 md:left-0"
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            horizontal={true}
          />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} />
          <Tooltip
            formatter={(value: number) => value.toFixed(2)}
            labelStyle={{ fontSize: 12 }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            fill="url(#colorPrice)"
            strokeWidth={2}
          />
          <Brush dataKey="name" height={50} stroke="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CryptoChart;
