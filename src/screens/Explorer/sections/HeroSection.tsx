import * as React from "react";
import { useTranslation } from "react-i18next";

export const HeroSection = () => {
  const { t } = useTranslation("explorer");
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center overflow-hidden px-4 lg:flex-row large:items-center large:justify-center large:gap-10">
      {/* Image Section */}
      <div className="relative items-center justify-center md:mt-20 lg:mt-0 -mb-20 md:mb-8 lg:mb-0">
        <img
          className="hidden md:block w-full h-full object-contain md:scale-125 lg:scale-100 large:scale-125 transition-transform duration-500"
          alt="Hero illustration"
          src="/explorer-hero-img.png"
          loading="lazy"
        />
        <img
          className="md:hidden w-full h-full"
          alt="Hero illustration"
          src="/explorer-hero-small.png"
          loading="lazy"
        />
      </div>

      {/* Text Section */}
      <div className="md:max-w-[370px] lg:max-w-[512px] large:w-[1400px] md:absolute md:top-52 md:right-[10px] lg:right-[100px] large:static large:text-left">
        <h1 className="text-[26px] md:text-[24px] lg:text-[32px] leading-[32px] lg:leading-10 font-light text-start lg:text-left text-foreground mb-2 font-space-grotesk">
          {t("heroSection.title")} <br /> {t("heroSection.subtitle")}{" "}
          <span className="bg-green-gradient bg-clip-text text-transparent font-bold">
            {t("heroSection.highlightedText")}
          </span>
        </h1>
      </div>
    </div>
  );
};
