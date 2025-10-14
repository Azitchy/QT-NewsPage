import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { HeadingWithDots } from "@/components/HeadingWithDots";

export const FeaturesSection = () => {
  const { t } = useTranslation("home");
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const featuresData = [
    {
      title: t("featuresSection.features.digitalSelf.title"),
      description: t("featuresSection.features.digitalSelf.description"),
      image: "/feature-create-digital-self.png",
      gradientClass:
        "bg-[linear-gradient(0deg,rgba(126,80,255,1)_11%,rgba(194,172,255,1)_37%,rgba(235,227,255,1)_66%,rgba(241,236,255,1)_84%)]",
    },
    {
      title: t("featuresSection.features.prValue.title"),
      description: t("featuresSection.features.prValue.description"),
      image: "/feature-higher-pr-value.png",
      gradientClass:
        "bg-[linear-gradient(0deg,rgba(255,191,25,1)_11%,rgba(255,219,127,1)_37%,rgba(255,247,224,1)_66%,rgba(255,247,224,1)_84%)]",
    },
    {
      title: t("featuresSection.features.connectFriend.title"),
      description: t("featuresSection.features.connectFriend.description"),
      image: "/feature-connect-with-friend.png",
      gradientClass:
        "bg-[linear-gradient(0deg,rgba(30,181,191,1)_11%,rgba(129,214,219,1)_37%,rgba(226,246,247,1)_66%,rgba(232,248,249,1)_84%)]",
    },
    {
      title: t("featuresSection.features.aiSupport.title"),
      description: t("featuresSection.features.aiSupport.description"),
      image: "/feature-ai-powered-support.png",
      gradientClass:
        "bg-[linear-gradient(0deg,rgba(126,80,255,1)_11%,rgba(194,172,255,1)_37%,rgba(235,227,255,1)_66%,rgba(241,236,255,1)_84%)]",
    },
    {
      title: t("featuresSection.features.messaging.title"),
      description: t("featuresSection.features.messaging.description"),
      image: "/feature-decentralised-messaging.png",
      gradientClass:
        "bg-[linear-gradient(0deg,rgba(30,181,191,1)_11%,rgba(129,214,219,1)_37%,rgba(226,246,247,1)_66%,rgba(232,248,249,1)_84%)]",
    },
    {
      title: t("featuresSection.features.socialPlatform.title"),
      description: t("featuresSection.features.socialPlatform.description"),
      image: "/feature-engage-social-platform.png",
      gradientClass:
        "bg-[linear-gradient(0deg,rgba(30,181,191,1)_11%,rgba(129,214,219,1)_37%,rgba(226,246,247,1)_66%,rgba(232,248,249,1)_84%)]",
    },
  ];

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

  return (
    <div className="relative w-full px-4 lg:px-0">
      {/* Title Section */}
      <div className="relative h-[99px] ml-0 lg:ml-[71px]">
        <HeadingWithDots text={t("featuresSection.title")} />
      </div>

      {/* Navigation */}
      <div className="mt-[35px] ml-0 lg:ml-[70px] relative">
        {/* Gradient border wrapper */}
        <div className="flex items-center gap-[15px] px-[9px] py-[5px] absolute -top-16 right-4 lg:right-[71px] rounded-[40px] overflow-hidden z-10 shadow-sm">
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

        {/* Carousel */}
        <Carousel
          className="w-full"
          setApi={setApi}
          opts={{ align: "start", loop: false }}
        >
          <CarouselContent className="flex gap-[21px] mt-[69px]">
            {featuresData.map((feature, index) => (
              <CarouselItem key={index} className="basis-auto flex-shrink-0">
                <div className="relative rounded-[20px] flex-shrink-0">
                  <div className="absolute inset-0 rounded-[20px] p-[1px] bg-border dark:bg-[linear-gradient(96deg,#C6C6C6_69.03%,#2B2B2B_102.49%)]">
                    <div className="w-full h-full rounded-[20px] bg-card dark:bg-card" />
                  </div>

                  {/* Actual card content */}
                  <div className="relative w-[330px] sm:w-[300px] xl:w-[355px] 2xl:w-[450px] h-[500px] lg:h-[605px] overflow-hidden rounded-[20px] flex flex-col items-start gap-[10px] lg:gap-[20px] px-8 lg:px-[60px] py-8 lg:py-[60px]">
                    <div
                      className={`absolute w-[300px] lg:w-[482px] h-[300px] lg:h-[482px] top-[240px] lg:top-[281px] left-[115px] lg:left-[159px] rounded-[150px] lg:rounded-[241.22px] rotate-[-30deg] opacity-50 ${feature.gradientClass}`}
                    />

                    {/* Title */}
                    <div className="relative self-stretch font-space-grotesk text-foreground text-[26px] xl:text-[30px] leading-[32px] lg:leading-[40px] min-h-[80px] flex">
                      {feature.title}
                    </div>

                    {/* Description */}
                    <div className="relative self-stretch w-full min-h-[120px]">
                      <div className="w-full text-[#4f5555] dark:text-card-foreground text-[16px] lg:text-[16px] leading-[22px] lg:leading-[22px]">
                        {feature.description}
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Image */}
                    <div className="relative w-full h-[200px] lg:h-[250px] ">
                      <img
                        className="w-full h-full object-contain"
                        alt={feature.title}
                        src={feature.image}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};
