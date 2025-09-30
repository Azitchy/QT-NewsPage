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

export const contractCards = [
  {
    id: 1,
    image: "/contract-1.svg",
    title: "LUCA Contract",
    description:
      "This refers to the LUCA token contract. LUCA is the native token of the ATM community and also gives a user the right to vote on proposals for the project.",
  },
  {
    id: 2,
    image: "/contract-2.svg",
    title: "Factory Contract",
    description:
      "The factory contract is used to create a connection and then call related smart contracts to help users obtain the respective community incentives.",
  },
  {
    id: 3,
    image: "/contract-3.svg",
    title: "Stake Contract",
    description:
      "The stake contract is used for voting in ATMRank server operation nodes, when exercising users' votes.",
  },
  {
    id: 4,
    image: "/contract-4.svg",
    title: "Incentive Distribution Contract",
    description:
      "This contract is responsible for the distribution of rewards in the ATM community such as ATMRank rewards, token stake rewards and more.",
  },
  {
    id: 5,
    image: "/contract-5.svg",
    title: "Investment LUCA Contract",
    description:
      "The official LUCA contract, from which 5 million tokens will be distributed. LUCA will be released by deploying this contract.",
  },
  {
    id: 6,
    image: "/contract-6.svg",
    title: "LUCA Promotion Reward Contract",
    description:
      "This is the reward contract for referrals to 'Monkey', ATM's official partner social network. This contract is called if any user invites others to join via 'Monkey'.",
  },
  {
    id: 7,
    image: "/contract-7.svg",
    title: "Cross-chain Contract",
    description:
      "Users can release cross-chain currency transfers via several public chains that are officially supported by ATM.",
  },
  {
    id: 8,
    image: "/contract-8.svg",
    title: "Wormhole Contract",
    description:
      "The Wormhole Contract synchronises ATM users' information across multiple chains, in the attempt to achieve a multi-chain relative consensus network.",
  },
];

export const ContractsCarousel = (): JSX.Element => {
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

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
        <div className="flex items-center gap-[15px] px-[9px] py-[5px] rounded-[40px] border border-border">
          <Button
            variant="ghost"
            className={`w-[38.53px] h-[38.53px] p-0 rounded-[19.26px] hover:bg-gray-100 ${
              canPrev ? "bg-primary-foreground" : "bg-transparent"
            }`}
            onClick={() => api?.scrollPrev()}
            disabled={!canPrev}
          >
            <ArrowLeftIcon
              className={`w-5 h-5 ${canPrev ? "text-primary" : "text-gray-400"}`}
            />
          </Button>
          <Button
            variant="ghost"
            className={`w-[38.53px] h-[38.53px] p-0 rounded-[19.26px] hover:bg-[#d6f0f2] ${
              canNext ? "bg-[#e9f6f7]" : "bg-transparent"
            }`}
            onClick={() => api?.scrollNext()}
            disabled={!canNext}
          >
            <ArrowRightIcon
              className={`w-6 h-6 ${canNext ? "text-primary" : "text-gray-400"}`}
            />
          </Button>
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
                    <Card
                      key={card.id}
                      className="w-[330px] h-[300px] xl:w-[360px] xl:h-[330px] p-[30px] rounded-[20px] border border-border hover:shadow-lg transition-shadow text-foreground"
                    >
                      <CardContent className="p-0 h-full">
                        <div className="flex flex-col gap-[15px] h-full">
                          <img
                            className="w-[81px] h-[81px] flex-shrink-0"
                            alt={card.title}
                            src={card.image}
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
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Learn More Button */}
        <div className="mt-[20px]">
          <StyledLink text="Learn more" link="https://github.com/ATM-Developer/atm-contract" newTab />
        </div>
      </div>
    </div>
  );
};