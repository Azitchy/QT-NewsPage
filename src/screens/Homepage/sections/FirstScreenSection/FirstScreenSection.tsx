import React, { useState, useEffect } from "react";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";

export const FirstScreenSection = (): JSX.Element => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [
    {
      id: 0,
      leftText: "Connect with your friends",
      rightTitle: "Connect and earn LUCA token",
      rightTitleHighlight: "rewards",
      rightSubtitle: "in our web3 community",
      image: "/connect-with-your-friends-image.png",
    },
    {
      id: 1,
      leftText: "Build stronger networks",
      rightTitle: "Build meaningful",
      rightTitleHighlight: "connections",
      rightSubtitle: "that grow your influence",
      image: "/hero1.png",
    },
    {
      id: 2,
      leftText: "Earn LUCA rewards",
      rightTitle: "Get rewarded for every",
      rightTitleHighlight: "contribution",
      rightSubtitle: "to the ecosystem",
      image: "/hero2.png",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = carouselSlides[currentSlide];

  return (
    <section className="w-full xl:max-w-7xl 2xl:max-w-[1440px] 2xl:mx-auto  overflow-hidden xl:overflow-visible">
      <div className="h-full w-full mx-auto px-4 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">
        {/* Dots (desktop left, mobile bottom) */}
        <div className="absolute top-56 sm:top-44 left-3 lg:relative lg:top-0 lg:left-0 flex flex-col gap-3 z-20">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-[10px] h-[10px] rounded-full transition-transform duration-300 hover:scale-110 ${
                currentSlide === index ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Content wrapper */}
        <div className="flex flex-col sm:flex-row gap-2 items-center justify-between w-full h-full">
          {/* Left text */}
          <div className="flex flex-col lg:flex-row items-center justify-center">
            <div className="flex-1 text-center sm:ml-10 lg:ml-0 lg:text-left mt-6 lg:mt-0 z-20">
              <p className="text-[#4F5555] dark:text-[#999F9F] w-full lg:w-[133px] text-[18px] md:text-base lg:text-lg opacity-70">
                {currentSlideData.leftText}
              </p>
            </div>

            {/* Center image */}
            <div className="flex lg:relative lg:right-[200px] items-center justify-center mr-20 md:mr-0 w-[450px] sm:w-[300px] md:w-[350px] lg:w-[800px] xl:h-[424px] z-10">
              <img
                src={currentSlideData.image}
                alt="carousel visual"
                className="w-full h-full object-contain bg-cover transition-all duration-700 ease-in-out"
              />
            </div>
          </div>

          {/* Right text */}
          <div className="flex-1 text-center md:text-left mt-0 md:mt-6 lg:-mt-24 lg:relative lg:right-[200px]">
            <Card className="inline-flex items-center mb-[15px] md:mb-[30px] px-[8px] md:px-[10px] py-[5px] rounded-full border border-gray-200 backdrop-blur-md bg-[linear-gradient(180deg,rgba(252,252,252,0.40)_44.56%,rgba(242,242,242,0.40)_100%)] dark:bg-[linear-gradient(180deg,rgba(81,79,79,0.40)_49.59%,rgba(36,36,36,0.40)_100%)] z-30">
              <CardContent className="flex items-center gap-[5px] p-0">
                <Badge className="px-3 py-1 rounded-full bg-[linear-gradient(136deg,#AADA5D_0%,#0DAEB9_98.28%)] text-background dark:text-primary-foreground text-sm">
                  NEW
                </Badge>
                <p className="text-foreground dark:text-[#DCDCDC] text-sm truncate font-inter w-48 xl:w-full overflow-hidden whitespace-nowrap">
                  ATM.connect now supports multi-chain functionality!
                </p>
                <button className="rounded-full bg-primary-foreground hover:bg-cyan-100 transition">
                  <a href="#">
                    <img
                      src="/arrow-right-icon-4.svg"
                      alt="Go"
                      className="w-12 h-9"
                    />
                  </a>
                </button>
              </CardContent>
            </Card>
            <h2 className="max-w-[512px] xl:w-[512px] large:w-[784px] large:max-w-[748px] text-[26px] text-start font-space-grotesk leading-8 lg:leading-10 lg:text-[32px] font-extrabold  bg-[linear-gradient(136deg,#AADA5D_0%,#0DAEB9_98.28%)] bg-clip-text text-transparent mb-2">
              {currentSlideData.rightTitle}{" "}
              {currentSlideData.rightTitleHighlight}{" "}
              <span className="text-foreground text-[26px] lg:text-[32px] font-extralight dark:text-foreground">
                {currentSlideData.rightSubtitle}
              </span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};
