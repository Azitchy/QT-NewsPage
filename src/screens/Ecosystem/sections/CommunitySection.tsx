import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import NumberedDisplay from "@/components/NumberedDisplay";
import { HeadingWithDots } from "@/components/HeadingWithDots";

export const CommunitySection = () => {
  const { t } = useTranslation('ecosystem');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rewardModes = [
    {
      id: 1,
      number: "1",
      description: t("communitySection.rewardModes.mode1"),
    },
    {
      id: 2,
      number: "2",
      description: t("communitySection.rewardModes.mode2"),
    },
    {
      id: 3,
      number: "3",
      description: t("communitySection.rewardModes.mode3"),
    },
  ];

  return (
    <div className="flex flex-col gap-10 lg:gap-16 w-full">
      {/* Community Intro Section */}
      <div className="w-full">
        <div className="flex flex-col md:flex-row gap-[20px] lg:gap-[70px] 2xl:gap-[200px] md:mt-[60px] items-start mb-12">
          <div className="flex flex-col">
            <div className="relative ml-0 lg:ml-[30px]">
               <HeadingWithDots text={t("communitySection.title")} />
            </div>
            <div className="flex-1 md:max-w-[519px] lg:max-w-[750px] 2xl:max-w-[955px] font-inter text-foreground text-[16px] lg:text-xl leading-[24px] lg:leading-[27px] mt-14 lg:ml-20 2xl:ml-[300px] text-left">
              <span className="font-light">
                {t("communitySection.description")}{" "}
              </span>
                <span className="font-inter font-medium">
                {t("communitySection.descriptionHighlight")}
              </span>
              <span className="font-light">
                {t("communitySection.descriptionEnd")}
              </span>
            </div>
          </div>
          <div className="w-[360px] h-[182px] md:w-[287px] md:h-[270px] 2xl:w-[400px] 2xl:h-[295px] bg-[url(token-img.png)] bg-cover bg-center rounded-lg"></div>
        </div>
      </div>

      {/* How to Join Section */}
      <div className="flex flex-col w-full items-start gap-5 max-w-[782px] 2xl:max-w-[955px] lg:mx-60 2xl:mx-96">
        <h3 className="font-inter text-foreground dark:text-foreground text-[20px] lg:text-[26px] tracking-[0px] leading-[27px] lg:leading-[34px] text-left">
          {t("communitySection.howToJoin.title")}
        </h3>
        <p className="font-inter text-foreground dark:text-foreground text-[16px] lg:text-[18px] tracking-[0px] leading-[22px] lg:leading-[24px] text-left">
          {t("communitySection.howToJoin.description")}
        </p>
      </div>

      {/* Reward Modes Section */}
      <div className="flex flex-col items-center gap-[5px] mb-12">
       <h3 className="font-inter text-foreground dark:text-foreground text-[20px] lg:text-[26px] tracking-[0px] leading-[27px] lg:leading-[34px] text-center">
          {t("communitySection.rewardModes.title")}
        </h3>
        <p className="font-inter text-[#4f5555] text-[12px] tracking-[0px] leading-[17px] text-center">
          {t("communitySection.rewardModes.subtitle")}
        </p>

        <NumberedDisplay
          items={rewardModes}
          className="mt-6"
        />

        {/* Buttons */}
        <div className="flex items-start gap-5 mt-6">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-background dark:text-primary-foreground rounded-[30px] px-[12px] lg:px-[20px] py-3 font-body-body3-400 text-[16px] leading-[24px] hover:bg-primary/90"
          >
            {t("communitySection.rewardModes.buttons.join")}
          </Button>

          <div className="flex items-center gap-[10px] cursor-pointer">
            <a href="/community#rewards">
             <span className="font-inter text-primary text-[14px] lg:text-[16px] tracking-[0px] leading-[19px] lg:leading-[24px]">
                {t("communitySection.rewardModes.buttons.learn")}
              </span>
            </a>
            <a href="/community#rewards">
              <div className="w-[38px] h-[38px] relative">
                <img
                  className="absolute w-[33px] h-[33px] top-[3px] left-0.5 rounded-full cursor-pointer hover:bg-primary-foreground transition-all duration-700 ease-in-out hover:scale-110 hover:rotate-[-12deg]"
                  alt="Arrow right icon"
                  src="/arrow-right-icon.svg"
                  loading="lazy"
                />
              </div>
            </a>
          </div>
        </div>
      </div>

      {/*  Modal  */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-background dark:bg-white rounded-xl shadow-lg max-w-xl w-full relative p-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-primary"
            >
              ✕
            </button>

            <h2 className="text-lg mb-4 text-[#1c1c1c]">
              {t("communitySection.modal.title")}
            </h2>
            <p className="text-[22px] leading-relaxed mb-3 text-center text-[#1c1c1c] font-medium">
              {t("communitySection.modal.paragraph1")}
            </p>
            <p className="text-[22px] leading-relaxed mb-3 text-center text-[#1c1c1c] font-medium">
              {t("communitySection.modal.paragraph2")}
            </p>
            <p className="text-[22px] leading-relaxed mb-4 text-center text-[#1c1c1c] font-medium">
              {t("communitySection.modal.paragraph3")}
            </p>

            <div className="flex justify-center mt-6">
              <div
                onClick={() => setIsModalOpen(false)}
                className="text-primary rounded-full px-6 py-2 cursor-pointer"
              >
                {t("communitySection.modal.understood")}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
