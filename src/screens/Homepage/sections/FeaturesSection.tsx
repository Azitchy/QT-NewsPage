import { useEffect, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

export const FeaturesSection = () => {
  const [currentFeatureSlide, setCurrentFeatureSlide] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (cardRef.current) {
      setCardWidth(cardRef.current.offsetWidth + 21);
    }
    const handleResize = () => {
      if (cardRef.current) {
        setCardWidth(cardRef.current.offsetWidth + 21);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFeatureNavigation = (direction: "prev" | "next") => {
    if (direction === "prev" && currentFeatureSlide > 0) {
      setCurrentFeatureSlide((prev) => prev - 1);
    }
    if (direction === "next" && currentFeatureSlide < featuresData.length - 1) {
      setCurrentFeatureSlide((prev) => prev + 1);
    }
  };

  // Features data
  const featuresData = [
    {
      title: "Create your digital-self",
      description:
        "Create and customise your AVATAR for various purposes. These avatars can be used as profile pictures, in shared links, or for interactive communication.",
      image: "/feature-create-digital-self.png",
      gradientClass:
        "bg-[linear-gradient(0deg,rgba(126,80,255,1)_11%,rgba(194,172,255,1)_37%,rgba(235,227,255,1)_66%,rgba(241,236,255,1)_84%)]",
    },
    {
      title: "Higher PR value, greater rewards",
      description:
        "ATM-Rank measures user influence based on connections and stakes. Higher PR values earn greater LUCA rewards and increased community influence.",
      image: "/feature-higher-pr-value.png",
      gradientClass:
        "bg-[linear-gradient(0deg,rgba(255,191,25,1)_11%,rgba(255,219,127,1)_37%,rgba(255,247,224,1)_66%,rgba(255,247,224,1)_84%)]",
    },
    {
      title: "Connect with a friend",
      description:
        "Create secure token agreements, earn LUCA rewards, and contribute to a stable and trusted ecosystem.",
      image: "/feature-connect-with-friend.png",
      gradientClass:
        "bg-[linear-gradient(0deg,rgba(30,181,191,1)_11%,rgba(129,214,219,1)_37%,rgba(226,246,247,1)_66%,rgba(232,248,249,1)_84%)]",
    },
    {
      title: "AI-Powered Support",
      description:
        "A-Team provides 24/7 financial advice, offering honest, data-driven insights from market analysis, risk, and research.",
      image: "/feature-ai-powered-support.png",
      gradientClass:
        "bg-[linear-gradient(0deg,rgba(126,80,255,1)_11%,rgba(194,172,255,1)_37%,rgba(235,227,255,1)_66%,rgba(241,236,255,1)_84%)]",
    },
    {
      title: "Decentralised messaging",
      description:
        "Join discussions, share insights, and connect with the ATM community through chatrooms or direct messages.",
      image: "/feature-decentralised-messaging.png",
      gradientClass:
        "bg-[linear-gradient(0deg,rgba(30,181,191,1)_11%,rgba(129,214,219,1)_37%,rgba(226,246,247,1)_66%,rgba(232,248,249,1)_84%)]",
    },
    {
      title: "Engage in social platform",
      description:
        "Share news, join discussions, and connect with the ATM community in a seamless, interactive space.",
      image: "/feature-engage-social-platform.png",
      gradientClass:
        "bg-[linear-gradient(0deg,rgba(30,181,191,1)_11%,rgba(129,214,219,1)_37%,rgba(226,246,247,1)_66%,rgba(232,248,249,1)_84%)]",
    },
  ];

  return (
    <div className="relative w-full px-4 lg:px-0">
      <div className="relative h-[99px] ml-0 lg:ml-[71px]">
        <div className="left-10 absolute w-auto lg:w-[148px] h-11 top-[27px] lg:left-[51px] font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] [font-style:var(--titles-h2-sectionheading-400-font-style)]">
          FEATURES
        </div>
        <img
          className="w-[102px] h-[99px] absolute top-0 left-0"
          alt="Dots"
          src="/dots-3.svg"
        />
      </div>

      <div className="mt-[35px] ml-0 lg:ml-[70px] relative">
        <div className="flex items-center gap-[15px] px-[9px] py-[5px] absolute -top-16 right-4 lg:right-[71px] rounded-[40px] overflow-hidden border border-solid border-[#eeeeee] bg-white dark:bg-[#090920] z-10 shadow-sm">
          {/* Prev Button */}
          <Button
            variant="ghost"
            disabled={currentFeatureSlide === 0}
            className={`w-[38.53px] h-[38.53px] p-0 rounded-full transition-colors ${
              currentFeatureSlide === 0
                ? "bg-gray-200 dark:bg-gray-700 opacity-50 cursor-not-allowed"
                : "bg-white dark:bg-[#1a1a2e] hover:bg-gray-50"
            }`}
            onClick={() => handleFeatureNavigation("prev")}
          >
            <img
              className="w-5 h-5"
              alt="Arrow left icon"
              src="/arrow-left-icon.svg"
            />
          </Button>

          {/* Next Button */}
          <Button
            disabled={currentFeatureSlide === featuresData.length - 1}
            className={`w-[38.53px] h-[38.53px] p-0 rounded-full transition-colors ${
              currentFeatureSlide === featuresData.length - 1
                ? "bg-gray-200 dark:bg-gray-700 opacity-50 cursor-not-allowed"
                : "bg-[#e9f6f7] hover:bg-[#d8eef0]"
            }`}
            onClick={() => handleFeatureNavigation("next")}
          >
            <img
              className="w-6 h-6"
              alt="Arrow right icon"
              src="/arrow-right-icon-3.svg"
            />
          </Button>
        </div>

        <div className="w-full overflow-hidden mt-[69px]">
          <div
            className="flex gap-[21px] transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentFeatureSlide * cardWidth}px)`,
            }}
          >
            {featuresData.map((feature, index) => (
              <Card
                ref={index === 0 ? cardRef : null}
                key={index}
                className="w-full sm:w-[300px] xl:w-[355px] 2xl:w-[450px] h-[500px] lg:h-[605px] overflow-hidden border border-solid border-[#eeeeee] bg-[#fbfbfb] dark:bg-[#2B2F3E] rounded-[20px] flex-shrink-0"
              >
                <CardContent className="flex flex-col h-full items-start gap-[10px] lg:gap-[20px] px-8 lg:px-[60px] py-8 lg:py-[60px] relative">
                  <div
                    className={`absolute w-[300px] lg:w-[482px] h-[300px] lg:h-[482px] top-[240px] lg:top-[281px] left-[115px] lg:left-[159px] rounded-[150px] lg:rounded-[241.22px] rotate-[-30deg] opacity-50 ${feature.gradientClass}`}
                  />

                  <div className="relative self-stretch font-titles-h3-caption-400 font-[number:var(--titles-h3-caption-400-font-weight)] text-[#1c1c1c] dark:text-[#DCDCDC] text-[26px] xl:text-[30px] leading-[32px] lg:leading-[40px] [font-style:var(--titles-h3-caption-400-font-style)] min-h-[80px] flex">
                    {feature.title}
                  </div>

                  <div className="relative self-stretch w-full min-h-[120px]">
                    <div className="w-full font-body-body2-400 font-normal text-[#4f5555] dark:text-[#999F9F] text-[16px] lg:text-[length:var(--body-body2-400-font-size)] leading-[22px] lg:leading-[var(--body-body2-400-line-height)] [font-style:var(--body-body2-400-font-style)]">
                      {feature.description}
                    </div>
                  </div>

                  <div className="flex-1" />

                  <div className="relative w-full h-[200px] lg:h-[250px] ">
                    <img
                      className="w-full h-full object-contain"
                      alt={feature.title}
                      src={feature.image}
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
