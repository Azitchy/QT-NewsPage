import * as React from "react";
import { useState } from "react";

type Proposal = {
  id: number;
  number: string;
  description: string;
};

const proposalsData: Proposal[] = [
  {
    id: 1,
    number: "1",
    description:
      "In general proposals community members can vote for or against, and the voting will conclude once the total votes exceed 1% of AGT in circulation. The proposal will pass if it receives two thirds of the vote in its favour. If the proposal fails to meet this threshold, it is deemed unsuccessful.",
  },
  {
    id: 2,
    number: "2",
    description:
      "In special proposals there is no for and against, but instead the terms of execution are laid out for the community members to discuss. If there is any objection during this period, the proposal will be reintroduced with modifications.",
  },
];

const ProposalsDisplay: React.FC = () => {
  const [active, setActive] = useState<number>(1);
  const activeIndex = proposalsData.findIndex((p) => p.id === active);

  return (
    <div className="max-w-[1087px] flex justify-center items-center relative w-full py-[20px]">
      {/* xl version with animation */}
      <div className="hidden md:flex flex-row items-center transition-all duration-700 ease-in-out space-x-8">
        {proposalsData.map((proposal) => {
          const isActive = proposal.id === active;
          const isNext =
            active !== proposalsData.length &&
            proposal.id === proposalsData[activeIndex + 1]?.id;
          return (
            <div
              key={proposal.id}
              onClick={() => setActive(proposal.id)}
              className="flex items-center cursor-pointer transition-all duration-700 ease-in-out"
            >
              {/* Number */}
              <span
                className={`font-bold transition-all duration-700 ease-in-out ${
                  isActive
                    ? "text-[150px] xl:text-[250px] text-primary"
                    : "text-[150px] xl:text-[250px] text-[#F2F9FF] dark:text-[#40576A]"
                }`}
              >
                {proposal.number}
              </span>

              {/* Active Content */}
              {isActive && (
                <div className="ml-4 transition-all duration-700 ease-in-out">
                  <p className="font-normal font-[Inter] text-[14px] leading-[19px] xl:text-[16px] xl:leading-[24px]">
                    {proposal.description}
                  </p>
                </div>
              )}

              {/* Next blurred preview */}
              {isNext && (
                <div className="ml-4 relative w-[150px] h-[80px] overflow-hidden">
                  <p className="font-normal font-[Inter] text-[14px] leading-[19px] xl:text-[16px] xl:leading-[24px] opacity-70 blur-[1.5px]">
                    {proposal.description}
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/70 to-background"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile version without animation */}
      <div className="flex flex-col items-center justify-center space-y-6 md:hidden w-full">
        {proposalsData.map((proposal) => (
          <div
            key={proposal.id}
            className="flex gap-[15px] items-center justify-center"
          >
            <span className="w-[105px] text-[140px] font-bold text-[#F2F9FF] dark:text-[#40576A]">
              {proposal.number}
            </span>
            <p className="text-black text-[14px] leading-[19px] w-[240px]">
              {proposal.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProposalsDisplay;
