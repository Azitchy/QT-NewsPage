import { HeadingWithDots } from "@/components/HeadingWithDots";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type EcosystemTab = "gaming" | "ecology" | "travel";

export const EcosystemSection = () => {
  const { t } = useTranslation("home");
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
      title: t("ecosystemSection.gaming.title"),
      description1: t("ecosystemSection.gaming.description1"),
      description2: t("ecosystemSection.gaming.description2"),
      image: "/ecosystem-gaming.png",
      href: "/games",
    },
    ecology: {
      title: t("ecosystemSection.ecology.title"),
      description1: t("ecosystemSection.ecology.description1"),
      description2: t("ecosystemSection.ecology.description2"),
      image: "/ecosystem-ecology.png",
      href: "/ecosystem#ecology",
    },
    travel: {
      title: t("ecosystemSection.travel.title"),
      description1: t("ecosystemSection.travel.description1"),
      description2: t("ecosystemSection.travel.description2"),
      image: "/ecosystem-travel.png",
      href: "/ecosystem/travel",
    },
  };

  const currentEcosystemData = ecosystemData[activeEcosystemTab];

  return (
    <div className="relative w-full px-4 lg:px-0 lg:mb-56 xl:mb-0">
      <div className="relative h-[99px] ml-0 lg:ml-[71px]">
        <HeadingWithDots text={t("ecosystemSection.title")} />
      </div>

      <div className="mt-[20px] md:px-10 lg:px-28 2xl:px-0 lg:mt-[80px] mx-auto max-w-[1414px]">
        <div className="relative">
          {/* Gradient border wrapper */}
          <div className="relative w-fit mx-auto lg:absolute right-0 lg:top-[-72px] rounded-[40px] p-[1px] bg-border dark:bg-[linear-gradient(96deg,#C6C6C6_69.03%,#2B2B2B_102.49%)]">
            <div className="flex items-center justify-center gap-[10px] rounded-[40px] bg-background p-[5px]">
              <button
                onClick={() => setActiveEcosystemTab("gaming")}
                className={`rounded-[100px] px-[15px] py-2.5 text-sm transition-colors ${
                  activeEcosystemTab === "gaming"
                    ? "bg-primary-foreground text-primary"
                    : "text-primary hover:bg-primary-foreground"
                }`}
              >
                {t("ecosystemSection.tabs.gaming")}
              </button>
              <button
                onClick={() => setActiveEcosystemTab("ecology")}
                className={`rounded-[100px] px-[15px] py-2.5 text-sm transition-colors ${
                  activeEcosystemTab === "ecology"
                    ? "bg-primary-foreground text-primary"
                    : "text-primary hover:bg-primary-foreground"
                }`}
              >
                {t("ecosystemSection.tabs.ecology")}
              </button>
              <button
                onClick={() => setActiveEcosystemTab("travel")}
                className={`rounded-[100px] px-[15px] py-2.5 text-sm transition-colors ${
                  activeEcosystemTab === "travel"
                    ? "bg-primary-foreground text-primary"
                    : "text-primary hover:bg-primary-foreground"
                }`}
              >
                {t("ecosystemSection.tabs.travel")}
              </button>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row w-full h-auto lg:h-[370px] xl:items-center gap-8 lg:gap-[50px] mt-[20px] rounded-[20px]">
            <img
              className="w-full lg:max-w-[682px] lg:flex-1 h-[230px] md:h-[300px] lg:h-[370px] object-cover rounded-[20px]"
              alt={`${currentEcosystemData.title} ecosystem`}
              src={currentEcosystemData.image}
              loading="lazy"
            />

            <div className="flex flex-col h-auto lg:h-[300px] items-start gap-5 flex-1">
              <div className="self-stretch text-foreground dark:text-foreground text-[22px] lg:text-[26px] leading-[30px] lg:leading-[34px] relative mt-[-1.00px] font-inter font-normal tracking-[0px]">
                {currentEcosystemData.title}
              </div>

              <div className="relative self-stretch font-inter font-normal text-foreground dark:text-foreground text-[16px] lg:text-[18px] tracking-[0px] leading-[22px] lg:leading-[24px]">
                {currentEcosystemData.description1}
              </div>

              <div className="relative self-stretch font-inter font-normal text-foreground dark:text-foreground text-[16px] lg:text-[18px] tracking-[0px] leading-[22px] lg:leading-[24px]">
                {currentEcosystemData.description2}
              </div>

              <div className="inline-flex items-center gap-2.5 relative rounded-[30px]">
                <div className="relative w-[72px] h-[19px]">
                  <a href={currentEcosystemData.href}>
                    <div className="absolute h-[19px] -top-px left-0 font-inter font-normal text-primary text-[14px] tracking-[0px] leading-[19px] whitespace-nowrap">
                      {t("ecosystemSection.learnMore")}
                    </div>
                  </a>
                </div>
                <a href={currentEcosystemData.href}>
                  <div className="relative w-[38.53px] h-[38.53px]">
                    <img
                      className="absolute w-[33px] h-[33px] top-[3px] left-0.5 hover:bg-gray-100 rounded-full cursor-pointer transition-all duration-700 ease-in-out hover:bg-primary-foreground hover:scale-110 hover:rotate-[-12deg]"
                      alt="Arrow right icon"
                      src="/arrow-right-icon.svg"
                      loading="lazy"
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
