import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

export const ThirdPartySection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);

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
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (cardRef.current) {
        setCardWidth(cardRef.current.offsetWidth + 21);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemsPerPage = isMobile ? 2 : 1;
  const totalPages = Math.ceil(thirdPartyData.partners.length / itemsPerPage);

  const handleNavigation = (direction: "prev" | "next") => {
    if (direction === "prev" && currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
    if (direction === "next" && currentSlide < totalPages - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const startIndex = currentSlide * itemsPerPage;
  const visiblePartners = isMobile
    ? thirdPartyData.partners.slice(startIndex, startIndex + itemsPerPage)
    : thirdPartyData.partners;

  return (
    <div className="w-full mx-auto">
      {/* Header */}
      <div className="flex items-start mb-12">
        <div className="relative  ml-0 lg:ml-[30px]">
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

      <div className="w-full  mb-[40px]  md:pl-[135px] 2xl:pl-[260px]">
        <p className="max-w-[784px] [font-family:'Inter',Helvetica] font-light text-[#1c1c1c] text-[18px] lg:text-[20px] leading-[24px] lg:leading-[27px] text-left">
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
      <div className="flex justify-end w-full mb-[20px] pr-4 2xl:hidden">
        <div className="flex items-center gap-[15px] px-[9px] py-[5px] rounded-[40px] border border-solid border-[#eeeeee] bg-white dark:bg-[#090920] shadow-sm">
          <Button
            variant="ghost"
            disabled={currentSlide === 0}
            className={`w-[38.53px] h-[38.53px] p-0 rounded-full transition-colors ${
              currentSlide === 0
                ? "bg-gray-200  opacity-50 cursor-not-allowed"
                : "bg-white  hover:bg-gray-50"
            }`}
            onClick={() => handleNavigation("prev")}
          >
            <img
              className="w-5 h-5"
              alt="Arrow left"
              src="/arrow-left-icon.svg"
            />
          </Button>

          <Button
            disabled={currentSlide >= totalPages - 1}
            className={`w-[38.53px] h-[38.53px] p-0 rounded-full transition-colors ${
              currentSlide >= totalPages - 1
                ? "bg-gray-200  opacity-50 cursor-not-allowed"
                : "bg-[#e9f6f7] hover:bg-[#d8eef0]"
            }`}
            onClick={() => handleNavigation("next")}
          >
            <img
              className="w-6 h-6"
              alt="Arrow right"
              src="/arrow-right-icon-3.svg"
            />
          </Button>
        </div>
      </div>

      {/* Cards Section */}
      <div className="overflow-hidden w-full  2xl:max-w-[1926px] mx-auto">
        {isMobile ? (
          // Mobile
          <div className="flex flex-col gap-[10px]">
            {visiblePartners.map((partner, index) => (
              <Card
                key={index}
                className="w-full  bg-[#fbfbfb] rounded-[20px] border border-solid border-[#eeeeee]"
              >
                <CardContent className="flex flex-col h-full items-start justify-between gap-[20px] p-[30px]">
                  <img
                    className="w-[50px] h-[50px]"
                    alt={partner.name}
                    src={partner.icon}
                  />
                  <div className="flex flex-col gap-5 flex-1">
                    <h3 className="font-medium text-[#2ea8af] text-[20px] leading-[27px]">
                      {partner.name}
                    </h3>
                    <p className="text-[#1c1c1c] text-[14px] lg:text-[16px] leading-[19px] lg:leading-[24px] flex-1">
                      {partner.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Desktop
          <div
            className="flex gap-[15px] lg:gap-[19px] transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * cardWidth}px)`,
            }}
          >
            {visiblePartners.map((partner, index) => (
              <Card
                ref={index === 0 ? cardRef : null}
                key={index}
                className="w-full 2xl:max-w-[330px] md:max-w-[280px] overflow-hidden border border-solid border-[#eeeeee] bg-[#fbfbfb] rounded-[20px] flex-shrink-0"
              >
                <CardContent className="flex flex-col h-full items-start justify-between md:gap-[20px] lg:gap-[15px] p-[30px]">
                  <img
                    className="w-[50px] h-[50px]"
                    alt={partner.name}
                    src={partner.icon}
                  />
                  <div className="flex flex-col md:gap-[20px] lg:gap-[15px] flex-1">
                    <h3 className="font-medium text-[#2ea8af] text-[20px] leading-[27px]">
                      {partner.name}
                    </h3>
                    <p className="text-[#1c1c1c] text-[14px] lg:text-[16px] leading-[19px] lg:leading-[24px] flex-1">
                      {partner.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
