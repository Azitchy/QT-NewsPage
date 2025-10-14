import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { StyledLink } from "@/components/StyledLink";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme-provider";

export const ContractsCarousel = (): JSX.Element => {
  const { t } = useTranslation("technology");
  const { theme } = useTheme();
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const contractCards = [
    {
      id: 1,
      image: "/contract-1.svg",
      darkImage: "/contract-1-dark.svg",
      title: t("contractsCarousel.contracts.luca.title"),
      description: t("contractsCarousel.contracts.luca.description"),
    },
    {
      id: 2,
      image: "/contract-2.svg",
      darkImage: "/contract-2-dark.svg",
      title: t("contractsCarousel.contracts.factory.title"),
      description: t("contractsCarousel.contracts.factory.description"),
    },
    {
      id: 3,
      image: "/contract-3.svg",
      darkImage: "/contract-3-dark.svg",
      title: t("contractsCarousel.contracts.stake.title"),
      description: t("contractsCarousel.contracts.stake.description"),
    },
    {
      id: 4,
      image: "/contract-4.svg",
      darkImage: "/contract-4-dark.svg",
      title: t("contractsCarousel.contracts.incentive.title"),
      description: t("contractsCarousel.contracts.incentive.description"),
    },
    {
      id: 5,
      image: "/contract-5.svg",
      darkImage: "/contract-5-dark.svg",
      title: t("contractsCarousel.contracts.investment.title"),
      description: t("contractsCarousel.contracts.investment.description"),
    },
    {
      id: 6,
      image: "/contract-6.svg",
      darkImage: "/contract-6-dark.svg",
      title: t("contractsCarousel.contracts.promotion.title"),
      description: t("contractsCarousel.contracts.promotion.description"),
    },
    {
      id: 7,
      image: "/contract-7.svg",
      darkImage: "/contract-7-dark.svg",
      title: t("contractsCarousel.contracts.crossChain.title"),
      description: t("contractsCarousel.contracts.crossChain.description"),
    },
    {
      id: 8,
      image: "/contract-8.svg",
      darkImage: "/contract-8-dark.svg",
      title: t("contractsCarousel.contracts.wormhole.title"),
      description: t("contractsCarousel.contracts.wormhole.description"),
    },
  ];

  useEffect(() => {
    if (!api) return;

    const updateState = () => {
      setCanPrev(api?.canScrollPrev());
      setCanNext(api?.canScrollNext());
    };

    updateState();
    api.on("reInit", updateState);
    api.on("select", updateState);

    return () => {
      api.off("reInit", updateState);
      api.off("select", updateState);
    };
  }, [api]);

  // Split cards into chunks of 2 for mobile/tablet
  const chunkedCards = [];
  for (let i = 0; i < contractCards.length; i += 2) {
    chunkedCards.push(contractCards.slice(i, i + 2));
  }

  return (
    <div className="w-full pt-[20px]">
      {/* Carousel Navigation */}
      <div className="flex justify-end mb-8 px-[16px] tablet:px-[60px]">
        {/* Gradient border wrapper */}
        <div className="dark:border-gradient rounded-[40px]">
          <div className="flex items-center gap-[15px] px-[9px] py-[5px] rounded-[40px] bg-white dark:bg-black border border-border">
            <Button
              variant="ghost"
              className={`w-[38.53px] h-[38.53px] p-0 rounded-full hover:bg-gray-100 ${
                canPrev ? "bg-primary-foreground" : "bg-transparent"
              }`}
              onClick={() => api?.scrollPrev()}
              disabled={!canPrev}
            >
              <ArrowLeftIcon
                className={`w-5 h-5 ${
                  canPrev ? "text-[#2EA8AF]" : "text-gray-400"
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              className={`w-[38.53px] h-[38.53px] p-0 rounded-full hover:bg-gray-100 ${
                canNext ? "bg-primary-foreground" : "bg-transparent"
              }`}
              onClick={() => api?.scrollNext()}
              disabled={!canNext}
            >
              <ArrowRightIcon
                className={`w-6 h-6 ${
                  canNext ? "text-[#2EA8AF]" : "text-gray-400"
                }`}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Contracts Carousel */}
      <div className="w-full px-[16px] tablet:px-[60px] pt-[20px]">
        <Carousel
          className="w-full"
          setApi={setApi}
          opts={{ align: "start", loop: false }}
        >
          <CarouselContent className="-mx-[7.5px] xl:-mx-[10px]">
            {chunkedCards.map((row, idx) => (
              <CarouselItem
                key={idx}
                className="px-[7.5px] xl:px-[10px] basis-auto flex-shrink-0"
              >
                <div className="flex flex-col gap-[15px] xl:flex-row xl:gap-[10px]">
                  {row.map((card) => (
                    <div
                      key={card.id}
                      className="dark:border-gradient rounded-[20px]"
                    >
                      <Card className="w-[330px] h-[300px] xl:w-[360px] xl:h-[330px] p-[30px] rounded-[20px] bg-card border border-border hover:shadow-lg transition-shadow text-foreground">
                        <CardContent className="p-0 h-full">
                          <div className="flex flex-col gap-[15px] h-full">
                            <img
                              className="w-[81px] h-[81px] flex-shrink-0"
                              alt={card.title}
                              src={
                                theme === "dark"
                                  ? card.darkImage
                                  : card.image
                              }
                            />
                            <h3 className="text-primary font-[family:var(--typography-family-body,Inter)] text-lg font-medium leading-tight">
                              {card.title}
                            </h3>
                            <p className="font-[family:var(--typography-family-body,Inter)] text-sm leading-relaxed flex-1">
                              {card.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Learn More Button */}
        <div className="mt-[20px]">
          <StyledLink
            text={t("contractsCarousel.learnMore")}
            link="https://github.com/ATM-Developer/atm-contract"
            newTab
          />
        </div>
      </div>
    </div>
  );
};
