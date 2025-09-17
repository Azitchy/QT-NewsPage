import { Info } from "lucide-react";
import React from "react";

type Stat = {
  value: string;
  label: string;
  hasInfo?: boolean;
  tooltip?: string;
  showLine?: boolean;
};
export const StasSection = (): JSX.Element => {
  // Stats data
  const statsData: Stat[] = [
    {
      value: "42.1k",
      label: "Number of CC",
      hasInfo: false,
      showLine: true,
    },
    {
      value: "53.8M",
      label: "Amount staked in CC",
      hasInfo: true,
      showLine: true,
      tooltip:
        "Consensus Connections (CC) are secure financial agreements where you lock funds with others to earn rewards.",
    },
    {
      value: "65.5M",
      label: "Total supply",
      hasInfo: false,
      showLine: false,
    },
  ];
  return (
    <div className="relative w-full min-h-[220px] bg-[#fbfbfb] dark:bg-[#2B2F3E] py-8 lg:py-0">
      <div className="flex flex-col lg:flex-row w-full max-w-7xl h-auto lg:h-[119px] items-center justify-start mx-auto lg:mt-[51px] gap-1 lg:gap-20 px-4">
        {statsData.map((stat, index) => (
          <React.Fragment key={`stat-${index}`}>
            <div className="flex flex-col lg:flex-row  items-center gap-[5px] flex-1 w-full lg:w-auto">
              <div className="flex flex-col items-center justify-center gap-[5px] w-full">
                <div className="flex-1 self-stretch mt-[-1.00px] font-titles-h3-caption-400 font-[number:var(--titles-h3-caption-400-font-weight)] text-[#1c1c1c] dark:text-[#DCDCDC] text-[length:var(--titles-h3-caption-400-font-size)] text-center tracking-[var(--titles-h3-caption-400-letter-spacing)] leading-[var(--titles-h3-caption-400-line-height)] whitespace-nowrap [font-style:var(--titles-h3-caption-400-font-style)]">
                  {stat.value}
                </div>
                <div className="flex items-center justify-center gap-[3px] w-full relative">
                  <div className="text-[#858585] dark:text-[#B4B4B4] text-xl text-center tracking-[1px]">
                    {stat.label}
                  </div>

                  {stat.hasInfo && (
                    <div className="relative group">
                      <Info className="w-5 h-5 ml-4 text-[#2EABAF] cursor-pointer" />
                      <div className="absolute left-1/2 -m-10 -translate-x-1/2 mt-2 hidden group-hover:block w-64 p-3 rounded-xl shadow-lg bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 z-50">
                        {stat.tooltip}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                {stat.showLine && (
                  <img
                    src="/line.svg"
                    alt="line"
                    className="h-24 bg-[#EEEEEE] opacity-5 dark:opacity-100 dark:bg-[#454545] rotate-90 lg:rotate-0"
                  />
                )}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
