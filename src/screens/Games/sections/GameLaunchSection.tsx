import { HeadingWithDots } from "@/components/HeadingWithDots";
import * as React from "react";
import { useTranslation } from "react-i18next";

export const GameLaunchSection = () => {
  const { t } = useTranslation("games");

  return (
    <div className="w-full mt-[60px] md:mt-0 ">
      <div className="flex flex-col items-center md:flex-row gap-[20px] lg:gap-[10px] 2xl:gap-[130px] md:mt-[60px] md:mr-[20px] lg:mr-0 mb-12">
        <div className="flex flex-col">
          <div className="relative ml-4 lg:ml-[70px]">
            <HeadingWithDots text={t("gameLaunchSection.title")} />
          </div>
          <div className="flex flex-col mx-4 md:max-w-[519px] lg:max-w-[784px] large:max-w-[947px] font-inter text-foreground text-[16px] lg:text-[18px] leading-[22px] lg:leading-[27px] mt-14 lg:ml-20 large:ml-[300px] text-left">
            <span className="font-normal">
              {t("gameLaunchSection.paragraph1")}
            </span>
            <br />
            <span className="font-normal">
              {t("gameLaunchSection.paragraph2")}
            </span>
          </div>
        </div>
        <div className="relative md:top-12 w-[260px] h-[280px] lg:w-[322px] lg:h-[338px] bg-[url(/game-launch.svg)] bg-cover bg-center rounded-lg"></div>
      </div>
      <div className="text-[26px] leading-[34px] lg:text-[38px] lg:leading-[48px] mx-auto px-[10px] md:px-[0px] max-w-[1316px] large:max-w-[1532px] text-center my-[70px] md:my-[140px] font-space-grotesk font-light">
        {t("gameLaunchSection.quote")}
        <span className="bg-green-gradient bg-clip-text text-transparent font-bold">
          {t("gameLaunchSection.quoteHighlight")}
        </span>{" "}
        {t("gameLaunchSection.quoteEnd")}
      </div>
    </div>
  );
};
