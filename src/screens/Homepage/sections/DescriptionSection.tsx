import * as React from "react";
import { useTranslation } from "react-i18next";

export const DescriptionSection = (): JSX.Element => {
  const { t } = useTranslation('home');

  return (
    <div className="flex items-center overflow-hidden justify-center w-full min-h-[299px] px-4 lg:px-0">
      <img
        src="/nodesimg 1.svg"
        alt="nodesImg"
        className="hidden xl:block mr-[85px]"
      />
      <div className="max-w-[790px] 2xl:max-w-[948px] mx-auto leading-6 sm:leading-7 lg:text-left">
        <div className="w-full xl:w-[784px] 2xl:w-[948px] text-foreground dark:text-foreground font-inter text-[18px] md:text-[20px] font-light">
          {t('descriptionSection.text')}{" "}
          <span className="font-[500] text-[18px] md:text-[20px] ">
            {t('descriptionSection.highlight')}
          </span>
        </div>
      </div>
      <img
        src="/nodesimg 2.svg"
        alt="nodesImg"
        className="hidden xl:block ml-[20px]"
      />
    </div>
  );
};