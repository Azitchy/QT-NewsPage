import { HeadingWithDots } from "@/components/HeadingWithDots";
import { StyledLink } from "@/components/StyledLink";
import { useTheme } from "@/components/theme-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export const CommunitySection = (): JSX.Element => {
  const { t } = useTranslation('technology');
  const { theme } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  const consensusItems = [
    {
      title: t("communitySection.consensusItems.lockedToken.title"),
      description: t("communitySection.consensusItems.lockedToken.description"),
      icon: "/lock-svgrepo-com-1.png",
      darkIcon: "/lock-svgrepo-com-dark-1.svg",
    },
    {
      title: t("communitySection.consensusItems.investmentAmount.title"),
      description: t(
        "communitySection.consensusItems.investmentAmount.description"
      ),
      icon: "/investment-amount-icon-1.png",
      darkIcon: "/investment-amount-icon-dark-1.svg",
    },
    {
      title: t("communitySection.consensusItems.lockUpTime.title"),
      description: t("communitySection.consensusItems.lockUpTime.description"),
      icon: "/lock-up-time-1.png",
      darkIcon: "/lock-up-time-dark-1.svg",
    },
    {
      title: t("communitySection.consensusItems.contractCancellation.title"),
      description: t(
        "communitySection.consensusItems.contractCancellation.description"
      ),
      icon: "/contract-cancellation-1.png",
      darkIcon: "/contract-cancellation-dark-1.svg",
    },
  ];

  const handleMouseEnter = (index: number) => {
    setExpandedIndex(index);
  };

  const handleMouseLeave = () => {
    // Keep the last hovered item expanded
  };

  return (
    <section className="px-[16px] md:px-[70px] large:px-[120px] pt-[60px] xl:pt-[100px]">
      <HeadingWithDots text={t("communitySection.heading")} />

      <div className="pt-[20px] px-0 tablet:px-[77px] xl:px-[134px] large:px-[203px]">
        <div className="flex flex-col justify-center mx-auto gap-[40px] xl:gap-[80px]">
          {/* First section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex flex-col max-w-[784px] gap-5 flex-1">
              <h2 className="text-[20px] leading-[27px] font-normal xl:text-[26px] xl:leading-[34px]">
                {t("communitySection.whatIsConsensus.title")}
              </h2>
              <p className="text-[16px] leading-[22px] font-light xl:text-[18px] xl:leading-[24px] xl:font-normal">
                {t("communitySection.whatIsConsensus.description")}
              </p>
            </div>

            <div className="flex items-center justify-center  max-w-[286px] xl:max-w-[515px] mx-auto">
              <img
                src="../consensus-img.png"
                alt="Consensus"
                className="object-contain dark:opacity-50"
                loading="lazy"
              />
            </div>
          </div>

          {/* How to create consensus connection */}
          <div className="max-w-[874px] mx-auto">
            <div className="flex flex-col gap-5 mb-8">
              <h2 className="text-[20px] leading-[27px] font-normal xl:text-[26px] xl:leading-[34px]">
                {t("communitySection.howToCreate.title")}
              </h2>
              <p className="text-[16px] leading-[22px] font-light xl:text-[18px] xl:leading-[24px] xl:font-normal">
                {t("communitySection.howToCreate.description")}
              </p>
            </div>

            <Card className="flex flex-col items-start gap-[25px] border-none shadow-none bg-transparent text-foreground">
              <CardContent className="p-0 w-full">
                {consensusItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <div
                      className="w-full py-4 cursor-pointer transition-all duration-500 rounded-lg"
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between w-full">
                        {/* Title + Description */}
                        <div className="flex flex-col items-start flex-1 pr-[20px]">
                          <h3 className="text-[20px] leading-[27px] font-normal xl:text-[26px] xl:leading-[34px] text-left">
                            {item.title}
                          </h3>

                          <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out w-full ${
                              expandedIndex === index
                                ? "opacity-100 translate-y-0 mt-[15px]"
                                : "max-h-0 opacity-0 -translate-y-2 mt-0"
                            }`}
                          >
                            {item.description && (
                              <p className="text-[16px] leading-[22px] font-light xl:text-[18px] xl:leading-[24px] xl:font-normal text-left break-words">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 flex justify-center xl:justify-end transition-all duration-500 ease-in-out ${
                            expandedIndex === index
                              ? "opacity-100 translate-x-0 scale-100 max-h-[80px] mt-2"
                              : "opacity-0 translate-x-4 scale-95 max-h-0 overflow-hidden mt-0"
                          }`}
                        >
                          {item.icon && (
                            <div className="w-[74px] h-[73px] mx-auto xl:mx-0">
                              <img
                                className="w-[70px] h-[70px] object-contain transition-transform duration-300 hover:scale-105"
                                alt="Consensus Item Icons"
                                src={ theme === 'dark' ? item.darkIcon : item.icon }
                                loading="lazy"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {index < consensusItems.length - 1 && (
                      <Separator decorative orientation="horizontal" />
                    )}
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>

            <StyledLink
              text={t("communitySection.viewConnections")}
              link="/webapp"
            />
          </div>

          {/* Consensus connection income */}
          <div className="flex flex-col md:flex-row md:justify-center gap-8 items-center">
            {/* Text first on mobile, image second */}
            <div className="flex flex-col max-w-[783px] gap-5 order-1 md:order-2 flex-1">
              <h2 className="text-[20px] leading-[27px] font-normal xl:text-[26px] xl:leading-[34px]">
                {t("communitySection.consensusIncome.title")}
              </h2>
              <p className="text-[16px] leading-[22px] font-light xl:text-[18px] xl:leading-[24px] xl:font-normal">
                {t("communitySection.consensusIncome.description1")}
              </p>
              <p className="text-[16px] leading-[22px] font-light xl:text-[18px] xl:leading-[24px] xl:font-normal">
                {t("communitySection.consensusIncome.description2")}
              </p>

              <StyledLink
                text={t("communitySection.consensusIncome.viewIncome")}
                link="/webapp"
              />
            </div>

            {/* Image second on mobile, first on xl */}
            <div className="flex items-center justify-center flex-shrink-0 max-w-[246px] order-2 md:order-1">
              <img
                src="../connection-img.png"
                alt="Connection"
                className="object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
