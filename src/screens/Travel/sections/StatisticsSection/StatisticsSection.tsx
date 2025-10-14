import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const StatisticsSection = (): JSX.Element => {
  const { t } = useTranslation("travel");

  const [openTooltip1, setOpenTooltip1] = useState(false);
  const [openTooltip2, setOpenTooltip2] = useState(false);

  const handleTooltipClick = (
    tooltipNumber: number,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (tooltipNumber === 1) {
      setOpenTooltip1(!openTooltip1);
      setOpenTooltip2(false); // Close other tooltip
    } else {
      setOpenTooltip2(!openTooltip2);
      setOpenTooltip1(false); // Close other tooltip
    }
  };

  // Close tooltips when clicking outside
  const handleClickOutside = () => {
    setOpenTooltip1(false);
    setOpenTooltip2(false);
  };

  return (
    <div onClick={handleClickOutside}>
      <section className="bg-card py-[25px] xl:py-[34px] flex flex-col items-center xl:flex-row xl:justify-center xl:items-stretch">
        {/* Stat 1 */}
        <div className="flex flex-col text-card-foreground text-center font-inter font-medium text-[20px] leading-[27px]">
          {t("statisticsSection.stat1.upTo")}
          <span className="text-foreground text-center font-['Space_Grotesk'] font-light text-[38px] leading-[48px]">
            96
          </span>
          {t("statisticsSection.stat1.bookingsMade")}
        </div>

        <div className="bg-border h-[1px] w-[320px] my-[10px] block xl:hidden" />
        <div className="bg-border w-[1px] self-stretch mx-[106px] hidden xl:block" />

        {/* Stat 2 */}
        <div className="flex flex-col text-card-foreground text-center font-inter font-medium text-[20px] leading-[27px] gap-[5px]">
          {t("statisticsSection.stat2.upTo")}

          <div className="flex items-center justify-center gap-[8px]">
            <span className="text-foreground text-center font-['Space_Grotesk'] font-light text-[38px] leading-[48px]">
              1177.24
            </span>
            <img
              src="/luca-1.svg"
              alt="luca icon"
              className=""
              loading="lazy"
            />
          </div>

          <div className="flex items-center justify-center gap-[6px]">
            {t("statisticsSection.stat2.lucaConsumed")}
            <Tooltip open={openTooltip1}>
              <TooltipTrigger
                onClick={(e) => handleTooltipClick(1, e)}
                onMouseEnter={() =>
                  !("ontouchstart" in window) && setOpenTooltip1(true)
                }
                onMouseLeave={() =>
                  !("ontouchstart" in window) && setOpenTooltip1(false)
                }
                className="touch-manipulation"
              >
                <Info className="text-primary w-[18px] h-[18px] cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent
                className="shadow-sm rounded-[8px]"
                side="bottom"
                align="end"
              >
                <p className="text-[#1C1C1C] text-[12px] font-normal leading-[17px] max-w-[260px]">
                  {t("statisticsSection.stat2.tooltip")}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-[#999F9F] font-normal text-[12px] leading-[17px]">
              Wallet Address
              <div className="flex items-center gap-[3px]">
                <span className="text-foreground font-inter font-normal text-[14px] leading-[19px]">
                  0xb6c8...0031B9
                </span>
                <img
                  src="/copy-icon.svg"
                  alt="copy icon"
                  className=""
                  loading="lazy"
                />
              </div>
            </div>

            <div className="bg-border w-[1px] self-stretch mx-[30px]" />

            <div className="text-[#999F9F] font-normal text-[12px] leading-[17px]">
              Smart Contract
              <div className="flex items-center gap-[3px]">
                <span className="text-foreground font-inter font-normal text-[14px] leading-[19px]">
                  0xa3c6...1431A7
                </span>
                <img
                  src="/copy-icon.svg"
                  alt="copy icon"
                  className=""
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-border h-[1px] w-[320px] my-[10px] block xl:hidden" />
        <div className="bg-border w-[1px] self-stretch mx-[106px] hidden xl:block" />

        {/* Stat 3 */}
        <div className="flex flex-col text-card-foreground text-center font-inter font-medium text-[20px] leading-[27px]">
          {t("statisticsSection.stat3.upTo")}
          <span className="text-foreground text-center font-['Space_Grotesk'] font-light text-[38px] leading-[48px]">
            $7440.71
          </span>
          <div className="flex items-center gap-[6px]">
            {t("statisticsSection.stat3.totalSaved")}
            <Tooltip open={openTooltip2}>
              <TooltipTrigger
                onClick={(e) => handleTooltipClick(2, e)}
                onMouseEnter={() =>
                  !("ontouchstart" in window) && setOpenTooltip2(true)
                }
                onMouseLeave={() =>
                  !("ontouchstart" in window) && setOpenTooltip2(false)
                }
                className="touch-manipulation"
              >
                <Info className="text-primary w-[18px] h-[18px] cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent
                className="shadow-sm rounded-[8px]"
                side="bottom"
                align="end"
              >
                <p className="text-[#1C1C1C] text-[12px] font-normal leading-[17px] max-w-[260px]">
                  {t("statisticsSection.stat3.tooltip")}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </section>
    </div>
  );
};
