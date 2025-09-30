import { useTranslation } from "react-i18next";
import { FlightsSection } from "../Hotels&FlightsSection/FlightsSection";
import { HotelsSection } from "../Hotels&FlightsSection/HotelsSection";
import { LargeQuoteSection } from "../LargeQuoteSection";
import { StatisticsSection } from "../StatisticsSection/StatisticsSection";

export const ContentSection = (): JSX.Element => {
  const { t } = useTranslation("travel"); 
  return (
    <div className="py-[60px]">
      <StatisticsSection />
      <div className="px-[16px] md:px-[70px] large:px-[120px]">

        {/* Quote 1 */}
        <div className="pt-[60px] xl:pt-[100px] flex justify-center text-center">
          <h1 className="font-space-grotesk text-[26px] font-light leading-[34px] xl:text-[38px] xl:leading-[48px]">
            <span className="bg-gradient-to-tr from-[#AADA5D] to-[#0DAEB9] bg-clip-text text-transparent font-bold">
              {t("quote1.highlight")}{" "}
            </span>
            {t("quote1.normal")}
          </h1>
        </div>

        <HotelsSection />

        {/* Quote 2 */}
        <div className="pt-[60px] xl:pt-[100px] flex justify-center text-center">
          <h1 className="font-space-grotesk text-[26px] font-light leading-[34px] xl:text-[38px] xl:leading-[48px]">
            {t("quote2.normal")}{" "}
            <span className="bg-gradient-to-tr from-[#AADA5D] to-[#0DAEB9] bg-clip-text text-transparent font-bold">
              {t("quote2.highlight")}
            </span>
          </h1>
        </div>

        <FlightsSection />

        <LargeQuoteSection />

      </div>
    </div>
  );
};
