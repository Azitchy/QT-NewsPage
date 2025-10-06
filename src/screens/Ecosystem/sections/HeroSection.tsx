import * as React from "react";
import { useTranslation } from "react-i18next";

export const HeroSection = () => {
  const { t } = useTranslation('ecosystem');

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden">
      <div className="relative items-center justify-center md:mt-20 lg:mt-0 mb-8">
        <img
          className="hidden md:block w-full h-full object-contain scale-125 md:scale-150 lg:scale-100 transition-transform duration-500"
          alt="Hero illustration"
          src="/ecosystem-hero-img.png"
        />
        <img
          className="md:hidden w-full h-full"
          alt="Hero illustration"
          src="/ecosystem-hero-small.png"
        />
      </div>
      <div className="md:max-w-[370px] lg:max-w-[512px] large:max-w-[745px] md:absolute md:top-52 lg:top-56 md:right-[10px] lg:-right-[46px] xl:right-32 large:right-64 ">
        <h1 className="text-[26px] md:text-[24px] lg:text-[32px] leading-[32px] lg:leading-10 font-light text-start text-foreground dark:text-foreground mb-2 font-space-grotesk">
          {t('heroSection.title')}{" "}
          <span className="bg-[linear-gradient(136deg,#AADA5D_0%,#0DAEB9_98.28%)] bg-clip-text text-transparent font-bold">
            {t('heroSection.highlight')}
          </span>
        </h1>
      </div>
    </div>
  );
};