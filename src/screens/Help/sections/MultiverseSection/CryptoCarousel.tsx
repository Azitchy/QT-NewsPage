import React from "react";
import { cryptoTokens, CryptoToken } from "./cryptoTokens";

// Crypto Card Component
const CryptoCard: React.FC<{ token: CryptoToken }> = ({ token }) => (
  <a
    href={token.link}
    target="_blank"
    rel="noopener noreferrer"
    className="relative flex items-center w-fit px-[20px] py-[15px] rounded-[10px] bg-[#FBFBFB] gap-[26px] mx-2 flex-shrink-0 cursor-pointer transition-shadow hover:shadow-md hover:bg-[#FBFBFB]/80"
  >
    <img
      className="w-[50px] h-[50px] relative z-10"
      alt={`${token.name} icon`}
      src={token.icon}
      loading="lazy"
    />
    <div className="flex flex-col items-start gap-1 relative z-10">
      <div className="text-[#1C1C1C] font-inter text-[18px] font-medium leading-6">
        {token.name}
      </div>
      <div className="font-inter text-[14px] font-normal leading-[19px]">
        <span className="text-[#1c1c1c]">{token.price} &nbsp;</span>
        <span style={{ color: token.changeColor }}>{token.change}</span>
      </div>
    </div>
  </a>
);

// Carousel Row Component
const CarouselRow: React.FC<{ tokens: CryptoToken[]; speed: number }> = ({
  tokens,
  speed,
}) => {
  const tripleTokens = [...tokens, ...tokens, ...tokens];

  return (
    <div className="relative overflow-hidden w-full">
      {/* Left gradient fade */}
      <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />

      {/* Right gradient fade */}
      <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <div
        className="flex animate-scroll-left-to-right group-hover:[animation-play-state:paused]"
        style={{
          animationDuration: `${speed}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {tripleTokens.map((token, index) => (
          <CryptoCard key={`${token.name}-${index}`} token={token} />
        ))}
      </div>
    </div>
  );
};

export const CryptoCarousel = () => {
  return (
    <div className="group">
      {" "}
      {/* group wraps the WHOLE carousel */}
      <style>{`
        @keyframes scrollLeftToRight {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .animate-scroll-left-to-right {
          animation: scrollLeftToRight linear infinite;
        }
      `}</style>
      <div className="space-y-6">
        <CarouselRow tokens={cryptoTokens.row1} speed={40} />
        <CarouselRow tokens={cryptoTokens.row2} speed={50} />
        <CarouselRow tokens={cryptoTokens.row3} speed={60} />
      </div>
    </div>
  );
};
