import { Info } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";

type Stat = {
  value: string;
  label: string;
  hasInfo?: boolean;
  tooltip?: string;
  showLine?: boolean;
};
export const StasSection = (): JSX.Element => {
  const { t } = useTranslation("home");

  // Stats data
  const statsData: Stat[] = [
    {
      value: t("stasSection.stats.cc.value"),
      label: t("stasSection.stats.cc.label"),
      hasInfo: false,
      showLine: true,
    },
    {
      value: t("stasSection.stats.staked.value"),
      label: t("stasSection.stats.staked.label"),
      hasInfo: true,
      showLine: true,
      tooltip: t("stasSection.stats.staked.tooltip"),
    },
    {
      value: t("stasSection.stats.supply.value"),
      label: t("stasSection.stats.supply.label"),
      hasInfo: false,
      showLine: false,
    },
  ];
  return (
    <div className="relative w-full min-h-[220px] bg-card dark:bg-card py-8 lg:py-0">
      <div className="flex flex-col lg:flex-row w-full max-w-7xl h-auto lg:h-[119px] items-center justify-start mx-auto lg:mt-[51px] gap-1 lg:gap-20 px-4">
        {statsData.map((stat, index) => (
          <React.Fragment key={`stat-${index}`}>
            <div className="flex flex-col lg:flex-row  items-center gap-[5px] flex-1 w-full lg:w-auto">
              <div className="flex flex-col items-center justify-center gap-[5px] w-full">
                <div className="flex-1 self-stretch mt-[-1.00px] font-space-grotesk font-light text-foreground dark:text-foreground text-[38px] text-center leading-[48px] whitespace-nowrap">
                  {stat.value}
                </div>
                <div className="flex items-center justify-center gap-[3px] w-full relative">
                  <div className="text-card-foreground dark:text-card-foreground text-xl text-center tracking-[1px]">
                    {stat.label}
                  </div>

                  {stat.hasInfo && (
                    <div className="relative group">
                      <Info className="w-5 h-5 ml-4 text-primary cursor-pointer" />
                      <div className="absolute left-1/2 -m-10 -translate-x-1/2 mt-2 hidden group-hover:block w-64 p-3 rounded-xl shadow-lg bg-background dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 z-50">
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
                    className="h-24 bg-border opacity-5 dark:opacity-100 dark:bg-border rotate-90 lg:rotate-0"
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
