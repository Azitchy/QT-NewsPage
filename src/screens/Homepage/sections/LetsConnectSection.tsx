import React, { useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Textarea } from "../../../components/ui/textarea";

export const LetsConnectSection = () => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    walletAddress: "",
    email: "",
    message: "",
  });
  const [emailSubscription, setEmailSubscription] = useState("");
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsFormSubmitted(true);
    setTimeout(() => setIsFormSubmitted(false), 3000);
  };

  // Handle email subscription
  const handleEmailSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email subscription:", emailSubscription);
    setEmailSubscription("");
    alert("Thank you for subscribing!");
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <div className="relative w-full px-4 lg:px-0 mb-20">
      <div className="flex flex-col w-full lg:w-[232px] items-start lg:items-end lg:absolute lg:top-[60px] lg:left-0  lg:mb-0">
        <div className="relative w-full lg:w-[225px] h-[99px]">
          <div className="relative w-full lg:w-[232px] h-[99px] lg:ml-[71px]">
            <div className="left-10 absolute top-[26px] lg:left-[49px] font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] whitespace-nowrap [font-style:var(--titles-h2-sectionheading-400-font-style)]">
              LET'S CONNECT
            </div>
            <img className="w-[99px] h-[99px]" alt="Dots" src="/dots.svg" />
          </div>
        </div>
        <img className="block w-px ml-28" alt="Line" src="/line.svg" />
      </div>
      <div className="flex flex-col lg:absolute top-64 left-24 z-20">
        <div className="flex gap-20 ">
          <a
            href="https://x.com/ATMrank"
            target="_blank"
            rel="noopener noreferrer"
            title="Visit X"
          >
            <img
              alt="X"
              src="/x.png"
              className="cursor-pointer w-[70px] h-[70px] md:w-[90px] md:h-[90px]"
            />
          </a>
          <a
            href="https://discord.com/invite/bwAtDM7Mp2"
            target="_blank"
            rel="noopener noreferrer"
            title="Visit discord"
          >
            <img
              alt="Discord"
              src="/discord.png"
              className="cursor-pointer  w-[70px] h-[70px] md:w-[90px] md:h-[90px]"
            />
          </a>
        </div>
        <div className="flex gap-20 ml-20">
          <a
            href="https://t.me/atm_luca"
            target="_blank"
            rel="noopener noreferrer"
            title="Visit telegram"
          >
            <img
              alt="Telegram"
              src="/telegram.png"
              className="cursor-pointer  w-[70px] h-[70px] md:w-[90px] md:h-[90px]"
            />
          </a>
          <a
            href="https://www.reddit.com/r/atmrank/"
            target="_blank"
            rel="noopener noreferrer"
            title="Visit reddit"
          >
            <img
              alt="Reddit"
              src="/reddit.png"
              className="cursor-pointer  w-[70px] h-[70px] md:w-[90px] md:h-[90px]"
            />
          </a>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row w-full items-end justify-between px-0 lg:px-[71px] gap-8 lg:gap-10">
        <div className="relative w-full lg:w-[577px]">
          <div className="relative w-full lg:w-[621px] h-auto lg:h-[648px] lg:top-[-60px] lg:-left-2">
            <img
              className="absolute bottom-36 md:-bottom-12 lg:bottom-0  lg::block w-full md:w-[494px] lg:w-[614px] h-auto lg:h-[608px] "
              alt="Connect background"
              src="/bg.svg"
            />

            <div className="inline-flex flex-col items-start gap-[15px] relative lg:absolute lg:top-[560px] lg:left-2 mt-8 mb-[30px] md:mb-0">
              <div className="relative w-full lg:w-[587px] mt-[-1.00px] font-body-body2-400 font-[number:var(--body-body2-400-font-weight)] text-foreground dark:text-foreground text-[16px] lg:text-[length:var(--body-body2-400-font-size)] tracking-[var(--body-body2-400-letter-spacing)] leading-[22px] lg:leading-[var(--body-body2-400-line-height)] [font-style:var(--body-body2-400-font-style)]">
                Subscribe ATM to receive the latest events and community updates
              </div>

              <div className="inline-flex flex-row items-stretch sm:items-center gap-2.5 w-full">
                <Input
                  className="w-[200px] sm:flex-1 lg:w-[378.62px] h-[43px] px-[20px] py-2.5 bg-background dark:bg-background rounded-[10px] border border-solid border-border dark:border-primary-foreground overflow-hidden text-ellipsis"
                  placeholder="Please enter your email*"
                  type="email"
                  value={emailSubscription}
                  onChange={(e) => setEmailSubscription(e.target.value)}
                />

                <Button
                  className="bg-[#e0f7fa] text-primary text-[14px] lg:text-[16px] font-medium md:font-light rounded-[30px] px-[15px] py-[12px] lg:px-5 lg:py-5 w-full sm:w-auto"
                  onClick={handleEmailSubscription}
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[780px] h-auto lg:h-[468px] gap-[15px] lg:mb-14 large:mr-[300px] flex flex-col items-start order-1 lg:order-2  lg:px-0">
          <div className="relative self-stretch mt-[-1.00px] font-body-body2-400 font-[number:var(--body-body2-400-font-weight)] text-foreground dark:text-foreground text-[16px] lg:text-[length:var(--body-body2-400-font-size)] tracking-[var(--body-body2-400-letter-spacing)] leading-[22px] lg:leading-[var(--body-body2-400-line-height)] [font-style:var(--body-body2-400-font-style)]">
            Got any question? Simply fill-in the contact form. We would like to
            hear from you!
          </div>

          <Card className="h-auto lg:h-[429px] w-full bg-card dark:bg-card rounded-[20px] border border-solid border-border dark:border-primary-foreground">
            <CardContent className="flex flex-col items-start gap-5 px-6 lg:px-[45px] py-6 lg:py-[30px] h-full relative">
              <Input
                className="w-full lg:w-1/2  h-[43px] px-[15px] py-2.5 bg-white dark:bg-[#090920] rounded-[10px] border border-solid border-border dark:border-primary-foreground"
                placeholder="Name*"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />

              <Input
                className="w-full lg:w-1/2 h-[43px] px-[15px] py-2.5 bg-background dark:bg-background rounded-[10px] border border-solid border-border dark:border-primary-foreground"
                placeholder="Wallet address"
                value={formData.walletAddress}
                onChange={(e) =>
                  handleInputChange("walletAddress", e.target.value)
                }
              />

              <Input
                className="w-full lg:w-1/2 h-[43px] px-[15px] py-2.5 bg-background dark:bg-background rounded-[10px] border border-solid border-border dark:border-primary-foreground"
                placeholder="Email address*"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />

              <Textarea
                className="h-[100px] w-full px-5 pt-[15px] pb-2.5 bg-background dark:bg-background rounded-[10px] border border-solid border-border dark:border-primary-foreground text-[#4f5555]"
                placeholder="Your message*"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
              />

              <Button
                className="self-center bg-primary text-[16px] font-light text-background dark:text-primary-foreground rounded-[30px] px-5 py-6 mt-4"
                onClick={handleFormSubmit}
                disabled={isFormSubmitted}
              >
                {isFormSubmitted ? "Submitted!" : "Submit"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
