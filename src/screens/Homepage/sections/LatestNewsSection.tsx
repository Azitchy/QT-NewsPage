import React from "react";
import { Card } from "../../../components/ui/card";

export const LatestNewsSection = () => {
  const newsData = [
    {
      title:
        "ATM Network Rings in 2024 with Achievements and Bold Plans for 2025",
      date: "10/01/2025",
      image: "/news-atm-network-2024.png",
    },
    {
      title: "ATM Connect is now available on iOS mobile devices!",
      date: "10/01/2025",
      image: "/news-atm-connect-ios.png",
    },
    {
      title: "Unravelling the AGF Magic",
      date: "10/01/2025",
      image: "/news-agf-magic.png",
    },
  ];

  return (
    <div className="relative w-full px-4 lg:px-0">
      <div className="relative h-[100px] ml-0 lg:ml-[71px]">
        <div className="left-10 absolute top-[25px] lg:left-[49px] font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] whitespace-nowrap [font-style:var(--titles-h2-sectionheading-400-font-style)]">
          LATEST NEWS
        </div>
        <img
          className="w-[99px] h-[100px] absolute top-0 left-0"
          alt="Dots"
          src="/dots-2.svg"
        />
      </div>

      <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-6 mt-[10px] lg:mt-[40px] mx-auto max-w-7xl lg:px-4">
        <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-[15px] lg:gap-6 mt-[40px] mx-auto max-w-7xl lg:px-4">
          {newsData.map((news, index) => (
            <Card
              key={`news-${index}`}
              className="w-full md:w-[calc(33.333%-16px)] flex flex-col border border-solid border-border dark:border-primary-foreground rounded-[20px] hover:shadow-md transition-shadow h-full"
            >
              {/* Image Section */}
              <div className="flex flex-col items-start gap-2.5 p-[15px] w-full bg-card dark:bg-card rounded-t-[20px] md:min-h-[150px] lg:min-h-[200px]">
                <img
                  className="w-full h-full object-cover rounded-lg"
                  alt={news.title}
                  src={news.image}
                />
              </div>

              {/* Title Section (flex-grow so it expands) */}
              <div className="flex flex-col items-start gap-2.5 pt-0 lg:pb-5 px-[20px] sm:px-[25px] lg:px-[30px] w-full bg-card dark:bg-card flex-grow">
                <h3 className="w-full font-normal text-foreground font-inter dark:text-foreground text-[26px] md:text-[14px] lg:text-[26px] lg:leading-8">
                  {news.title}
                </h3>
              </div>

              {/* Footer Section (always at bottom) */}
              <div className="mt-auto flex items-center justify-between px-[20px] sm:px-[20px] lg:px-[30px] py-[15px] bg-card dark:bg-card rounded-b-[20px]">
                <span className="md:text-[12px] lg:text-[16px] font-light text-[#4f5555] dark:text-foreground">
                  {news.date}
                </span>

                <a
                  href="#"
                  className="flex items-center gap-2 cursor-pointer text-primary font-light md:text-[12px] lg:text-[16px]"
                >
                  <span>Read news</span>
                  <img
                    className="w-[30px] h-[30px] md:w-[20px] md:h-[20px] lg:w-[30px] lg:h-[30px] hover:bg-gray-100 rounded-full hover:-rotate-12 transition-transform"
                    alt="Arrow right icon"
                    src="/arrow-right-icon.svg"
                  />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
