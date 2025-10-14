import * as React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { VideoPlayer } from "./VideoPlayer";
import { motion } from "framer-motion";

export const MainSection = () => {
  const { t } = useTranslation('ecosystem');

  const sections = [
    {
      id: "agf",
      title: t('mainSection.agf.title'),
      badge: {
        icon: "/game-launcher.svg",
        text: t('mainSection.agf.badge'),
        bgColor: "bg-[#effffa]",
        textColor: "text-[#01cc90]",
        borderColor: "border-[#01cc90]",
      },
      paragraphs: [
        t('mainSection.agf.paragraph1'),
        t('mainSection.agf.paragraph2'),
      ],
      buttons: [
        {
          text: t('mainSection.agf.buttons.submit'),
          primary: true,
          href: "/webapp",
        },
        {
          text: t('mainSection.agf.buttons.learn'),
          primary: false,
          href: "/games",
        },
      ],
      mediaUrl: "/ecosystem/agf-video-promotion-british.mp4",
    },
    {
      id: "ecology",
      title: t('mainSection.ecology.title'),
      badge: {
        icon: "/plant.svg",
        text: t('mainSection.ecology.badge'),
        bgColor: "bg-[#f0fcf7]",
        textColor: "text-[#119b56]",
        borderColor: "border-[#119b56]",
      },
      content: t('mainSection.ecology.content'),
      walletInfo: {
        label: t('mainSection.ecology.walletLabel'),
        address: "0xb6c83fA7Bb9B5C23e96130CDEFD70977460031B9",
      },
      mediaUrl: "/ecosystem.png",
    },
    {
      id: "luca-travel",
      title: t('mainSection.travel.title'),
      badge: {
        icon: "/travel-holidays.svg",
        text: t('mainSection.travel.badge'),
        bgColor: "bg-[#f1fdff]",
        textColor: "text-[#6bb0d0]",
        borderColor: "border-[#6bb0d0]",
      },
      paragraphs: [
        t('mainSection.travel.paragraph1'),
        t('mainSection.travel.paragraph2'),
      ],
      buttons: [
        {
          text: t('mainSection.travel.buttons.learn'),
          primary: false,
          href: "/ecosystem/travel",
        },
      ],
      mediaUrl: "/ecosystem/travel-promo-video2.mp4",
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied!");
    });
  };

  const hideAddress = (address: string) => {
    return address
      ? `${address.substring(0, 5)}...${address.substring(address.length - 5)}`
      : "";
  };

  const slideInVariants = {
    hidden: { opacity: 0, y: 200 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col  gap-[60px] lg:gap-[80px]">
      {sections.map((section) => (
        <div key={section.id} className="w-full">
          <div className="flex items-start mb-12">
            <div className="relative ml-0 lg:ml-[30px]">
              <div className="font-titles-h2-sectionheading-400 text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] ml-12 mt-7 uppercase">
                {section.title}
              </div>
              <img
                className="absolute w-[99px] h-[99px] top-0 left-0"
                alt="Dots"
                src="/dots.svg"
              />
            </div>
          </div>

          <motion.section
            id={section.id}
            className="pt-[60px] xl:pt-[100px]"
            variants={slideInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div
              className={`flex ${
                section.id === "ecology" ? "flex-col" : "flex-col-reverse"
              } lg:flex-row items-stretch gap-12 w-full px-2 max-w-[1400px] mx-auto lg:pl-20`}
            >
              {section.id !== "ecology" && (
                <div className="flex flex-col items-start gap-[20px] flex-1 lg:max-w-[700px] ">
                  <div
                    className={`${section.badge.bgColor} ${section.badge.textColor} border ${section.badge.borderColor} shadow rounded-[30px] px-[10px] py-[5px] flex items-center gap-2`}
                  >
                    <img
                      className="w-[18px] h-[18px]"
                      alt={section.badge.text}
                      src={section.badge.icon}
                    />
                    <span className="font-normal text-[12px] tracking-[var(--body-labeltext-400-letter-spacing)] [font-family:'Inter',Helvetica] leading-[var(--body-labeltext-400-line-height)]">
                      {section.badge.text}
                    </span>
                  </div>

                  {section.paragraphs?.map((paragraph, index) => (
                    <p
                      key={index}
                      className="font-normal text-foreground text-[16px] lg:text-[17px] font-inter leading-[22px] lg:leading-6 text-left"
                    >
                      {paragraph}
                    </p>
                  ))}

                  <div className="flex items-start gap-5">
                    {section.buttons?.map((button, index) =>
                      button.primary ? (
                        <Button
                          key={index}
                          className="bg-primary text-background dark:text-foreground rounded-[30px] px-5 py-3 font-normal text-[14px] lg:text-[16px] leading-6 hover:bg-primary/90"
                        >
                          <a href={button.href}>{button.text}</a>
                        </Button>
                      ) : (
                        <div
                          key={index}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <a href={button.href}>
                            <span className="font-body-body-4-400 text-primary-colour text-[12px] md:text-[14px] tracking-[var(--body-body-4-400-letter-spacing)] leading-[var(--body-body-4-400-line-height)]">
                              {button.text}
                            </span>
                          </a>
                          <a href={button.href}>
                            <div className="w-[38px] h-[38px] relative">
                              <img
                                className="absolute w-[33px] h-[33px] top-[3px] left-0.5 hover:bg-primary-foreground rounded-full transition-all duration-700 ease-in-out hover:scale-110 hover:rotate-[-12deg]"
                                alt="Arrow right icon"
                                src="/arrow-right-icon.svg"
                              />
                            </div>
                          </a>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {section.id === "ecology" && (
                <div className="flex-1 overflow-hidden">
                  <img
                    src={section.mediaUrl}
                    alt="ecology"
                    className="w-full h-[300px] lg:h-[350px] 2xl:h-full rounded-[20px] object-cover"
                  />
                </div>
              )}

              {section.id === "ecology" && (
                <div className="flex flex-col items-start gap-[20px] flex-1 lg:max-w-[700px]">
                  <div
                    className={`${section.badge.bgColor} ${section.badge.textColor} border ${section.badge.borderColor} rounded-[30px] px-3 py-2 shadow flex items-center gap-2`}
                  >
                    <img
                      className="w-[18px] h-[18px]"
                      alt={section.badge.text}
                      src={section.badge.icon}
                    />
                    <span className="font-body-labeltext-400 text-[length:var(--body-labeltext-400-font-size)] tracking-[var(--body-labeltext-400-letter-spacing)] leading-[var(--body-labeltext-400-line-height)]">
                      {section.badge.text}
                    </span>
                  </div>

                  <div
                    className="font-normal text-foreground dark:text-foreground font-inter text-[14px] lg:text-[16px] tracking-[var(--body-body2-400-letter-spacing)] leading-[22px] lg:leading-6 text-left"
                    dangerouslySetInnerHTML={{ __html: section.content ?? "" }}
                  />

                  <div className="flex items-center gap-2">
                    <div className="font-inter text-foreground dark:text-foreground text-[14px] lg:text-[16px]">
                      <span className="font-medium leading-[22px] lg:leading-6">
                        {section.walletInfo?.label}{" "}
                      </span>
                      <span className="font-normal text-[14px] lg:text-[16px] tracking-[var(--body-body3-400-letter-spacing)] leading-[22px] lg:leading-6">
                        {hideAddress(section.walletInfo?.address as string)}
                      </span>
                    </div>
                    <img
                      className="w-4 h-4 cursor-pointer"
                      alt="Copy icon"
                      src="/copy-icon.png"
                      onClick={() =>
                        copyToClipboard(section.walletInfo?.address as string)
                      }
                    />
                  </div>
                </div>
              )}

              {section.id !== "ecology" && (
                <div className="flex-1 w-full">
                  <VideoPlayer src={section.mediaUrl} />
                </div>
              )}
            </div>
          </motion.section>
        </div>
      ))}
    </div>
  );
};