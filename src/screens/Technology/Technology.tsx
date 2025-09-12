import React from "react";
import { ContentSection } from "./sections/ContentSection";
import { FooterSection } from "@/components/FooterSection";
import { HeroSection } from "./sections/HeroSection";

export const Technology = (): JSX.Element => {
  return (
    <main className="flex flex-col min-h-screen w-full">
      <HeroSection/>
      <ContentSection />
      <FooterSection />
    </main>
  );
};
