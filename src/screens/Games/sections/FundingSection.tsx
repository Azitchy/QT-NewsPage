import { HeadingWithDots } from "@/components/HeadingWithDots";
import * as React from "react";
import { useTranslation } from "react-i18next";

export const FundingSection = () => {
  const { t } = useTranslation("games");

  return (
    <div>
      <div className="flex items-start mb-[60px] md:mb-20">
        <div className="relative ml-4 lg:ml-[70px]">
          <HeadingWithDots text={t("fundingSection.title")} />
        </div>
      </div>
      <div className="w-full flex flex-col md:flex-row items-center justify-between lg:justify-center relative">
        <img
          src="/funding-left.svg"
          className="hidden lg:block relative lg:bottom-[145px] lg:w-auto"
          loading="lazy"
        />
        <div className="flex flex-col text-center w-full lg:w-auto">
          <span className="text-[12px] leading-[17px] text-[#4F5555] dark:text-card-foreground">
            {t("fundingSection.subtitle")}
          </span>
          <img
            src="/funding-image.png"
            className="mx-auto max-w-full"
            loading="lazy"
          />
        </div>
        <img
          src="/funding-right.svg"
          className="hidden lg:block relative lg:top-[30px] lg:w-auto"
          loading="lazy"
        />
      </div>
    </div>
  );
};
