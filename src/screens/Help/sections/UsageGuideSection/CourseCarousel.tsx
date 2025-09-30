import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ArrowLeftIcon, ArrowRightIcon, ArrowRight } from "lucide-react";
import { StyledLink } from "@/components/StyledLink";

export const CourseCarousel = (): JSX.Element => {
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const tutorialCards = [
    {
      image: "/img-1.png",
      title: "Connect MetaMask wallet",
      date: "10/01/2025",
      showDate: true,
      link: "./pdf/connectWallet.pdf",
    },
    {
      image: "/img-2.png",
      title: "How to participate in PR node stake and election",
      date: "10/01/2025",
      showDate: true,
      link: "./pdf/participateInPR.pdf",
    },
    {
      image: "/img-3.png",
      title: "How to add LUCA/USDC liquidity",
      date: "10/01/2025",
      showDate: true,
      link: "./pdf/howAddLiquidity.pdf",
    },
    {
      image: "/img-4.png",
      title: "Create a consensus connection",
      date: "10/01/2025",
      showDate: false,
      link: "./pdf/createConsensusConnection.pdf",
    },
    {
      image: "/img-5.png",
      title: "How to check and receive total income",
      date: "10/01/2025",
      showDate: false,
      link: "./pdf/checkIncome.pdf",
    },
    {
      image: "/img-6.png",
      title: "How to purchase LUCA",
      date: "10/01/2025",
      showDate: false,
      link: "./pdf/purchaseLUCA.pdf",
    },
    {
      image: "/img-7.png",
      title: "How to check consensus connection details",
      date: "10/01/2025",
      showDate: false,
      link: "./pdf/queryConnectionByAddress.pdf",
    },
    {
      image: "/img-8.png",
      title: "How to initiate a community proposal",
      date: "10/01/2025",
      showDate: false,
      link: "./pdf/initiateCommunityProposal.pdf",
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

  return (
    <section className="w-full">
      {/* Carousel Navigation */}
      <div className="flex justify-end mb-8">
        <div className="flex items-center gap-[15px] px-[9px] py-[5px] rounded-[40px] border border-border">
          <Button
            variant="ghost"
            className={`w-[38.53px] h-[38.53px] p-0 rounded-full hover:bg-gray-100 ${
              canPrev ? "bg-primary-foreground" : "bg-transparent"
            }`}
            onClick={() => api?.scrollPrev()}
            disabled={!canPrev}
          >
            <ArrowLeftIcon
              className={`w-5 h-5 ${canPrev ? "text-[#2EA8AF]" : "text-gray-400"}`}
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
              className={`w-6 h-6 ${canNext ? "text-[#2EA8AF]" : "text-gray-400"}`}
            />
          </Button>
        </div>
      </div>

      {/* Carousel Content */}
      <div>
        <Carousel
          className="w-full"
          setApi={setApi}
          opts={{ align: "start", loop: false }}
        >
          <CarouselContent className="-mx-[7.5px] xl:-mx-[10px]">
            {tutorialCards.map((card, index) => (
              <CarouselItem
                key={index}
                className="px-[7.5px] xl:px-[10px] basis-auto flex-shrink-0"
              >
                <Card className="flex flex-col w-[360px] xl:w-[402px] h-[300px] xl:h-[340px] border border-solid border-border rounded-[20px] bg-card shadow-sm">
                  <CardContent className="flex flex-col p-[15px] rounded-[20px] flex-1">
                    <img
                      className="w-full h-[122px] xl:h-[164px] rounded-[10px] object-cover"
                      alt="Tutorial thumbnail"
                      src={card.image}
                    />
                    <div className="flex items-center justify-center w-full mt-[15px]">
                      <div className="text-foreground flex-1 font-sans text-[26px] font-normal leading-[34px]">
                        {card.title}
                      </div>
                    </div>
                  </CardContent>

                  {/* Bottom Section */}
                  <div className="flex flex-col items-start px-[20px] py-[15px] rounded-[0px_0px_20px_20px]">
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`text-card-foreground font-normal font-body text-[14px] leading-[19px] ${
                          !card.showDate ? "opacity-0" : ""
                        }`}
                      >
                        {card.date}
                      </div>
                      
                      <StyledLink text="View PDF" link={card.link} newTab />
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};
