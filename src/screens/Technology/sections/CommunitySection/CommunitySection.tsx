import { HeadingWithDots } from "@/components/HeadingWithDots";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";

export const CommunitySection = (): JSX.Element => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const consensusItems = [
    {
      title: "Locked Token",
      description:
        "Gain easy access to a large international market of property investors, including landlords and developers, with just a few simple steps",
      icon: "/lock-svgrepo-com-1.png",
    },
    {
      title: "Investment amount",
      description:
        "The value that both parties agree upon - It does not have to be equal for both users",
      icon: "/investment-amount-icon-1.png",
    },
    {
      title: "Lock-up time",
      description:
        "The length of time for which the investment amount will be locked",
      icon: "/lock-up-time-1.png",
    },
    {
      title: "Contract cancellation",
      description:
        "During the lock-up time, either user cannot cancel the contract on their own. They must wait until the end of the contract or reach agreement with one another to terminate it early. Upon expiration, the contract will remain valid if neither party has decided to cancel",
      icon: "/contract-cancellation-1.png",
    },
  ];

  return (
    <div className="flex flex-col justify-center mx-auto gap-[40px] desktop:gap-[80px] pt-[60px] desktop:pt-[100px]">
      {/* First section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex flex-col max-w-[784px] gap-5 flex-1">
          <HeadingWithDots text="community" />

          <h2 className="text-[20px] leading-[27px] font-normal desktop:text-[26px] desktop:leading-[34px]">
            What on earth is a consensus connection?
          </h2>
          <p className="text-[16px] leading-[22px] font-light desktop:text-[18px] desktop:leading-[24px] desktop:font-normal">
            ATM provides a smart contract known as a Consensus Contract, which
            allows users to connect with each other on the multiple public
            blockchains that support smart contracts
          </p>
        </div>

        <div className="flex items-center justify-center flex-shrink-0 w-[286px] desktop:w-[515px] mx-auto">
          <img
            src="../consensus-img.png"
            alt="Consensus"
            className="object-contain"
          />
        </div>
      </div>

      {/* How to create consensus connection */}
      <div className="max-w-[874px] mx-auto">
        <div className="flex flex-col gap-5 mb-8">
          <h2 className="text-[20px] leading-[27px] font-normal desktop:text-[26px] desktop:leading-[34px]">
            How to create consensus connection
          </h2>
          <p className="text-[16px] leading-[22px] font-light desktop:text-[18px] desktop:leading-[24px] desktop:font-normal">
            User A sets up a consensus contract which initiates a request to
            establish a connection to user B. If B agrees, the contract will be
            executed, and the consensus connection will be successful.
          </p>
        </div>

        <Card className="flex flex-col items-start gap-[25px] border-none shadow-none bg-transparent text-foreground">
          <CardContent className="p-0 w-full">
            {consensusItems.map((item, index) => (
              <React.Fragment key={index}>
                <div
                  className="w-full py-4 cursor-pointer transition-all duration-500  rounded-lg"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex flex-col desktop:flex-row desktop:items-center desktop:justify-between w-full gap-[15px]">
                    {/* Title + Description */}
                    <div
                      className={`flex flex-col items-start flex-1 pr-[20px] ${
                        hoveredIndex === null
                          ? index === 0
                            ? "gap-[15px]"
                            : "gap-0"
                          : hoveredIndex === index
                          ? "gap-[15px]"
                          : "gap-0"
                      }`}
                    >
                      <h3 className="text-[20px] leading-[27px] font-normal desktop:text-[26px] desktop:leading-[34px] text-left">
                        {item.title}
                      </h3>
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          hoveredIndex === null
                            ? index === 0
                              ? "max-h-96 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-2"
                            : hoveredIndex === index
                            ? "max-h-96 opacity-100 translate-y-0"
                            : "max-h-0 opacity-0 -translate-y-2"
                        }`}
                      >
                        {item.description && (
                          <p className="text-[16px] leading-[22px] font-light desktop:text-[18px] desktop:leading-[24px] desktop:font-normal mb-[15px] text-left">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 flex justify-center desktop:justify-end transition-all duration-500 ease-in-out ${
                        hoveredIndex === null
                          ? index === 0
                            ? "opacity-100 translate-x-0 scale-100 max-h-[80px] mt-2"
                            : "opacity-0 translate-x-4 scale-95 max-h-0 overflow-hidden mt-0"
                          : hoveredIndex === index
                          ? "opacity-100 translate-x-0 scale-100 max-h-[80px] mt-2"
                          : "opacity-0 translate-x-4 scale-95 max-h-0 overflow-hidden mt-0"
                      }`}
                    >
                      {item.icon && (
                        <div className="w-[74px] h-[73px] mx-auto desktop:mx-0">
                          <img
                            className="w-[70px] h-[70px] object-contain transition-transform duration-300 hover:scale-105"
                            alt="Lock icon"
                            src={item.icon}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {index < consensusItems.length - 1 && (
                  <Separator className="w-full h-px bg-card-foreground" />
                )}
              </React.Fragment>
            ))}
          </CardContent>
        </Card>

        <Button variant="ghost" className="gap-2.5 p-0 rounded-[30px]">
          <span className="text-primary text-[14px] leading-[20px] font-normal whitespace-nowrap">
            View my connections
          </span>
          <div className="w-[38.53px] h-[38.53px]">
            <img
              className="w-[33px] h-[33px] object-contain"
              alt="Arrow right icon"
              src="/arrow-right-icon.svg"
            />
          </div>
        </Button>
      </div>

      {/* Consensus connection income */}
      <div className="flex flex-col md:flex-row md:justify-center gap-8 items-center">
        {/* Text first on mobile, image second */}
        <div className="flex flex-col max-w-[783px] gap-5 order-1 md:order-2 flex-1">
          <h2 className="text-[20px] leading-[27px] font-normal desktop:text-[26px] desktop:leading-[34px]">
            Consensus connection income
          </h2>
          <p className="text-[16px] leading-[22px] font-light desktop:text-[18px] desktop:leading-[24px] desktop:font-normal">
            Through consensus connection, users can receive rewards according to
            their PR value. The LUCA held on each public chain will be sent to a
            public deposit smart contract where users can withdraw at any time.
          </p>
          <p className="text-[16px] leading-[22px] font-light desktop:text-[18px] desktop:leading-[24px] desktop:font-normal">
            To do so the user initiates an application, the contract initiates a
            request to the ATMRank computing group interface, and the PR server
            cluster calculates the value of rewards to be received and writes it
            into the contract. After the record is written, the user initiates a
            request to withdraw revenue, and the contract waits for confirmation
            from more than half of the PR server nodes. It then evaluates whether
            there is enough balance and processes the user's application for
            withdrawal.
          </p>
          <Button
            variant="ghost"
            className="inline-flex items-center gap-2.5 p-0 rounded-[30px] self-start"
          >
            <span className="text-primary text-[14px] leading-[20px] font-normal whitespace-nowrap">
              View my income
            </span>
            <div className="w-[38.53px] h-[38.53px]">
              <img
                className="w-[33px] h-[33px] object-contain"
                alt="Arrow right icon"
                src="/arrow-right-icon.svg"
              />
            </div>
          </Button>
        </div>

        {/* Image second on mobile, first on desktop */}
        <div className="flex items-center justify-center flex-shrink-0 max-w-[246px] order-2 md:order-1">
          <img
            src="../connection-img.png"
            alt="Connection"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};
