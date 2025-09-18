import { useEffect, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

export const RewardsSection = () => {
  const [currentFeatureSlide, setCurrentFeatureSlide] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [is4K, setIs4K] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const check4K = () => {
      setIs4K(window.innerWidth >= 2560);
      if (cardRef.current) {
        setCardWidth(cardRef.current.offsetWidth + 21);
      }
    };
    check4K();
    window.addEventListener("resize", check4K);
    return () => window.removeEventListener("resize", check4K);
  }, []);

  const handleFeatureNavigation = (direction: "prev" | "next") => {
    if (direction === "prev" && currentFeatureSlide > 0) {
      setCurrentFeatureSlide((prev) => prev - 1);
    }
    if (direction === "next" && currentFeatureSlide < rewardsData.length - 1) {
      setCurrentFeatureSlide((prev) => prev + 1);
    }
  };

  const rewardsData = [
    {
      title: "Connect to games",
      description:
        "Get instant ATM stars and boost daily rewards by linking your game wallet. The longer and more you connect, the bigger your rewards!",
      image: "/connect-to-games.png",
      gradientClass:
        "bg-[linear-gradient(0deg,rgba(30,181,191,1)_5.65%,rgba(129,214,219,1)_31.58%,rgba(226,246,247,1)_59.56%,rgba(232,248,249,1)_77.74%)]",
    },
    {
      title: "Play to win",
      description:
        "Win battles to earn ATM stars, but watch out—losing costs what you bet! Climb the leaderboard to score daily bonus stars and dominate the game!",
      image: "/play-to-win.png",
      gradientClass:
        "bg-[linear-gradient(0deg,rgba(255,191,25,1)_5.65%,rgba(255,219,127,1)_31.58%,rgba(255,247,224,1)_59.56%,rgba(255,247,224,1)_77.74%)]",
    },
    {
      title: "Invest in games",
      description:
        "Support your favorite games and earn daily ATM rewards! Get fully refunded first, then enjoy a share of daily profits as the games grow.",
      image: "/invest-in-games.png",
      gradientClass:
        "bg-[linear-gradient(0deg,rgba(13,110,255,1)_5.65%,rgba(136,191,255,1)_31.58%,rgba(213,232,255,1)_59.56%,rgba(235,244,255,1)_77.74%)]",
    },
    {
      title: "Daily star pool",
      description:
        "Claim your share of the daily Star Pool! Use ATM stars to enter special battles and win exclusive NFT costumes and items every day.",
      image: "/daily-star-pool.png",
      gradientClass:
        "bg-[linear-gradient(0deg,rgba(255,191,25,1)_5.65%,rgba(255,219,127,1)_31.58%,rgba(255,247,224,1)_59.56%,rgba(255,247,224,1)_77.74%)]",
    },
  ];

  return (
    <div className="relative w-full px-4 lg:px-0">
      {/* Section Title */}
      <div className="relative h-[99px] ml-0 lg:ml-[71px]">
        <div className="left-10 absolute w-auto lg:w-[148px] h-11 top-[27px] lg:left-[51px] font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] [font-style:var(--titles-h2-sectionheading-400-font-style)]">
          Rewards
        </div>
        <img
          className="w-[102px] h-[99px] absolute top-0 left-0"
          alt="Dots"
          src="/dots-3.svg"
        />
      </div>

      {/* Subtitle */}
      <div className="text-center text-[#4F5555] dark:text-card-foreground text-[16px] leading-[22px] lg:text-[18px] lg:leading-[24px] mt-10 md:mt-0">
        ATM users will get rewards by:
      </div>

      <div className="mt-[35px] ml-0 lg:ml-[70px] relative">
        {!is4K && (
          <div className="flex items-center gap-[15px] px-[9px] py-[5px] absolute -top-16 right-4 lg:right-[71px] rounded-[40px] overflow-hidden border border-solid border-[#eeeeee] bg-background z-10 shadow-sm">
            <Button
              variant="ghost"
              disabled={currentFeatureSlide === 0}
              className={`w-[38.53px] h-[38.53px] p-0 rounded-full transition-colors ${
                currentFeatureSlide === 0
                  ? "bg-gray-200 dark:bg-gray-700 opacity-50 cursor-not-allowed"
                  : "bg-background hover:bg-gray-50"
              }`}
              onClick={() => handleFeatureNavigation("prev")}
            >
              <img
                className="w-5 h-5"
                alt="Arrow left"
                src="/arrow-left-icon.svg"
              />
            </Button>

            <Button
              disabled={currentFeatureSlide === rewardsData.length - 1}
              className={`w-[38.53px] h-[38.53px] p-0 rounded-full transition-colors ${
                currentFeatureSlide === rewardsData.length - 1
                  ? "bg-gray-200 dark:bg-gray-700 opacity-50 cursor-not-allowed"
                  : "bg-[#e9f6f7] hover:bg-[#d8eef0]"
              }`}
              onClick={() => handleFeatureNavigation("next")}
            >
              <img
                className="w-6 h-6"
                alt="Arrow right"
                src="/arrow-right-icon-3.svg"
              />
            </Button>
          </div>
        )}

        {/* Cards */}
        <div className="w-full overflow-hidden mt-[69px]">
          <div
            className={`flex gap-[21px] transition-transform duration-500 ease-in-out ${
              is4K ? "justify-center" : ""
            }`}
            style={{
              transform: is4K
                ? "none"
                : `translateX(-${currentFeatureSlide * cardWidth}px)`,
            }}
          >
            {rewardsData.map((reward, index) => (
              <Card
                ref={index === 0 ? cardRef : null}
                key={index}
                className="w-full sm:w-[300px] xl:w-[355px] 2xl:w-[450px] h-[500px] lg:h-[605px] overflow-hidden border border-solid border-border dark:border-primary-foreground bg-card rounded-[20px] flex-shrink-0"
              >
                <CardContent className="flex flex-col h-full items-start gap-[10px] lg:gap-[20px] px-8 lg:px-[60px] py-8 lg:py-[60px] relative">
                  <div
                    className={`absolute w-[300px] lg:w-[482px] h-[300px] lg:h-[482px] top-[240px] lg:top-[281px] left-[115px] lg:left-[159px] rounded-[150px] lg:rounded-[241.22px] rotate-[-30deg] opacity-50 ${reward.gradientClass}`}
                  />

                  <div className="relative self-stretch font-titles-h3-caption-400 text-foreground dark:text-foreground text-[26px] xl:text-[30px] leading-[32px] lg:leading-[40px] min-h-[80px] flex">
                    {reward.title}
                  </div>

                  <div className="relative self-stretch w-full min-h-[120px]">
                    <div className="w-full font-body-body2-400 text-[#4f5555] dark:text-card-foreground text-[16px] lg:text-[length:var(--body-body2-400-font-size)] leading-[22px] lg:leading-[var(--body-body2-400-line-height)]">
                      {reward.description}
                    </div>
                  </div>

                  <div className="flex-1" />

                  <div className="relative w-full h-[200px] lg:h-[250px] ">
                    <img
                      className="w-full h-full object-contain"
                      alt={reward.title}
                      src={reward.image}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
