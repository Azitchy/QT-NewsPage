import React from "react";
import { FooterSection } from "../../components/FooterSection";
import { ContentSection } from "./sections/ContentSection";
import { HeroSection } from "./sections/HeroSection";

export const Help = (): JSX.Element => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <HeroSection />
      <ContentSection />
      <FooterSection />
    </div>
  );
};