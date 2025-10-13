import * as React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";

export const CallSection = () => {
  const { t } = useTranslation("ecosystem");

  return (
    <div className="w-full flex justify-center md:mt-10">
      <div className="relative w-full">
        <div className="absolute w-[333px] h-[333px] top-10 md:top-0 left-1/2 -translate-x-1/2 bg-[url(/atm-ecosystem.svg)] dark:bg-[url(/atm-ecosystem-dark.svg)] bg-cover bg-center" />
        <div className="flex flex-col items-center gap-[20px] py-[30px] md:py-[60px] relative z-10 text-center">
          <h3 className="font-inter text-foreground text-[20px] lg:text-[26px] tracking-[0px] leading-[27px] lg:leading-[34px] text-center">
            {t("callSection.title")}
          </h3>
          <div className="font-space-grotesk font-bold text-[26px] lg:text-[38px] text-center leading-[34px] lg:leading-[48px] bg-green-gradient bg-clip-text text-transparent">
            {t("callSection.subtitle")}
          </div>
          <p className="max-w-[817px] font-inter text-foreground text-[18px] lg:text-[20px] tracking-[0px] leading-[24px] lg:leading-[27px] text-center">
            {t("callSection.description")}
          </p>
          <Button className="bg-primary text-background dark:text-primary-foreground rounded-[30px] px-5 py-3 font-inter text-[14px] lg:text-[16px] leading-[19px] lg:leading-[24px] hover:bg-primary/90">
            <a href="/joinATM">{t("callSection.button")}</a>
          </Button>
        </div>
      </div>
    </div>
  );
};
