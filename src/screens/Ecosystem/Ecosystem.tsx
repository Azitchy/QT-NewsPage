import React from "react";
import { FooterSection } from "../../components/FooterSection";
import { ContentSection } from "./sections/ContentSection/ContentSection";

export const Ecosystem = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full bg-white">
      <ContentSection />
      <FooterSection />
    </div>
  );
};