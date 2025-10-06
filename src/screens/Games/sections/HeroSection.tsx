import * as React from "react";
import { useTranslation } from "react-i18next";

export const HeroSection = () => {
  const { t } = useTranslation('games');

  return (
    <div className="relative w-full lg:mb-20 large:mb-44">
      {/* Background Image */}
      <img
        src="/game-hero-bg.png"
        alt="Background"
        className="hidden md:block large:hidden w-full h-full object-cover"
      />
      <img
        src="/game-bg-large.png"
        alt="Background"
        className="hidden large:block w-full h-full large:h-[500px] object-cover"
      />
      <img
        src="/game-bg-sm.png"
        alt="Background"
        className="md:hidden w-full h-auto object-contain"
      />

      {/* Text */}
      <div className="absolute top-[25%] left-4  max-w-[50px] md:max-w-full md:top-[15%] md:left-10 xl:top-[20%] xl:left-28 large:top-[25%] large:left-[20%]">
        <h1 className="text-[40px] md:text-[80px] xl:text-[120px] large:text-[150px] leading-tight font-bold uppercase font-inter text-[#02EEA8]">
          {t('heroSection.title')} <span className="text-white">{t('heroSection.titleHighlight')}</span>
        </h1>
      </div>

      {/* Character Image */}
      <div className="absolute top-0 right-0 md:right-10 lg:right-20 xl:right-32 large:right-[20%] w-[68%] md:w-[40%] lg:w-[40%] xl:w-[40%] 2xl:w-[40%] large:w-[40%]">
        <img
          src="/game-hero-character.svg"
          alt="Hero Character"
          className="w-full h-full large:h-[680px] object-contain"
        />
      </div>
    </div>
  );
};