import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

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

  return (
    <div className="w-full pt-[20px]">
      {/* Carousel Navigation */}
      <div className="flex justify-end mb-8 px-[16px] tablet:px-[60px]">
        <div className="flex items-center gap-[15px] px-[9px] py-[5px] rounded-[40px] border border-[#eeeeee]">
          <Button
            variant="ghost"
            className="w-[38.53px] h-[38.53px] p-0 hover:bg-gray-100"
            onClick={() => api?.scrollPrev()}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            className="w-[38.53px] h-[38.53px] p-0 bg-[#e9f6f7] rounded-[19.26px] hover:bg-[#d6f0f2]"
            onClick={() => api?.scrollNext()}
          >
            <ArrowRightIcon className="w-6 h-6" />
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
          {/* -mx ensures even spacing */}
          <CarouselContent className="-mx-[7.5px] desktop:-mx-[10px]">
            {contractCards.map((card) => (
              <CarouselItem
                key={card.id}
                className="px-[7.5px] desktop:px-[10px] basis-auto flex-shrink-0"
              >
                <Card className="w-[330px] h-[300px] desktop:w-[360px] desktop:h-[330px] p-[30px] bg-[#fbfbfb] rounded-[20px] border border-[#eeeeee] hover:shadow-lg transition-shadow">
                  <CardContent className="p-0 h-full">
                    <div className="flex flex-col gap-[15px] h-full">
                      <img
                        className="w-[81px] h-[81px] flex-shrink-0"
                        alt={card.title}
                        src={card.image}
                      />
                      <h3 className="text-[#2ea8af] font-[family:var(--typography-family-body,Inter)] text-lg font-medium leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-[color:var(--main-text,#1C1C1C)] font-[family:var(--typography-family-body,Inter)] text-sm leading-relaxed flex-1">
                        {card.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Learn More Button */}
        <div className="mt-[20px]">
          <Button
            variant="ghost"
            className="inline-flex items-center gap-2.5 p-0 rounded-[30px] hover:bg-transparent"
          >
            <span className="text-[color:var(--primary-colour)] font-[family:var(--typography-family-body,Inter)]">
              Learn more
            </span>
            <div className="w-[38.53px] h-[38.53px] flex items-center justify-center">
              <img
                className="w-[33px] h-[33px]"
                alt="Arrow right icon"
                src="/arrow-right-icon.svg"
              />
            </div>
          </Button>
      </div>
      </div>
    </div>
  );
};
