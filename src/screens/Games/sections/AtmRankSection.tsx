import React from "react";

export const AtmRankSection = () => {
  return (
    <div className="my-[60px] lg:my-[100px] [font-family:'Inter',Helvetica] px-4 lg:px-0">
      <div className="relative h-[99px] ml-0 lg:ml-[71px]">
        <div className="left-10 absolute w-auto lg:w-[155px] h-11 top-[27px] lg:left-[51px] font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] [font-style:var(--titles-h2-sectionheading-400-font-style)]">
          atm pr rank
        </div>
        <img
          className="w-[102px] h-[99px] absolute top-0 left-0"
          alt="Dots"
          src="/dots-3.svg"
        />
      </div>

      <div className="md:ml-[70px] lg:ml-[100px] 2xl:ml-[250px] my-[40px] max-w-[783px] text-[16px] leading-[22px] lg:text-[18px] lg:leading-[24px] font-normal text-[#1C1C1C] ">
        The PR value will depend on the player's ATM game level and ATM stars.
        There will be the normalised ATM XP, that will be used in ATMRank.
      </div>

      <div className="flex flex-col md:flex-row md:ml-[70px] lg:ml-[100px] 2xl:ml-[250px] items-center gap-[50px] lg:gap-[127px]">
        <div className="flex flex-col gap-[40px]">
          <div className="flex flex-col gap-[10px]">
            <div className="text-[14px] leading-[19px] lg:text-[16px] lg:leading-[24px] text-[#4F5555] font-normal">
              PR = PR × normalised [ATM XP]
            </div>
            <img src="/atm-rank.png" className="h-[115] w-[325px]" />
          </div>
          <div className="flex flex-col gap-[10px]">
            <div className="text-[14px] leading-[19px] lg:text-[16px] lg:leading-[24px] text-[#4F5555] font-normal">
              ATM XP = ATM stars + normalised [ATM game level]
            </div>
            <img src="/atm-star.png" className="h-[115] w-[325px]" />
          </div>
        </div>

        <div className="flex items-center gap-[30px] bg-[#F0FCF7] rounded-lg px-[20px] lg:px-[40px] py-[15px]">
          <div className="flex flex-col gap-[20px]">
            <div className="flex items-center gap-[10px]">
              <img
                src="/level-up.png"
                className="h-[52px] w-[50px] lg:h-[85px] lg:w-[80px]"
              />
              <div className="text-[16px] leading-[22px] lg:text-[18px] lg:leading-[24px] text-[#1C1C1C] font-normal max-w-[361px]">
                ATM game level: Represents the player's ATM game level
                experience.
              </div>
            </div>
            <div className="flex items-center gap-[10px]">
              <img
                src="/star.svg"
                className="h-[52px] w-[50px] lg:h-[85px] lg:w-[80px]"
              />
              <div className="text-[16px] leading-[22px] lg:text-[18px] lg:leading-[24px] text-[#1C1C1C] font-normal max-w-[361px]">
                ATM stars: Represents an amount of ATM stars player has.
              </div>
            </div>
          </div>
          <div>
            <img src="/xp-icon.png" className="lg:h-[204] lg:w-[139px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
