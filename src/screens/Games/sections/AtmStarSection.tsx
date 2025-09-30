import * as React from "react";

export const AtmStarSection = () => {
  return (
    <div
      className="w-full h-[550px] md:h-[450px] lg:h-[550px] bg-no-repeat bg-cover bg-center [font-family:'Inter',Helvetica] relative mb-[60px] lg:mb-[100px]"
      style={{ backgroundImage: "url('/atm-star-image.png')" }}
    >
      <div className="relative top-[10px] md:top-[30px] lg:ml-10 lg:top-[50px] p-6 lg:p-12 2xl:ml-56">
        <div className="flex flex-col gap-[20px] text-[#DCDCDC] md:max-w-[520px] lg:max-w-[649px]">
          <h1 className="text-[20px] leading-[27px] lg:text-[26px] lg:leading-[34px] font-normal">
            How to get ATM stars
          </h1>
          <div className="text-[16px] leading-[22px] lg:text-[18px] lg:leading-[24px]">
            The users will get ATM stars by creating a connection with the game
            100%
            <span className="bg-[linear-gradient(0deg,#FFBF19_5.65%,#FFDB7F_31.58%)] bg-clip-text text-transparent">
              {" "}
              (for example, 100LUCA for 90 days);
            </span>
          </div>
          <div className="text-[16px] leading-[22px] lg:text-[18px] lg:leading-[24px]">
            By winning the battle. If a player loses the battle, they lose the
            ATM stars{" "}
            <span className="bg-[linear-gradient(0deg,#FFBF19_5.65%,#FFDB7F_31.58%)] bg-clip-text text-transparent">
              {" "}
              (the amount which they put in a battle);
            </span>
          </div>
        </div>

        <div className="text-[#DCDCDC] text-[18px] leading-[24px] lg:text-[20px] lg:leading-[27px]  md:max-w-[500px] lg:max-w-[649px] mt-[40px] font-light">
          <span className="font-medium">
            Unlock exciting features with ATM stars! Purchase tickets for
            exclusive battles, NFT costumes, and items.
          </span>{" "}
          When disconnected from the game, the game wallet will automatically
          deduct stars from your account, ensuring fairness and balance. If your
          star balance is not sufficient, it will be reset to zero, giving
          everyone a fresh start.
        </div>
      </div>
    </div>
  );
};
