import React, { useEffect } from "react";
import { FooterSection } from "../../components/FooterSection";
import { ContentSection } from "./sections/ContentSection/ContentSection";
import { HeroSection } from "./sections/HeroSection";
import { useLocation } from "react-router-dom";

export const Community = (): JSX.Element => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 0);
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [pathname, hash]);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <HeroSection />
      <ContentSection />
      <FooterSection />
    </div>
  );
};
