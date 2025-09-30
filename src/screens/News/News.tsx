import * as React from "react";
import { FooterSection } from "../../components/FooterSection";
import { HeroSection } from "./sections/HeroSection";
import { NewsSection } from "./sections/NewsSection";

export const News = (): JSX.Element => {
  return (
    <div className="relative w-full min-h-screen bg-background dark:bg-background overflow-hidden">
      <HeroSection />
      <NewsSection />
      <FooterSection />
    </div>
  );
};
