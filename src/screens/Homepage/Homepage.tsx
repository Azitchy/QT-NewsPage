import React from "react";
import { ContentSection } from "./sections/ContentSection";
import { FirstScreenSection } from "./sections/FirstScreenSection";
import { FooterSection } from "../../components/FooterSection";

export const Homepage = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full bg-white dark:bg-[#090920]">
      <FirstScreenSection />
      <ContentSection />
      <FooterSection />
    </div>
  );
};
