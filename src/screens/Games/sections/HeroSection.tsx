import React from "react";

export const HeroSection = () => {
  return (
    <div className="relative w-full lg:mb-20">
      {/* Background as actual image */}
      <img
        src="/game-hero-bg.png"
        alt="Background"
        className="hidden md:block w-full h-[200px] tablet:h-[300px] desktop:h-[450px] large:h-[600px] bg-cover bg-no-repeat"
      />
      <img
        src="/game-bg-sm.png"
        alt="Background"
        className="md:hidden w-full h-[171px] bg-contain bg-no-repeat"
      />

      {/* Text */}
      <div className="absolute top-[45px] left-2 md:top-[80px] md:left-[40px] xl:top-[100px] xl:left-14 large:top-[245px] large:left-[315px]">
        <h1 className="text-[50px] leading-[45px] max-w-[50px] md:max-w-full xl:text-[120px] xl:leading-[140px] large:text-[150px] large:leading-[160px] font-bold uppercase font-inter text-[#02EEA8]">
          Game <span className="text-white">Fund</span>
        </h1>
      </div>

      {/* Character Image */}
      <div className="absolute top-0 right-[0px] md:right-[150px] lg:right-[120px]  desktop:right-[200px]  large:right-[700px] w-[265px] md:w-[400px] lg:w-[668px] large:w-[900px] z-20">
        <img
          src="/game-hero-character.svg"
          alt="Hero Character"
          className="w-full h-[233px] md:h-[270px] lg:h-[400px] large:h-[800px] object-contain"
        />
      </div>
    </div>
  );
};
