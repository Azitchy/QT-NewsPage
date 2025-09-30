import { useState, useEffect } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

export const ThirdPartySection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const thirdPartyData = {
    title: "third-party ecosystem",
    partners: [
      {
        icon: "/binance.svg",
        name: "Binance",
        description:
          "The ATM community can use USDC or USDT as a trading pair of the governance token LUCA. It can also be used as the 'lock-up token' for consensus contract creation.",
      },
      {
        icon: "/bit-go.svg",
        name: "BitGo",
        description:
          "Users can use WBTC as a payment token when creating consensus contracts.",
      },
      {
        icon: "/chain-link.svg",
        name: "Chainlink",
        description:
          "Chainlink will be used as an 'oracle' to update the prices of LUCA and other token in real time.",
      },
      {
        icon: "/eth.svg",
        name: "ETH",
        description:
          "ATM will be issued on the ETH public chain, which is also where the event will take place.",
      },
      {
        icon: "/pancake.svg",
        name: "Pancake",
        description:
          "Here the community can start stake mining, where users can deposit LUCA/USDC or LUCA/USDT to obtain a stable income.",
      },
    ],
  };

  useEffect(() => {
    if (!api) return;
    const updateState = () => {
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    updateState();
    api.on("reInit", updateState);
    api.on("select", updateState);
    return () => {
      api.off("reInit", updateState);
      api.off("select", updateState);
    };
  }, [api]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // for mobile view
  const groupedPartners = [];
  for (let i = 0; i < thirdPartyData.partners.length; i += 2) {
    groupedPartners.push(thirdPartyData.partners.slice(i, i + 2));
  }

  return (
    <div className="w-full mx-auto">
      {/* Header */}
      <div className="flex items-start mb-12">
        <div className="relative ml-0 lg:ml-[30px]">
          <div className="font-titles-h2-sectionheading-400 text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] ml-12 mt-7 uppercase">
            {thirdPartyData.title}
          </div>
          <img
            className="absolute w-[99px] h-[99px] top-0 left-0"
            alt="Dots"
            src="/dots.svg"
          />
        </div>
      </div>

      <div className="w-full mb-[40px] md:pl-[135px] 2xl:pl-[260px]">
        <p className="max-w-[784px] font-inter font-light text-foreground text-[18px] lg:text-[20px] leading-[24px] lg:leading-[27px] text-left">
          In support of development, we've opted to integrate numerous
          third-party applications. Our open-source code is readily accessible
          for all developers.{" "}
          <span className="font-medium">
            ATM's vision encompasses broadening third-party options, enhancing
            our infrastructure to provide developers with a more robust and
            stable platform
          </span>
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-end w-full mb-[20px] pr-4 large:hidden">
        {/* Gradient border wrapper */}
        <div className="relative flex items-center gap-[15px] px-[9px] py-[5px] rounded-[40px] shadow-sm">
          {/* Outer gradient border */}
          <div className="absolute inset-0 rounded-[40px] p-[1px] bg-border dark:bg-[linear-gradient(96deg,#C6C6C6_69.03%,#2B2B2B_102.49%)]">
            <div className="w-full h-full rounded-[40px] bg-background dark:bg-background" />
          </div>

          {/* Actual content */}
          <div className="relative flex items-center gap-[15px]">
            <Button
              variant="ghost"
              disabled={!canPrev}
              className={`w-[38.53px] h-[38.53px] p-0 rounded-[19.26px] hover:bg-gray-100 ${
                canPrev ? "bg-primary-foreground" : "bg-transparent"
              }`}
              onClick={() => api?.scrollPrev()}
            >
              <ArrowLeftIcon
                className={`w-5 h-5 ${
                  canPrev ? "text-primary" : "text-gray-400"
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              disabled={!canNext}
              className={`w-[38.53px] h-[38.53px] p-0 rounded-[19.26px] hover:bg-[#d6f0f2] ${
                canNext ? "bg-[#e9f6f7]" : "bg-transparent"
              }`}
              onClick={() => api?.scrollNext()}
            >
              <ArrowRightIcon
                className={`w-6 h-6 ${
                  canNext ? "text-primary" : "text-gray-400"
                }`}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <Carousel className="w-full" setApi={setApi} opts={{ align: "start" }}>
        <CarouselContent className="flex mt-[20px] large:justify-center">
          {/* For Mobile */}
          {isMobile
            ? groupedPartners.map((pair, idx) => (
                <CarouselItem
                  key={idx}
                  className="basis-full flex-shrink-0 flex flex-col gap-[10px]"
                >
                  {pair.map((partner, i) => (
                    <div className="relative w-full h-[320px] rounded-[20px]">
                      <div className="absolute inset-0 rounded-[20px] p-[1px] bg-border dark:bg-[linear-gradient(96deg,#C6C6C6_69.03%,#2B2B2B_102.49%)]">
                        <div className="w-full h-full rounded-[20px] bg-card dark:bg-card" />
                      </div>

                      {/* Actual Card Content */}
                      <Card
                        key={i}
                        className="relative w-full h-full rounded-[20px] border-none bg-transparent"
                      >
                        <CardContent className="flex flex-col h-full items-start justify-between gap-[20px] p-[30px]">
                          <img
                            className="w-[50px] h-[50px]"
                            alt={partner.name}
                            src={partner.icon}
                          />
                          <div className="flex flex-col gap-5 flex-1">
                            <h3 className="font-medium text-primary text-[20px] leading-[27px]">
                              {partner.name}
                            </h3>
                            <p className="text-foreground text-[14px] lg:text-[16px] leading-[19px] lg:leading-[24px] flex-1">
                              {partner.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </CarouselItem>
              ))
            : thirdPartyData.partners.map((partner, idx) => (
                //  For Desktop
                <CarouselItem
                  key={idx}
                  className="basis-auto flex-shrink-0 w-[330px] md:w-[280px] 2xl:w-[330px] py-2 pb-5 ml-2"
                >
                  <div className="relative rounded-[20px] w-full h-full lg:h-[350px] transform transition-all duration-700 ease-in-out delay-150 hover:scale-105 hover:shadow-lg">
                    {/* Gradient border layer */}
                    <div className="absolute inset-0 rounded-[20px] p-[1px] bg-border dark:bg-[linear-gradient(96deg,#C6C6C6_69.03%,#2B2B2B_102.49%)]">
                      <div className="w-full h-full rounded-[20px] bg-card dark:bg-card" />
                    </div>

                    {/* Card content wrapper */}
                    <Card className="relative w-full h-full rounded-[20px] border-none bg-transparent">
                      <CardContent className="flex flex-col h-full items-start justify-between p-[30px] transition-all duration-500 ease-in-out delay-150 gap-[20px] hover:p-[25px]">
                        <img
                          className="w-[50px] h-[50px] transition-all duration-500 ease-in-out delay-150 hover:mt-[5px]"
                          alt={partner.name}
                          src={partner.icon}
                        />
                        <div className="flex flex-col flex-1 transition-all duration-500 ease-in-out delay-150 gap-5 hover:space-y-1">
                          <h3 className="font-medium text-primary text-[20px] leading-[27px] transition-all duration-500 ease-in-out">
                            {partner.name}
                          </h3>
                          <p className="text-foreground text-[14px] lg:text-[16px] leading-[19px] lg:leading-[24px] flex-1 transition-all duration-500 ease-in-out">
                            {partner.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
