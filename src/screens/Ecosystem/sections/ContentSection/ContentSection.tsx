import * as React from "react";
import { HeroSection } from "../HeroSection";
import { MainSection } from "../MainSection";
import { CommunitySection } from "../CommunitySection";
import { ThirdPartySection } from "../ThirdPartySection";
import { CallSection } from "../CallSection";

export const ContentSection = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full mx-auto px-4 lg:px-12 gap-10">
      <HeroSection />
      <MainSection />
      <CommunitySection />
      <ThirdPartySection />
      <CallSection />
    </div>
  );
};
