import React from "react";
import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { FundingSection } from "./sections/FundingSection";
import { GameLaunchSection } from "./sections/GameLaunchSection";
import { AtmStarSection } from "./sections/AtmStarSection";
import { RewardsSection } from "./sections/RewardsSection";
import { AtmRankSection } from "./sections/AtmRankSection";
import { FooterSection } from "@/components/FooterSection";

export const Games = () => {
  return (
    <div className="flex flex-col w-full bg-background">
      <HeroSection />
      <AboutSection />
      <FundingSection />
      <GameLaunchSection />
      <AtmStarSection />
      <RewardsSection />
      <AtmRankSection />
      <FooterSection />
    </div>
  );
};
