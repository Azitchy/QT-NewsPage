import { HeadingWithDots } from "@/components/HeadingWithDots";
import { ConnectToATMCard, FundWalletCard, InstallWalletCard } from "./ConnectCards";
import { useState } from "react";

export const ConnectCardsSection = (): JSX.Element => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="px-[16px] md:px-[30px] large:px-[120px] pt-[60px] 2xl:pt-[100px] mb-[120px]">
      <HeadingWithDots text="connect to atm" />

      {/* Mobile: Cards stacked vertically, horizontally centered */}
      <div className="pt-[20px] flex flex-col items-center gap-[30px] md:hidden">
        <InstallWalletCard />
        <ConnectToATMCard />
        <FundWalletCard />
      </div>

      {/* MD and up (but not 2xl): Card 1 and 2 on first row, Card 3 below them */}
      <div className="pt-[20px] hidden md:flex 2xl:hidden flex-col items-center gap-[30px]">
        <div className="flex items-center gap-[30px]">
        <InstallWalletCard />
        <ConnectToATMCard />
        </div>
        <FundWalletCard />
      </div>

      {/* 2xl and bigger: InstallWallet centered, ConnectToATM left, FundWallet right with hover animations */}
      <div className="pt-[20px] hidden 2xl:flex items-center justify-center">
        <div className="relative">
          {/* Card 1 - Connect to ATM (Left, Rotated) */}
          <div 
            className={`absolute left-0 -bottom-24 -translate-x-[95%] transition-all duration-700 ease-out ${
              hoveredCard === 'card1' 
                ? 'z-30 rotate-0 opacity-100 w-[410px]' 
                : hoveredCard 
                  ? 'z-10 -rotate-[10deg] opacity-40 w-[410px]' 
                  : 'z-10 -rotate-[10deg] opacity-100 w-[400px]'
            }`}
            onMouseEnter={() => setHoveredCard('card1')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <ConnectToATMCard className="w-full !max-w-none" />
          </div>

          {/* Card 2 - Install Wallet (Center) */}
          <div 
            className={`z-20 relative transition-all duration-700 ease-out ${
              hoveredCard === 'card2' 
                ? 'z-30 rotate-0 opacity-100 w-[410px]' 
                : hoveredCard 
                  ? 'z-20 rotate-0 opacity-40 w-[410px]' 
                  : 'z-20 rotate-0 opacity-100 w-[400px]'
            }`}
            onMouseEnter={() => setHoveredCard('card2')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <InstallWalletCard className="w-full !max-w-none" />
          </div>

          {/* Card 3 - Fund Wallet (Right, Rotated) */}
          <div 
            className={`absolute right-0 -bottom-24 translate-x-[95%] transition-all duration-700 ease-out ${
              hoveredCard === 'card3' 
                ? 'z-30 rotate-0 opacity-100 w-[410px]' 
                : hoveredCard 
                  ? 'z-10 rotate-[10deg] opacity-40 w-[410px]' 
                  : 'z-10 rotate-[10deg] opacity-100 w-[400px]'
            }`}
            onMouseEnter={() => setHoveredCard('card3')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <FundWalletCard className="w-full !max-w-none" />
          </div>
        </div>
      </div>
    </section>
  );
};