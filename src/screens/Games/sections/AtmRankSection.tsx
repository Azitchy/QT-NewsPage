import { HeadingWithDots } from "@/components/HeadingWithDots";
import * as React from "react";
import { useTranslation } from "react-i18next";

export const AtmRankSection = () => {
  const { t } = useTranslation("games");

  return (
    <div className="my-[60px] lg:my-[100px] font-inter px-4 lg:px-0">
      <div className="relative h-[99px] ml-0 lg:ml-[71px]">
        <HeadingWithDots text={t("atmRankSection.title")} />
      </div>

      <div className="md:ml-[70px] lg:ml-[100px] 2xl:ml-[250px] my-[40px] max-w-[783px] text-[16px] leading-[22px] lg:text-[18px] lg:leading-[24px] font-normal text-foreground">
        {t("atmRankSection.description")}
      </div>

      <div className="flex flex-col md:flex-row md:ml-[70px] lg:ml-[100px] 2xl:ml-[250px] items-center gap-[50px] lg:gap-[127px]">
        <div className="flex flex-col gap-[40px]">
          <div className="flex flex-col gap-[10px]">
            <div className="text-[14px] leading-[19px] lg:text-[16px] lg:leading-[24px] text-[#4F5555] dark:text-card-foreground font-normal">
              {t("atmRankSection.formulas.pr")}
            </div>
            <img
              src="/atm-rank.png"
              className="h-[115] w-[325px]"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <div className="text-[14px] leading-[19px] lg:text-[16px] lg:leading-[24px] text-[#4F5555] dark:text-card-foreground font-normal">
              {t("atmRankSection.formulas.xp")}
            </div>
            <img
              src="/atm-star.png"
              className="h-[115] w-[325px]"
              loading="lazy"
            />
          </div>
        </div>

        <div className="flex items-center gap-[30px] bg-[#F0FCF7] dark:bg-[#10262C] rounded-[10px] px-[20px] lg:px-[40px] py-[15px]">
          <div className="flex flex-col gap-[20px]">
            <div className="flex items-center gap-[10px]">
              <img
                src="/level-up.png"
                className="h-[52px] w-[50px] lg:h-[85px] lg:w-[80px]"
                loading="lazy"
              />
              <div className="text-[16px] leading-[22px] lg:text-[18px] lg:leading-[24px] text-foreground font-normal max-w-[361px]">
                {t("atmRankSection.definitions.gameLevel")}
              </div>
            </div>
            <div className="flex items-center gap-[10px]">
              <img
                src="/star.svg"
                className="h-[52px] w-[50px] lg:h-[85px] lg:w-[80px]"
                loading="lazy"
              />
              <div className="text-[16px] leading-[22px] lg:text-[18px] lg:leading-[24px] text-foreground font-normal max-w-[361px]">
                {t("atmRankSection.definitions.stars")}
              </div>
            </div>
          </div>
          <div>
            <img
              src="/xp-icon.png"
              className="lg:h-[204] lg:w-[139px]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
