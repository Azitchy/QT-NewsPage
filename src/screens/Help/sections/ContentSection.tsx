import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

const tutorialCards = [
  {
    image: "/img-1.png",
    title: "Connect MetaMask wallet",
    date: "10/01/2025",
    showDate: true,
  },
  {
    image: "/img-2.png",
    title: "How to participate in PR node stake and election",
    date: "10/01/2025",
    showDate: true,
  },
  {
    image: "/img-3.png",
    title: "How to add LUCA/USDC liquidity",
    date: "10/01/2025",
    showDate: true,
  },
  {
    image: "/img-4.png",
    title: "Create a consensus connection",
    date: "10/01/2025",
    showDate: false,
  },
  {
    image: "/img-5.png",
    title: "How to check and receive total income",
    date: "10/01/2025",
    showDate: false,
  },
  {
    image: "/img-6.png",
    title: "How to purchase LUCA",
    date: "10/01/2025",
    showDate: false,
  },
  {
    image: "/img-7.png",
    title: "How to check consensus connection details",
    date: "10/01/2025",
    showDate: false,
  },
  {
    image: "/img-8.png",
    title: "How to initiate a community proposal",
    date: "10/01/2025",
    showDate: false,
  },
];

const cryptoTokens = [
  {
    name: "Binance",
    price: "$669.27",
    change: "-1.73%",
    changeColor: "#fe5572",
    icon: "/token-icon-14.svg",
  },
  {
    name: "Polygon",
    price: "$0.2415",
    change: "-3.8%",
    changeColor: "#fe5572",
    icon: "/token-icon-18.svg",
  },
  {
    name: "Ethereum",
    price: "$2,564.22",
    change: "-3.6%",
    changeColor: "#fe5572",
    icon: "/token-icon-13.svg",
  },
  {
    name: "AVALANCHE",
    price: "$24.43",
    change: "-3.2%",
    changeColor: "#fe5572",
    icon: "/token-icon-1.svg",
  },
  {
    name: "Bitkub",
    price: "$1.71",
    change: "+1.14%",
    changeColor: "#119b56",
    icon: "/token-icon-7.svg",
  },
  {
    name: "OKExChain",
    price: "$5.78",
    change: "-2.09%",
    changeColor: "#fe5572",
    icon: "/token-icon-2.svg",
  },
  {
    name: "TRON",
    price: "$0.2677",
    change: "-3.22%",
    changeColor: "#fe5572",
    icon: "/token-icon-8.svg",
  },
  {
    name: "THETA",
    price: "$0.9127",
    change: "-5.85%",
    changeColor: "#fe5572",
    icon: "/token-icon-5.svg",
  },
  {
    name: "HECO",
    price: "$0.9127",
    change: "-5.85%",
    changeColor: "#fe5572",
    icon: "/token-icon-4.svg",
  },
  {
    name: "BCH",
    price: "$420.40",
    change: "+0.19%",
    changeColor: "#119b56",
    icon: "/token-icon-9.svg",
  },
];

const cryptoTokensRow2 = [
  {
    name: "SHIB",
    price: "$0.00001455",
    change: "-0.16%",
    changeColor: "#fe5572",
    icon: "/token-icon.svg",
  },
  {
    name: "CAKE",
    price: "$2.88",
    change: "+17.60%",
    changeColor: "#119b56",
    icon: "/token-icon-6.svg",
  },
  {
    name: "FIL",
    price: "$2.88",
    change: "+1.34%",
    changeColor: "#119b56",
    icon: "/token-icon-24.svg",
  },
  {
    name: "ADA",
    price: "$0.7677",
    change: "-0.48%",
    changeColor: "#fe5572",
    icon: "/token-icon-10.svg",
  },
  {
    name: "SOL",
    price: "$175.28",
    change: "-1.38%",
    changeColor: "#fe5572",
    icon: "/token-icon-3.svg",
  },
  {
    name: "LUCA",
    price: "$0.6765",
    change: "-7.54%",
    changeColor: "#fe5572",
    icon: "/token-icon-11.svg",
  },
  {
    name: "VET",
    price: "$0.02824",
    change: "+0.43%",
    changeColor: "#119b56",
    icon: "/token-icon-30.svg",
  },
  {
    name: "ATOM",
    price: "$4.87",
    change: "-0.72%",
    changeColor: "#fe5572",
    icon: "/token-icon-12.svg",
  },
  {
    name: "UNI",
    price: "$6.67",
    change: "+1.89%",
    changeColor: "#119b56",
    icon: "/token-icon-16.svg",
  },
  {
    name: "ETC",
    price: "$18.70",
    change: "+0.50%",
    changeColor: "#119b56",
    icon: "/token-icon-29.svg",
  },
  {
    name: "XRP",
    price: "$2.31",
    change: "-1.08%",
    changeColor: "#fe5572",
    icon: "/token-icon-19.svg",
  },
];

const cryptoTokensRow3 = [
  {
    name: "DOT",
    price: "$4.55",
    change: "-0.69%",
    changeColor: "#fe5572",
    icon: "/token-icon-26.svg",
  },
  {
    name: "WETH",
    price: "$2,627.10",
    change: "+2.18%",
    changeColor: "#119b56",
    icon: "/token-icon-25.svg",
  },
  {
    name: "DODGE",
    price: "$0.2280",
    change: "+0.30%",
    changeColor: "#119b56",
    icon: "/token-icon-27.svg",
  },
  {
    name: "XLM",
    price: "$0.2884",
    change: "-0.08%",
    changeColor: "#fe5572",
    icon: "/token-icon-20.svg",
  },
  {
    name: "DAI",
    price: "$0.9997",
    change: "-0.00%",
    changeColor: "#fe5572",
    icon: "/token-icon-28.svg",
  },
  {
    name: "SCRT",
    price: "$0.2069",
    change: "+0.66%",
    changeColor: "#119b56",
    icon: "/token-icon-15.svg",
  },
  {
    name: "LINK",
    price: "$15.86",
    change: "+0.23%",
    changeColor: "#119b56",
    icon: "/token-icon-17.svg",
  },
  {
    name: "APE",
    price: "$0.6916",
    change: "+3.06%",
    changeColor: "#119b56",
    icon: "/token-icon-23.svg",
  },
  {
    name: "LTC",
    price: "$95.72",
    change: "-0.95%",
    changeColor: "#fe5572",
    icon: "/token-icon-21.svg",
  },
  {
    name: "WBTC",
    price: "$109,583.74",
    change: "+0.11%",
    changeColor: "#119b56",
    icon: "/token-icon-22.svg",
  },
];

const faqItems = [
  {
    question: "What is ATM?",
    answer:
      "ATM is a set of decentralised mechanisms based on multiple blockchains, from which the relative consensus network can emerge.",
    expanded: true,
  },
  {
    question: "Who can use ATM?",
    answer: "",
    expanded: false,
  },
  {
    question: "Where to find and download the ATM mobile app?",
    answer: "",
    expanded: false,
  },
  {
    question: "How to connect with MetaMask wallet?",
    answer: "",
    expanded: false,
  },
  {
    question: "How do I connect to ATM?",
    answer: "",
    expanded: false,
  },
  {
    question: "Is ATM open source?",
    answer: "",
    expanded: false,
  },
  {
    question: "What is ATM composed of?",
    answer: "",
    expanded: false,
  },
  {
    question: "How do I create a Consensus Connection?",
    answer: "",
    expanded: false,
  },
  {
    question: "How do I cancel a connection?",
    answer: "",
    expanded: false,
  },
  {
    question: "How many connections can I create?",
    answer: "",
    expanded: false,
  },
  {
    question: "Which public blockchains does ATM currently support?",
    answer: "",
    expanded: false,
  },
  {
    question: "Are those the only blockchains that will be supported?",
    answer: "",
    expanded: false,
  },
  {
    question: "Is ATM a pyramid scheme or MLS ?",
    answer: "",
    expanded: false,
  },
];

const filterTabs = [
  { label: "ATM", active: true },
  { label: "LUCA", active: false },
  { label: "Community", active: false },
  { label: "Governance", active: false },
];

export const ContentSection = (): JSX.Element => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[600px] bg-gradient-to-br from-blue-50 to-teal-50 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <img
              className="w-[500px] h-[400px] object-contain"
              alt="ATM Made Simple Book"
              src="/atm-made-simple--build-confidence-and-expertise.svg"
            />
            <div className="absolute top-8 right-8 text-right">
              <h1 className="text-4xl font-bold text-teal-600 mb-2">
                ATM Made Simple: Build
              </h1>
              <h2 className="text-3xl font-semibold text-teal-500">
                Confidence and Expertise
              </h2>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col items-start gap-[100px] w-full px-[70px]">
        {/* Usage Guide Section */}
        <section className="relative w-full pt-[100px]">
          <header className="flex items-center gap-[49px] mb-[80px]">
            <img className="w-[99px] h-[99px]" alt="Dots" src="/dots.svg" />
            <h2 className="font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] [font-style:var(--titles-h2-sectionheading-400-font-style)]">
              usage guide
            </h2>
          </header>

          <div className="max-w-[782px] mb-[80px] ml-[148px] font-body-body1-300 font-[number:var(--body-body1-300-font-weight)] text-[#1c1c1c] text-[length:var(--body-body1-300-font-size)] tracking-[var(--body-body1-300-letter-spacing)] leading-[var(--body-body1-300-line-height)] [font-style:var(--body-body1-300-font-style)]">
            If you are a new user of ATM and want to get a better understanding of
            the technology, we offer a series of tutorials on our core
            applications and functions. From the basic concepts and white paper
            explanations to more in-depth application operations, our goal is to
            give you a more comprehensive understanding of ATM.
          </div>

          <div className="flex flex-col items-end gap-5">
            <div className="flex items-center px-[9px] py-[5px] rounded-[40px] border border-solid border-[#eeeeee] gap-[15px]">
              <Button
                variant="ghost"
                size="sm"
                className="w-[38.53px] h-[38.53px] p-0 rounded-full"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-[38.53px] h-[38.53px] p-0 rounded-full bg-[#e9f6f7]"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </Button>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="flex items-center gap-5 min-w-max px-4">
                {tutorialCards.map((card, index) => (
                  <Card
                    key={index}
                    className="flex flex-col w-[300px] h-[280px] border border-solid border-[#eeeeee] rounded-[20px] bg-white shadow-sm"
                  >
                    <CardContent className="flex flex-col p-[15px] bg-[#fbfbfb] rounded-[20px_20px_0px_0px] flex-1">
                      <img
                        className="w-full h-[160px] rounded-[10px] object-cover"
                        alt="Tutorial thumbnail"
                        src={card.image}
                      />
                    </CardContent>

                    <div className="flex flex-col items-start gap-2.5 pt-0 pb-2.5 px-[20px] bg-[#fbfbfb]">
                      <div className="flex items-center justify-center w-full">
                        <div className="flex-1 font-titles-h5-large-text-400 font-[number:var(--titles-h5-large-text-400-font-weight)] text-[#1c1c1c] text-sm tracking-[var(--titles-h5-large-text-400-letter-spacing)] leading-tight [font-style:var(--titles-h5-large-text-400-font-style)]">
                          {card.title}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start px-[20px] py-[15px] bg-[#fbfbfb] rounded-[0px_0px_20px_20px]">
                      <div className="flex items-center justify-between w-full">
                        <div
                          className={`font-body-body3-400 font-[number:var(--body-body3-400-font-weight)] text-[#4f5555] text-xs tracking-[var(--body-body3-400-letter-spacing)] leading-[var(--body-body3-400-line-height)] [font-style:var(--body-body3-400-font-style)] ${!card.showDate ? "opacity-0" : ""}`}
                        >
                          {card.date}
                        </div>

                        <div className="flex items-center gap-1 text-primary-colour">
                          <div className="font-body-body-4-400 font-[number:var(--body-body-4-400-font-weight)] text-xs tracking-[var(--body-body-4-400-letter-spacing)] leading-[var(--body-body-4-400-line-height)] [font-style:var(--body-body-4-400-font-style)]">
                            View PDF
                          </div>
                          <img
                            className="w-[20px] h-[20px]"
                            alt="Arrow right icon"
                            src="/arrow-right-icon-1.svg"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ATM Connect Section */}
        <section className="relative w-full">
          <header className="flex items-center gap-[49px] mb-[80px]">
            <img className="w-[99px] h-[99px]" alt="Dots" src="/dots.svg" />
            <h2 className="font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] [font-style:var(--titles-h2-sectionheading-400-font-style)]">
              atm connect
            </h2>
          </header>

          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-[600px] ml-[148px]">
              <div className="mb-[40px] font-body-body1-300 font-[number:var(--body-body1-300-font-weight)] text-[#1c1c1c] text-[length:var(--body-body1-300-font-size)] tracking-[var(--body-body1-300-letter-spacing)] leading-[var(--body-body1-300-line-height)] [font-style:var(--body-body1-300-font-style)]">
                <span className="font-light">
                  Unlock the ultimate convenience with the{" "}
                </span>
                <span className="font-[number:var(--body-body1-500-font-weight)] font-body-body1-500 [font-style:var(--body-body1-500-font-style)]">
                  ATM Connect app – your go-to solution for seamless connectivity on
                  the go!
                </span>
                <span className="font-light">
                  {" "}
                  Seamlessly connect with friends, access your wallet, keep track of
                  your connections, and dive into your personalised dashboard, all
                  from the palm of your hand.
                </span>
              </div>

              <div className="mb-[40px] font-titles-h5-large-text-400 font-[number:var(--titles-h5-large-text-400-font-weight)] text-[#1c1c1c] text-[length:var(--titles-h5-large-text-400-font-size)] tracking-[var(--titles-h5-large-text-400-letter-spacing)] leading-[var(--titles-h5-large-text-400-line-height)] [font-style:var(--titles-h5-large-text-400-font-style)]">
                Download the ATM Connect app now!
              </div>

              <img
                className="w-[347px] h-[51px]"
                alt="Download buttons"
                src="/download-buttons.svg"
              />
            </div>

            <div className="flex-shrink-0">
              <img
                className="w-[400px] h-[300px] object-contain"
                alt="Atm connect img"
                src="/atm-connect-img.png"
              />
            </div>
          </div>
        </section>

        {/* ATM Multiverse Section */}
        <section className="relative w-full -mx-[70px]">
          <div className="w-full h-[500px] bg-[linear-gradient(0deg,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.4)_100%),url(/atm-mutliverse.png)] bg-cover bg-center relative overflow-hidden">
            <header className="flex items-center gap-[49px] pt-[30px] mb-[60px] px-[70px]">
              <img
                className="w-[99px] h-[99px]"
                alt="Dots"
                src="/dots.svg"
              />
              <h2 className="font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] [font-style:var(--titles-h2-sectionheading-400-font-style)]">
                atm multiverse
              </h2>
            </header>

            <div className="w-full h-[300px] overflow-hidden relative">
              <div className="absolute inset-0 flex flex-col gap-4 animate-pulse">
                <div className="flex items-center gap-4 translate-x-[100px]">
                  {cryptoTokens.slice(0, 8).map((token, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 px-4 py-3 bg-[#fbfbfb] rounded-[10px] min-w-[180px]"
                    >
                      <img
                        className="w-[40px] h-[40px]"
                        alt="Token icon"
                        src={token.icon}
                      />
                      <div className="flex flex-col items-start gap-1">
                        <div className="font-body-body1-500 font-[number:var(--body-body1-500-font-weight)] text-[#1c1c1c] text-sm tracking-[var(--body-body1-500-letter-spacing)] leading-[var(--body-body1-500-line-height)] [font-style:var(--body-body1-500-font-style)]">
                          {token.name}
                        </div>
                        <div className="font-body-body3-400 font-[number:var(--body-body3-400-font-weight)] text-xs tracking-[var(--body-body3-400-letter-spacing)] leading-[var(--body-body3-400-line-height)] [font-style:var(--body-body3-400-font-style)]">
                          <span className="text-[#1c1c1c]">{token.price} </span>
                          <span style={{ color: token.changeColor }}>
                            {token.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 -translate-x-[50px]">
                  {cryptoTokensRow2.slice(0, 8).map((token, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 px-4 py-3 bg-[#fbfbfb] rounded-[10px] min-w-[180px]"
                    >
                      <img
                        className="w-[40px] h-[40px]"
                        alt="Token icon"
                        src={token.icon}
                      />
                      <div className="flex flex-col items-start gap-1">
                        <div className="font-body-body1-500 font-[number:var(--body-body1-500-font-weight)] text-[#1c1c1c] text-sm tracking-[var(--body-body1-500-letter-spacing)] leading-[var(--body-body1-500-line-height)] [font-style:var(--body-body1-500-font-style)]">
                          {token.name}
                        </div>
                        <div className="font-body-body3-400 font-[number:var(--body-body3-400-font-weight)] text-xs tracking-[var(--body-body3-400-letter-spacing)] leading-[var(--body-body3-400-line-height)] [font-style:var(--body-body3-400-font-style)]">
                          <span className="text-[#1c1c1c]">{token.price} </span>
                          <span style={{ color: token.changeColor }}>
                            {token.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 translate-x-[150px]">
                  {cryptoTokensRow3.slice(0, 8).map((token, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 px-4 py-3 bg-[#fbfbfb] rounded-[10px] min-w-[180px]"
                    >
                      <img
                        className="w-[40px] h-[40px]"
                        alt="Token icon"
                        src={token.icon}
                      />
                      <div className="flex flex-col items-start gap-1">
                        <div className="font-body-body1-500 font-[number:var(--body-body1-500-font-weight)] text-[#1c1c1c] text-sm tracking-[var(--body-body1-500-letter-spacing)] leading-[var(--body-body1-500-line-height)] [font-style:var(--body-body1-500-font-style)]">
                          {token.name}
                        </div>
                        <div className="font-body-body3-400 font-[number:var(--body-body3-400-font-weight)] text-xs tracking-[var(--body-body3-400-letter-spacing)] leading-[var(--body-body3-400-line-height)] [font-style:var(--body-body3-400-font-style)]">
                          <span className="text-[#1c1c1c]">{token.price} </span>
                          <span style={{ color: token.changeColor }}>
                            {token.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gradient overlays */}
              <div className="absolute w-[200px] h-full top-0 left-0 bg-gradient-to-r from-black/40 to-transparent" />
              <div className="absolute w-[200px] h-full top-0 right-0 bg-gradient-to-l from-black/40 to-transparent" />
            </div>
          </div>
        </section>

        {/* Q&A Section */}
        <section className="relative w-full">
          <header className="flex items-center gap-[49px] mb-[80px]">
            <img
              className="w-[99px] h-[99px]"
              alt="Dots"
              src="/dots.svg"
            />
            <h2 className="font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] [font-style:var(--titles-h2-sectionheading-400-font-style)]">
              Q&a
            </h2>
          </header>

          <div className="flex flex-col items-end gap-10 ml-[148px] max-w-[1200px]">
            <div className="flex items-center gap-2.5 p-[5px] rounded-[40px] border border-solid border-[#eeeeee]">
              {filterTabs.map((tab, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center gap-2.5 px-[15px] py-2.5 rounded-[100px] overflow-hidden ${
                    tab.active ? "bg-[#e9f6f7]" : ""
                  }`}
                >
                  <div className="font-body-body-4-400 font-[number:var(--body-body-4-400-font-weight)] text-[#2ea8af] text-[length:var(--body-body-4-400-font-size)] tracking-[var(--body-body-4-400-letter-spacing)] leading-[var(--body-body-4-400-line-height)] [font-style:var(--body-body-4-400-font-style)]">
                    {tab.label}
                  </div>
                </div>
              ))}
            </div>

            <Card className="w-full bg-[#fbfbfb] rounded-[10px]">
              <CardContent className="flex flex-col items-start gap-[25px] p-[40px]">
                {faqItems.map((item, index) => (
                  <div key={index} className="w-full">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col items-start gap-[15px] flex-1">
                        <div className="font-body-body1-500 font-[number:var(--body-body1-500-font-weight)] text-[#1c1c1c] text-[length:var(--body-body1-500-font-size)] tracking-[var(--body-body1-500-letter-spacing)] leading-[var(--body-body1-500-line-height)] [font-style:var(--body-body1-500-font-style)]">
                          {item.question}
                        </div>
                        {item.expanded && item.answer && (
                          <div className="font-body-body2-400 font-[number:var(--body-body2-400-font-weight)] text-[#1c1c1c] text-[length:var(--body-body2-400-font-size)] tracking-[var(--body-body2-400-letter-spacing)] leading-[var(--body-body2-400-line-height)] [font-style:var(--body-body2-400-font-style)]">
                            {item.answer}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="w-6 h-6 flex items-center justify-center text-[#2ea8af]">
                          {item.expanded ? "−" : "+"}
                        </div>
                      </div>
                    </div>
                    {index < faqItems.length - 1 && (
                      <div className="w-full h-px bg-[#eeeeee] mt-[25px]" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Connect to ATM Section */}
        <section className="relative w-full pb-[100px]">
          <header className="flex items-center gap-[49px] mb-[80px]">
            <img
              className="w-[99px] h-[99px]"
              alt="Dots"
              src="/dots.svg"
            />
            <h2 className="font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] [font-style:var(--titles-h2-sectionheading-400-font-style)]">
              connect to atm
            </h2>
          </header>

          <div className="relative ml-[148px] max-w-[1200px] h-[800px]">
            {/* Card 1 - Install wallet */}
            <Card className="flex flex-col w-[380px] items-center absolute top-0 left-[400px] shadow-soft-shadow z-30">
              <div className="flex items-center justify-center gap-2.5 px-[30px] py-4 w-full bg-[#e9f6f7] rounded-[20px_20px_0px_0px]">
                <div className="text-[#2ea8af] text-xl font-semibold">
                  1. Install wallet*
                </div>
              </div>

              <CardContent className="flex flex-col items-center gap-[20px] pt-[20px] pb-8 px-8 w-full bg-[#fbfbfb] rounded-[0px_0px_20px_20px] overflow-hidden">
                <div className="flex items-center justify-center gap-2.5 px-2.5 py-3 w-full rounded-[10px] border border-solid border-[#2ea8af]">
                  <div className="flex items-start gap-2.5 flex-1">
                    <img className="w-5 h-5" alt="Tip icon" src="/tip-icon.svg" />
                    <div className="flex-1 font-body-labeltext-400 font-[number:var(--body-labeltext-400-font-weight)] text-[#2ea8af] text-[length:var(--body-labeltext-400-font-size)] tracking-[var(--body-labeltext-400-letter-spacing)] leading-[var(--body-labeltext-400-line-height)] [font-style:var(--body-labeltext-400-font-style)]">
                      To use ATM you need to have a wallet that is connected to
                      the Binance Smart Chain.
                    </div>
                  </div>
                </div>

                <div className="text-sm text-[#1c1c1c] text-center">
                  Install or sign in to MetaMask using the button below and
                  complete the setup.
                </div>

                <Button className="h-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#e0f7fa] rounded-[30px]">
                  <img
                    className="w-5 h-5"
                    alt="Metamask"
                    src="/metamask-1.svg"
                  />
                  <div className="font-body-body3-400 font-[number:var(--body-body3-400-font-weight)] text-[#2ea8af] text-sm">
                    MetaMask
                  </div>
                </Button>

                <div className="text-sm text-[#1c1c1c] text-center">
                  2. Click the 'Add BSC network' button to switch to the
                  BSC network.
                </div>

                <Button className="h-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#e0f7fa] rounded-[30px]">
                  <img className="w-5 h-5" alt="Binance" src="/binance-1.svg" />
                  <div className="font-body-body3-400 font-[number:var(--body-body3-400-font-weight)] text-[#2ea8af] text-sm">
                    Add BSC network
                  </div>
                </Button>

                <div className="text-sm text-[#1c1c1c] text-center">
                  If you're on mobile, reopen this page in the MetaMask app
                  (Menu → Browser). Add LUCA, USDC, and AGT to your wallet using
                  the buttons below.
                </div>

                <div className="flex items-start justify-center gap-3">
                  <Button className="h-auto flex items-center justify-center gap-1 px-3 py-2 bg-[#e0f7fa] rounded-[30px]">
                    <img className="w-4 h-4" alt="Vector" src="/vector.svg" />
                    <div className="font-body-body3-400 font-[number:var(--body-body3-400-font-weight)] text-[#2ea8af] text-xs">
                      LUCA
                    </div>
                  </Button>

                  <Button className="h-auto flex items-center justify-center gap-1 px-3 py-2 bg-[#e0f7fa] rounded-[30px]">
                    <img
                      className="w-4 h-4"
                      alt="Usd coin usdc logo"
                      src="/usd-coin-usdc-logo-1.svg"
                    />
                    <div className="font-body-body3-400 font-[number:var(--body-body3-400-font-weight)] text-[#2ea8af] text-xs">
                      USDC
                    </div>
                  </Button>

                  <Button className="h-auto flex items-center justify-center gap-1 px-3 py-2 bg-[#e0f7fa] rounded-[30px]">
                    <img
                      className="w-4 h-4"
                      alt="Coin icon"
                      src="/coin-icon-1.svg"
                    />
                    <div className="font-body-body3-400 font-[number:var(--body-body3-400-font-weight)] text-[#2ea8af] text-xs">
                      AGT
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 - Connect to ATM */}
            <Card className="flex flex-col w-[380px] items-center absolute top-[100px] left-[50px] -rotate-6 shadow-soft-shadow z-20">
              <div className="flex items-center justify-center gap-2.5 px-[30px] py-4 w-full bg-[#e9f6f7] rounded-[20px_20px_0px_0px]">
                <div className="text-[#2ea8af] text-xl font-semibold">
                  2. Connect to ATM
                </div>
              </div>

              <CardContent className="flex flex-col items-center gap-[20px] pt-[20px] pb-8 px-8 w-full bg-[#fbfbfb] rounded-[0px_0px_20px_20px] overflow-hidden">
                <div className="text-sm text-[#1c1c1c] text-center">
                  Click 'Connect ATM' and sign the message to link your
                  wallet.
                </div>

                <div className="text-sm text-[#1c1c1c] text-center">
                  Don't worry, it's totally secure - it just lets us know
                  that you're really the owner of the wallet!
                </div>

                <div className="flex items-center justify-center gap-2.5 px-2.5 py-3 w-full rounded-[10px] border border-solid border-[#2ea8af]">
                  <div className="flex items-start gap-2.5 flex-1">
                    <img
                      className="w-5 h-5"
                      alt="Tip icon"
                      src="/tip-icon-1.svg"
                    />
                    <div className="flex-1 font-body-labeltext-400 font-[number:var(--body-labeltext-400-font-weight)] text-[#2ea8af] text-[length:var(--body-labeltext-400-font-size)] tracking-[var(--body-labeltext-400-letter-spacing)] leading-[var(--body-labeltext-400-line-height)] [font-style:var(--body-labeltext-400-font-style)]">
                      Explore your dashboard to find everything you need, and
                      click 'Create Connection' when you're ready
                      to start building your social network.
                    </div>
                  </div>
                </div>

                <div className="text-sm text-[#1c1c1c] text-center">
                  Well, that's it! Click the button below and sign the message
                  to begin your journey with ATM:
                </div>

                <Button className="h-auto flex items-center justify-center gap-[15px] px-[15px] py-2.5 rounded-[20px] bg-[linear-gradient(136deg,rgba(170,218,93,1)_0%,rgba(13,174,185,1)_100%)]">
                  <div className="font-body-body3-400 font-[number:var(--body-body3-400-font-weight)] text-white text-sm">
                    Connect ATM
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Card 3 - Fund your wallet */}
            <Card className="flex flex-col w-[380px] items-center absolute top-[120px] right-[50px] rotate-6 shadow-soft-shadow z-10">
              <div className="flex items-center justify-center gap-2.5 px-[30px] py-4 w-full bg-[#e9f6f7] rounded-[20px_20px_0px_0px]">
                <div className="text-[#2ea8af] text-xl font-semibold">
                  3. Fund your wallet
                </div>
              </div>

              <CardContent className="flex flex-col items-center gap-[20px] pt-[20px] pb-8 px-8 w-full bg-[#fbfbfb] rounded-[0px_0px_20px_20px] overflow-hidden">
                <div className="text-sm text-[#1c1c1c] text-center">
                  If you have a new wallet, you'll need to fund it with BNB
                  to use the Binance Smart Chain.
                </div>

                <div className="text-sm text-[#1c1c1c] text-center">
                  Buy BNB in MetaMask using MoonPay or Transak, or purchase from
                  Binance and send it to your wallet (recommended for advanced
                  users).
                </div>

                <div className="flex flex-col w-full items-center gap-2.5 px-6 py-4 bg-[#f9f4fe] rounded-lg">
                  <img
                    className="w-full h-[60px] object-contain"
                    alt="MoonPay"
                    src="/frame-1031.svg"
                  />
                  <div className="font-body-body1-500 font-[number:var(--body-body1-500-font-weight)] text-[#1c1c1c] text-sm text-center">
                    Buy BNB with MoonPay
                  </div>
                  <div className="font-body-body-4-400 font-[number:var(--body-body-4-400-font-weight)] text-[#1c1c1c] text-xs text-center">
                    MoonPay supports popular payment methods, including Visa,
                    Mastercard, Apple / Google / Samsung Pay, and bank transfers
                    in 145+ countries. Tokens deposit into your MetaMask account.
                  </div>
                </div>

                <div className="text-sm text-[#1c1c1c] text-center">
                  Once you have BNB, swap it for LUCA in MetaMask, or use
                  PancakeSwap if you're more experienced. You can then stake
                  LUCA in the network.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};