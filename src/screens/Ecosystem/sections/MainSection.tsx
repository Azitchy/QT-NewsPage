import React from "react";
import { Button } from "../../../components/ui/button";
import { VideoPlayer } from "./VideoPlayer";

export const MainSection = () => {
  const sections = [
    {
      id: "agf",
      title: "agf",
      badge: {
        icon: "/game-launcher.svg",
        text: "Gaming",
        bgColor: "bg-[#effffa]",
        textColor: "text-[#01cc90]",
        borderColor: "border-[#01cc90]",
      },
      paragraphs: [
        "Discover the ATM Gaming Fund, where community support powers innovation, with backing from our trusted VC partners, ready to spark a new era of gaming. The ATM community holds the power to vote which games come to life through their pledges. Players can earn ATM Stars and level up their gaming journey, unlocking LUCA rewards along the way.",
        "Meanwhile, developers set their funding goals and deadlines, with the chance to bring their ideas to life. By joining in, developers have the opportunity to reach a passionate player base and make their visions real.",
      ],
      buttons: [
        {
          text: "Submit a project",
          primary: true,
          href: "#",
        },
        {
          text: "Learn about funding",
          primary: false,
          href: "#",
        },
      ],
      mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      id: "ecology",
      title: "ecology",
      badge: {
        icon: "/plant.svg",
        text: "Environment",
        bgColor: "bg-[#f0fcf7]",
        textColor: "text-[#119b56]",
        borderColor: "border-[#119b56]",
      },
      content:
        "ATM proudly announces our partnership with <span class='text-[#2ea8af] underline'>Ecologi</span>, a globally recognised B Corp-certified platform dedicated to accelerating climate action. Together, we are working towards a carbon-free future by actively engaging in reforestation efforts. As part of this collaboration, ATM has pledged to plant 100 trees. This commitment underscores our dedication to reducing our carbon footprint and fostering a greener planet for future generations. By connecting to Ecologi wallet through ATM, you're not only ensuring smooth and secure transactions but also actively participating in ecosystem restoration.",
      walletInfo: {
        label: "Ecologi Wallet:",
        address: "0xb6c8...0031B9",
      },
      mediaUrl: "/ecosystem.png",
    },
    {
      id: "luca-travel",
      title: "luca.travel",
      badge: {
        icon: "/travel-holidays.svg",
        text: "Travel",
        bgColor: "bg-[#f1fdff]",
        textColor: "text-[#6bb0d0]",
        borderColor: "border-[#6bb0d0]",
      },
      paragraphs: [
        "We're revolutionising travel experiences. Through strategic partnerships with top travel agencies, we open doors to a world of possibilities. Seamlessly integrated into everyday transactions, LUCA simplifies global exploration, offering unparalleled convenience and flexibility.",
        "As LUCA becomes woven into daily life through strategic alliances, it's not just about travel—it's about enhancing every moment. Whether booking flights, hotels, or activities, LUCA is the go-to currency. Join us in embracing a future where convenience and flexibility redefine travel.",
      ],
      buttons: [
        {
          text: "Learn about travel",
          primary: false,
          href: "#",
        },
      ],
      mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
  ];
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
                    className="font-normal text-[#1c1c1c] text-[16px] lg:text-[17px]  [font-family:'Inter',Helvetica] leading-[22px] lg:leading-6 text-left"
                  >
                    {paragraph}
                  </p>
                ))}

                <div className="flex items-start gap-5">
                  {section.buttons?.map((button, index) =>
                    button.primary ? (
                      <Button
                        key={index}
                        className="bg-[#2ea8af] text-[#FFFFFF] rounded-[30px] px-5 py-3 font-normal text-[14px] lg:text-[16px] leading-6 hover:bg-[#2ea8af]/90"
                      >
                        <a href={button.href}>{button.text}</a>
                      </Button>
                    ) : (
                      <div
                        key={index}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <span className="font-body-body-4-400 text-primary-colour text-[12px] md:text-[14px] tracking-[var(--body-body-4-400-letter-spacing)] leading-[var(--body-body-4-400-line-height)]">
                          {button.text}
                        </span>
                        <a href={button.href}>
                          <div className="w-[38px] h-[38px] relative">
                            <img
                              className="absolute w-[33px] h-[33px] top-[3px] left-0.5 hover:bg-gray-100 rounded-full hover:-rotate-12 transition-transform"
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
                  className="font-normal text-[#1c1c1c] [font-family:'Inter',Helvetica] text-[14px] lg:text-[16px] tracking-[var(--body-body2-400-letter-spacing)] leading-[22px] lg:leading-6 text-left"
                  dangerouslySetInnerHTML={{ __html: section.content ?? "" }}
                />

                <div className="flex items-center gap-2">
                  <div className="[font-family:'Inter',Helvetica] text-[#1c1c1c]  text-[14px] lg:text-[16px]">
                    <span className="font-medium leading-[22px] lg:leading-6">
                      {section.walletInfo?.label}{" "}
                    </span>
                    <span className="font-normal  text-[14px] lg:text-[16px] tracking-[var(--body-body3-400-letter-spacing)] leading-[22px] lg:leading-6">
                      {section.walletInfo?.address}
                    </span>
                  </div>
                  <img
                    className="w-4 h-4"
                    alt="Copy icon"
                    src="/copy-icon.png"
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
        </div>
      ))}
    </div>
  );
};
