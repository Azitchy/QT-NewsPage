import * as React from "react";
import { useTranslation } from "react-i18next";

export const AboutSection = () => {
  const { t } = useTranslation('games');

  return (
    <div className="mb-[100px] overflow-hidden ">
      <div className="flex flex-col md:flex-row items-center mx-auto large:max-w-[1800px]">
        <img
          src="/atmstars-left.svg"
          className="w-[175px] h-[130px] relative right-40 top-[20px] md:-top-4 md:bottom-10 md:right-[45px] lg:right-0"
        />
        <div className="text-[26px] leading-[34px] md:text-[17px] md:leading-[22px] lg:text-[34px] lg:leading-[45px] large:text-[38px] large:leading-[48px] font-space-grotesk font-light text-center max-w-[360px] md:max-w-full large:max-w-[1532px] ">
          {t('aboutSection.description')}{" "}
          <span className="bg-gradient-to-tr from-[#AADA5D] to-[#0DAEB9] bg-clip-text text-transparent font-bold">
            {t('aboutSection.highlight')}
          </span>
          {t('aboutSection.descriptionEnd')}
        </div>
        <img
          src="/atmstars-right.svg"
          className="w-[250px] h-[200px] relative left-36 bottom-[36px] md:bottom-4 md:left-[60px] lg:left-0"
        />
      </div>
      <div className="md:max-w-[500px] lg:max-w-[782px] text-[18px] leading-[24px] md:text-[15px] md:leading-[18px] lg:text-[20px] lg:leading-[27px] font-inter font-light text-foreground mx-4 md:mx-0 mt-[10px] lg:mt-[100px]  md:ml-[130px] large:ml-[450px]">
        {t('aboutSection.paragraph')}{" "}
        <span className="font-medium">
          {t('aboutSection.paragraphHighlight')}
        </span>{" "}
        {t('aboutSection.paragraphEnd')}
      </div>
    </div>
  );
};