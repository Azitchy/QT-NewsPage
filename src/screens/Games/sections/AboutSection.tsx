import React from "react";

export const AboutSection = () => {
  return (
    <div className="mb-[100px] overflow-hidden ">
      <div className="flex flex-col md:flex-row items-center mx-auto 2xl:max-w-[1800px]">
        <img
          src="/atmstars-left.svg"
          className="w-[175px] h-[130px] relative right-40 top-[20px] md:-top-4 md:bottom-10 md:right-[45px] lg:right-0"
        />
        <div className="text-[26px] leading-[34px] md:text-[17px] md:leading-[22px] lg:text-[34px] lg:leading-[45px] 2xl:text-[38px] 2xl:leading-[48px] [font-family:'Space_Grotesk',Helvetica] font-light text-center max-w-[360px] md:max-w-full 2xl:max-w-[1532px] ">
          By playing games,{" "}
          <span className="bg-gradient-to-tr from-[#AADA5D] to-[#0DAEB9] bg-clip-text text-transparent font-bold">
            ATM users will earn ATM Stars and increase their game level
          </span>
          , which will help them earn more LUCA rewards. 
        </div>
        <img
          src="/atmstars-right.svg"
          className="w-[250px] h-[200px] relative left-36 bottom-[36px] md:bottom-4 md:left-[60px] lg:left-0"
        />
      </div>
      <div className="md:max-w-[500px] lg:max-w-[782px] text-[18px] leading-[24px] md:text-[15px] md:leading-[18px] lg:text-[20px] lg:leading-[27px] [font-family:'Inter',Helvetica] font-light text-[#1C1C1C] mx-4 md:mx-0 mt-[10px] lg:mt-[100px]  md:ml-[130px] 2xl:ml-[450px]">
        We have decided to start a game fund to{" "}
        <span className="font-medium">
          support game developers and to have our own ATM game. Every ATM user
          will be able to play, have fun and earn rewards. Game developers will
          need to set their funding goals and deadlines
        </span>{" "}
        (e.g., set a date for the game's release). If the ATM users like the
        game, they can pledge money to have the game created.
      </div>
    </div>
  );
};
