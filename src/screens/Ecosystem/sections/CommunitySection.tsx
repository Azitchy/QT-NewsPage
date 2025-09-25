import React, { useState } from "react";
import { Button } from "../../../components/ui/button";

export const CommunitySection = () => {
  const communityData = {
    title: "community",
    description:
      "Token PR is one of ATM's open decentralised community ecosystem. Third-party projects can join Token PR and add their project token to the ATM ecosystem. And by accessing the PR algorithm, they reward users who use the project Token to connect, incentivise ATM users and project users, and provide users with better ecosystem services.",
    howToJoin: {
      title: "How to join Token PR",
      description:
        "After a third-party project joins the ATM ecosystem through a community proposal, users can use the Token of the project party to create a consensus connection, and calculate the Token PR value of the Token through the ATM PR algorithm. ATM will calculate and distribute the consensus income of the Token to the user according to the Token PR value and the reward distribution proportion of the project party.",
    },
    rewardModes: {
      title: "Reward modes for ATM projects",
      subtitle: "Tap numbers to view 3 reward modes",
      modes: [
        {
          id: 1,
          number: "1",
          description:
            "All Token rewards are overall distribution without the need to calculate Token PR. Rewards are distributed according to the main PR weight;",
        },
        {
          id: 2,
          number: "2",
          description:
            "Token rewards consists of overall distribution and independent distribution. For example, the overall rewards account for 40% and the independent rewards account for 60%. Token PR needs to be calculated. The overall rewards are distributed based on the main PR weight and the independent rewards are distributed based on the Token PR weight;",
        },
        {
          id: 3,
          number: "3",
          description:
            "Token rewards are all independent distribution and need to calculate Token PR. Rewards are distributed according to the Token PR weight.",
        },
      ],
      buttons: [
        {
          text: "Join now",
          primary: true,
          href: "#",
        },
        {
          text: "Learn more about rewards",
          primary: false,
          href: "/community",
        },
      ],
    },
  };
  const [active, setActive] = useState(communityData.rewardModes.modes[0].id);

  return (
    <div className="flex flex-col gap-10 lg:gap-16 w-full">
      <div className="w-full">
        <div className="flex flex-col md:flex-row gap-[20px] lg:gap-[70px] 2xl:gap-[200px] md:mt-[60px] items-start  mb-12">
          <div className="flex flex-col">
            <div className="relative  ml-0 lg:ml-[30px]">
              <div className="font-titles-h2-sectionheading-400 text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] ml-12 mt-7 uppercase">
                {communityData.title}
              </div>
              <img
                className="absolute w-[99px] h-[99px] top-0 left-0"
                alt="Dots"
                src="/dots.svg"
              />
            </div>
            <div className="flex-1 md:max-w-[519px] lg:max-w-[750px] 2xl:max-w-[955px] font-inter text-foreground dark:text-foreground text-[16px] lg:text-xl leading-[24px] lg:leading-[27px] mt-14 lg:ml-20 2xl:ml-[300px] text-left">
              <span className="font-light">
                Token PR is one of ATM's open decentralised community ecosystem.{" "}
              </span>
              <span className="font-body-body1-500 font-medium">
                Third-party projects can join Token PR and add their project
                token to the ATM ecosystem
              </span>
              <span className="font-light">
                . And by accessing the PR algorithm, they reward users who use
                the project Token to connect, incentivise ATM users and project
                users, and provide users with better ecosystem services.
              </span>
            </div>
          </div>
          <div className="w-[360px] h-[182px] md:w-[287px] md:h-[270px] 2xl:w-[400px] 2xl:h-[295px] bg-[url(token-img.png)] bg-cover bg-center rounded-lg"></div>
        </div>
      </div>

      <div className="flex flex-col w-full items-start gap-5 max-w-[782px] 2xl:max-w-[955px] lg:mx-60 2xl:mx-96">
        <h3 className="font-titles-h5-large-text-400 text-foreground dark:text-foreground text-[20px] lg:text-[length:var(--titles-h5-large-text-400-font-size)] tracking-[var(--titles-h5-large-text-400-letter-spacing)] leading-[27px] lg:leading-[var(--titles-h5-large-text-400-line-height)] text-left">
          {communityData.howToJoin.title}
        </h3>
        <p className="font-body-body2-400 text-foreground dark:text-foreground text-[16px] lg:text-[length:var(--body-body2-400-font-size)] tracking-[var(--body-body2-400-letter-spacing)] leading-[22px] lg:leading-[var(--body-body2-400-line-height)] text-left">
          {communityData.howToJoin.description}
        </p>
      </div>

      <div className="flex flex-col items-center gap-[5px] mb-12">
        <h3 className="font-titles-h5-large-text-400 text-foreground dark:text-foreground text-[20px] lg:text-[length:var(--titles-h5-large-text-400-font-size)] tracking-[var(--titles-h5-large-text-400-letter-spacing)] leading-[27px] lg:leading-[var(--titles-h5-large-text-400-line-height)] text-center">
          {communityData.rewardModes.title}
        </h3>
        <p className="font-body-labeltext-400 text-[#4f5555] text-[12px] lg:text-[length:var(--body-labeltext-400-font-size)] tracking-[var(--body-labeltext-400-letter-spacing)] leading-[17px] lg:leading-[var(--body-labeltext-400-line-height)] text-center">
          {communityData.rewardModes.subtitle}
        </p>

        <div className="flex justify-center items-center relative w-full">
          {/* Desktop version with animation */}
          <div className="hidden md:flex flex-row items-center transition-all duration-700 ease-in-out space-x-8">
            {communityData.rewardModes.modes.map((mode) => {
              const isActive = mode.id === active;

              const activeIndex = communityData.rewardModes.modes.findIndex(
                (m) => m.id === active
              );

              const isNext =
                active !== 3 &&
                mode.id ===
                  communityData.rewardModes.modes[activeIndex + 1]?.id;

              return (
                <div
                  key={mode.id}
                  onClick={() => setActive(mode.id)}
                  className="flex items-center cursor-pointer transition-all duration-700 ease-in-out"
                >
                  {/* Number */}
                  <span
                    className={`font-bold transition-all duration-700 ease-in-out ${
                      isActive
                        ? "text-[150px] lg:text-[250px] text-primary"
                        : isNext
                        ? "text-[150px] lg:text-[250px] text-[#F2F9FF] dark:text-[#40576A]"
                        : "text-[150px] lg:text-[250px] text-[#F2F9FF] dark:text-[#40576A]"
                    }`}
                  >
                    {mode.id}
                  </span>

                  {/* Active content */}
                  {isActive && (
                    <div className="ml-4 transition-all duration-700 ease-in-out">
                      <p className="text-foreground dark:text-foreground text-[14px] lg:text-[16px] max-w-[630px] leading-[19px] lg:leading-[24px]">
                        {mode.description}
                      </p>
                    </div>
                  )}

                  {/* Next blurred preview */}
                  {isNext && (
                    <div className="ml-4 relative w-[150px] h-[80px] overflow-hidden">
                      <p className="text-foreground text-[12px] lg:text-[14px] leading-[16px] lg:leading-[20px] opacity-70 blur-[1.5px]">
                        {mode.description}
                      </p>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-white dark:bg-none"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile version without animation */}
          <div className="flex flex-col items-center justify-center space-y-6 md:hidden w-full">
            {communityData.rewardModes.modes.map((mode) => (
              <div
                key={mode.id}
                className="flex gap-[15px] items-center justify-center"
              >
                <span className="w-[105px] text-[140px] font-bold text-[#F2F9FF]">
                  {mode.number}
                </span>
                <p className="text-foreground text-[14px] leading-[19px] w-[240px]">
                  {mode.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-5">
          {communityData.rewardModes.buttons.map((button, index) =>
            button.primary ? (
              <Button
                key={index}
                className="bg-primary text-background dark:text-primary-foreground rounded-[30px] px-[12px] lg:px-[20px] py-3 font-body-body3-400 text-[16px] leading-[24px] hover:bg-primary/90"
              >
                <a href={button.href}>{button.text}</a>
              </Button>
            ) : (
              <div
                key={index}
                className="flex items-center gap-[10px] cursor-pointer"
              >
                <a href={button.href}>
                  <span className="font-body-body-4-400 text-primary text-[14px] lg:text-[16px] tracking-[var(--body-body-4-400-letter-spacing)] leading-[19px] lg:leading-[var(--body-body-4-400-line-height)]">
                    {button.text}
                  </span>
                </a>
                <a href={button.href}>
                  <div className="w-[38px] h-[38px] relative">
                    <img
                      className="absolute w-[33px] h-[33px] top-[3px] left-0.5 rounded-full cursor-pointer hover:bg-primary-foreground transition-all duration-700 ease-in-out hover:scale-110 hover:rotate-[-12deg]"
                      alt="Arrow right icon"
                      src="/arrow-right-icon.svg"
                    />
                  </div>
                </a>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
