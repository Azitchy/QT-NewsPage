import React, { useEffect, useLayoutEffect } from "react";
import { FooterSection } from "../../components/FooterSection";
import { ContentSection } from "./sections/ContentSection/ContentSection";
import { useLocation } from "react-router-dom";

export const Ecosystem = (): JSX.Element => {

  // To scroll to ecology section when routing from other page
  const { hash, pathname } = useLocation();
useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          const yOffset = -400;
          const y =
            element.getBoundingClientRect().top + window.scrollY + yOffset;

          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 0);
    }
  }, [pathname, hash]);
  return (
    <div className="flex flex-col w-full bg-background dark:bg-background">
      <ContentSection />
      <FooterSection />
    </div>
  );
};
