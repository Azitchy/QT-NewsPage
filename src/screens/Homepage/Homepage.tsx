import * as React from "react";
import { ContentSection } from "./sections/ContentSection";
import { FirstScreenSection } from "./sections/FirstScreenSection";
import { FooterSection } from "../../components/FooterSection";

export const Homepage = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full bg-background dark:bg-background">
      <FirstScreenSection />
      <ContentSection />
      <FooterSection />
    </div>
  );
};
