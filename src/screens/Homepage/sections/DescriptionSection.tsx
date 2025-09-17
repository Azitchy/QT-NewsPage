import React from "react";

export const DescriptionSection = (): JSX.Element => {
  return (
    <div className="flex items-center overflow-hidden justify-center w-full min-h-[299px] px-4 lg:px-0">
      <img
        src="/nodesimg 1.svg"
        alt="nodesImg"
        className="hidden xl:block mr-[85px]"
      />
      <div className="max-w-[790px] 2xl:max-w-[948px] mx-auto leading-6 sm:leading-7  lg:text-left">
        <div className="w-full xl:w-[784px] 2xl:w-[948px] text-[#1c1c1c] dark:text-[#DCDCDC] [font-family:'Inter',Helvetica] text-[18px] md:text-[20px] font-light">
          Autonomous Trust Momentum (ATM) lets you earn rewards by securely
          locking funds in financial agreements called Consensus Connections.
          Using the advanced ATM-Rank (PR) algorithm, your contributions are
          evaluated to calculate fair rewards in LUCA, ATM's native token.{" "}
          <span className="font-[500] text-[18px] md:text-[20px] ">
            The more connections you create, the greater your earning potential,
            unlocking higher rewards and opportunities. These tools aim to build
            a healthier, more stable, and prosperous DeFi ecosystem.
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