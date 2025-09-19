import React from "react";
import { FooterSection } from "@/components/FooterSection";
import { ContentSection } from "./sections/ContentSection/ContentSection";
import { HeroSection } from "./sections/HeroSection";

export const Travel = (): JSX.Element => {
  return (
    <main className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <HeroSection />
      <ContentSection />
      <FooterSection />
    </main>
  );
};
