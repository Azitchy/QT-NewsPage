import React from "react";

export const HeroSection = () => {
  return (
    <div className="flex flex-col overflow-hidden">
      <div>
        <img
          src="/game-hero-image.png"
          className="md:hidden lg:block 2xl:hidden w-full h-[174px] md:h-full scale-110 md:scale-100 "
        />
        <img
          src="/game-hero-md.png"
          className="hidden md:block lg:hidden w-full "
        />
        <img src="/game-hero-large.png" className="hidden 2xl:block w-full " />
      </div>
      <div>
        <h1 className="max-w-[50px] md:max-w-full absolute top-[110px] left-5 md:top-[170px] md:left-[40px] lg:top-[210px] lg:left-14 2xl:top-[245px] 2xl:left-[315px] text-[50px] leading-[45px] md:text-[40px] lg:text-[120px] lg:leading-[140px] 2xl:text-[150px] 2xl:leading-[160px] [font-family:'Inter',Helvetica] text-[#02EEA8] font-bold uppercase">
          Game <span className="text-white">Fund</span>
        </h1>
      </div>
    </div>
  );
};
