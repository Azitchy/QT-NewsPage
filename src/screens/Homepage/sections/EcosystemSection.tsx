import React, { useState } from "react";

type EcosystemTab = "gaming" | "ecology" | "travel";

export const EcosystemSection = () => {
  const [activeEcosystemTab, setActiveEcosystemTab] =
    useState<EcosystemTab>("gaming");

  const ecosystemData: Record<
    EcosystemTab,
    {
      title: string;
      description1: string;
      description2: string;
      image: string;
      href?: string;
    }
  > = {
    gaming: {
      title: "Gaming",
      description1:
        "Embark on an exhilarating journey into the future of gaming, where innovation knows no bounds.",
      description2:
        "The gaming future transcends entertainment, blending technology, creativity, and community to craft an immersive digital landscape.",
      image: "/ecosystem-gaming.png",
      href: "/games",
    },
    ecology: {
      title: "Ecology",
      description1:
        "Discover sustainable solutions that harmonize technology with environmental responsibility.",
      description2:
        "Our ecological initiatives focus on creating a greener future through innovative blockchain technology and sustainable practices.",
      image: "/ecosystem-ecology.png",
    },
    travel: {
      title: "Traveling",
      description1:
        "Elevate your travel experience with LUCA. Through strategic partnerships with travel agencies, LUCA opens doors to a world of possibilities.",
      description2:
        "Now, users can seamlessly use LUCA to explore the globe, unlocking a new era of convenience and flexibility in travel.",
      image: "/ecosystem-travel.png",
      href: "/ecosystem/travel",
    },
  };

  const currentEcosystemData = ecosystemData[activeEcosystemTab];

  return (
    <div className="relative w-full px-4 lg:px-0 lg:mb-56 xl:mb-0">
      <div className="relative h-[99px] ml-0 lg:ml-[71px]">
        <div className="left-10 absolute h-11 top-[27px] lg:left-[45px] font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] whitespace-nowrap [font-style:var(--titles-h2-sectionheading-400-font-style)]">
          ECOSYSTEM
        </div>
        <img
          className="w-[99px] h-[99px] absolute top-0 left-0"
          alt="Dots"
          src="/dots-4.svg"
        />
      </div>

      <div className="mt-[20px] md:px-10 lg:px-28 2xl:px-0 lg:mt-[80px] mx-auto max-w-[1414px]">
        <div className="relative">
          {/* Gradient border wrapper */}
          <div className="relative w-fit mx-auto lg:absolute right-0 top-[-72px] rounded-[40px] p-[1px] bg-border dark:bg-[linear-gradient(96deg,#C6C6C6_69.03%,#2B2B2B_102.49%)]">
            <div className="flex items-center justify-center gap-[10px] rounded-[40px] bg-background p-[5px]">
              <button
                onClick={() => setActiveEcosystemTab("gaming")}
                className={`rounded-[100px] px-[15px] py-2.5 text-sm transition-colors ${
                  activeEcosystemTab === "gaming"
                    ? "bg-primary-foreground text-primary"
                    : "text-primary hover:bg-primary-foreground"
                }`}
              >
                Gaming
              </button>
              <button
                onClick={() => setActiveEcosystemTab("ecology")}
                className={`rounded-[100px] px-[15px] py-2.5 text-sm transition-colors ${
                  activeEcosystemTab === "ecology"
                    ? "bg-primary-foreground text-primary"
                    : "text-primary hover:bg-primary-foreground"
                }`}
              >
                Ecology
              </button>
              <button
                onClick={() => setActiveEcosystemTab("travel")}
                className={`rounded-[100px] px-[15px] py-2.5 text-sm transition-colors ${
                  activeEcosystemTab === "travel"
                    ? "bg-primary-foreground text-primary"
                    : "text-primary hover:bg-primary-foreground"
                }`}
              >
                Travel
              </button>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row w-full h-auto lg:h-[370px] xl:items-center gap-8 lg:gap-[50px] mt-[20px] rounded-[20px]">
            <img
              className="w-full lg:max-w-[682px] lg:flex-1 h-[230px] md:h-[300px] lg:h-[370px] object-cover rounded-[20px]"
              alt={`${currentEcosystemData.title} ecosystem`}
              src={currentEcosystemData.image}
            />

            <div className="flex flex-col h-auto lg:h-[300px] items-start gap-5 flex-1">
              <div className="self-stretch text-foreground dark:text-foreground text-[22px] lg:text-[length:var(--titles-h5-large-text-400-font-size)] leading-[30px] lg:leading-[var(--titles-h5-large-text-400-line-height)] relative mt-[-1.00px] font-titles-h5-large-text-400 font-[number:var(--titles-h5-large-text-400-font-weight)] tracking-[var(--titles-h5-large-text-400-letter-spacing)] [font-style:var(--titles-h5-large-text-400-font-style)]">
                {currentEcosystemData.title}
              </div>

              <div className="relative self-stretch font-body-body2-400 font-[number:var(--body-body2-400-font-weight)] text-foreground dark:text-foreground text-[16px] lg:text-[length:var(--body-body2-400-font-size)] tracking-[var(--body-body2-400-letter-spacing)] leading-[22px] lg:leading-[var(--body-body2-400-line-height)] [font-style:var(--body-body2-400-font-style)]">
                {currentEcosystemData.description1}
              </div>

              <div className="relative self-stretch font-body-body2-400 font-[number:var(--body-body2-400-font-weight)] text-foreground dark:text-foreground text-[16px] lg:text-[length:var(--body-body2-400-font-size)] tracking-[var(--body-body2-400-letter-spacing)] leading-[22px] lg:leading-[var(--body-body2-400-line-height)] [font-style:var(--body-body2-400-font-style)]">
                {currentEcosystemData.description2}
              </div>

              <div className="inline-flex items-center gap-2.5 relative rounded-[30px]">
                <div className="relative w-[72px] h-[19px]">
                  <div className="absolute h-[19px] -top-px left-0 font-body-body-4-400 font-[number:var(--body-body-4-400-font-weight)] text-primary text-[length:var(--body-body-4-400-font-size)] tracking-[var(--body-body-4-400-letter-spacing)] leading-[var(--body-body-4-400-line-height)] whitespace-nowrap [font-style:var(--body-body-4-400-font-style)]">
                    Learn more
                  </div>
                </div>
                <a href={currentEcosystemData.href}>
                  <div className="relative w-[38.53px] h-[38.53px]">
                    <img
                      className="absolute w-[33px] h-[33px] top-[3px] left-0.5 hover:bg-gray-100 rounded-full cursor-pointer transition-all duration-700 ease-in-out hover:bg-primary-foreground hover:scale-110 hover:rotate-[-12deg]"
                      alt="Arrow right icon"
                      src="/arrow-right-icon.svg"
                    />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
