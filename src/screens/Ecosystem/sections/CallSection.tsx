import React from "react";
import { Button } from "../../../components/ui/button";

export const CallSection = () => {
  const ctaData = {
    title: "Calling all third-party developers and platforms!",
    subtitle: "Join the ATM ecosystem community to expand your service reach.",
    description:
      "Utilise our ATM smart contract and Rank algorithm to attract more users and boost your project and Token.",
    buttonText: "Apply now",
  };
  return (
    <div className="w-full flex justify-center md:mt-10">
      <div className="relative w-full">
        <div className="absolute w-[333px] h-[333px] top-10 md:top-0 left-1/2 -translate-x-1/2 bg-[url(/atm-ecosystem.svg)] dark:bg-[url(/atm-ecosystem-dark.svg)] bg-cover bg-center" />
        <div className="flex flex-col items-center gap-[20px] py-[30px] md:py-[60px] relative z-10 text-center">
          <h3 className="font-titles-h5-large-text-400 text-foreground text-[20px] lg:text-[26px] tracking-[var(--titles-h5-large-text-400-letter-spacing)] leading-[27px] lg:leading-[34px] text-center">
            {ctaData.title}
          </h3>
          <div className="font-space-grotesk font-bold text-[26px] lg:text-[38px] text-center leading-[34px] lg:leading-[48px] bg-gradient-to-br from-[rgba(170,218,93,1)] to-[rgba(13,174,185,1)] bg-clip-text text-transparent">
            {ctaData.subtitle}
          </div>
          <p className="max-w-[817px] font-body-body1-300 text-foreground text-[18px] lg:text-[20px] tracking-[var(--body-body1-300-letter-spacing)] leading-[24px] lg:leading-[27px] text-center">
            {ctaData.description}
          </p>
          <Button className="bg-primary text-background dark:text-primary-foreground rounded-[30px] px-5 py-3 font-body-body3-400 text-[14px] lg:text-[16px] leading-[19px] lg:leading-[24px] hover:bg-primary/90">
            <a href="https://atm.network/v1/#/joinATM" target="_blank" >{ctaData.buttonText}
              </a>
          </Button>
        </div>
      </div>
    </div>
  );
};
