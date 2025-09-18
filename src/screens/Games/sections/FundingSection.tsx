import React from "react";

export const FundingSection = () => {
  return (
    <div>
      <div className="flex items-start mb-[60px] md:mb-20">
        <div className="relative ml-4 lg:ml-[70px]">
          <div className="font-titles-h2-sectionheading-400 text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] ml-12 mt-7 uppercase">
            funding & game dev
          </div>
          <img
            className="absolute w-[99px] h-[99px] top-0 left-0"
            alt="Dots"
            src="/dots.svg"
          />
        </div>
      </div>
      <div className="w-full flex flex-col md:flex-row items-center justify-between lg:justify-center relative">
        <img
          src="/funding-left.svg"
          className="hidden lg:block relative lg:bottom-[145px] lg:w-auto"
        />
        <div className="flex flex-col text-center w-full lg:w-auto">
          <span className="text-[12px] leading-[17px] text-[#4F5555] dark:text-card-foreground">
            Watch our explainer video by clicking the button below
          </span>
          <img src="/funding-image.png" className="mx-auto max-w-full" />
        </div>
        <img
          src="/funding-right.svg"
          className="hidden lg:block relative lg:top-[30px] lg:w-auto"
        />
      </div>
    </div>
  );
};
